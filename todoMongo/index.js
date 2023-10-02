const express=require("express");
const mongoose = require("mongoose");

const Todo=require("./models/todoSchema");
const User=require("./models/UserSchema")
const {LoggerMiddleware} = require("./middlewares/LoggerMiddleware")
const {isAuth} = require("./middlewares/AuthMiddleware")
const {isUserExisting}=require("./utils/UserNameCheck")

const app=express();
const PORT=8004;
const bcrypt=require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config(); // in node we require to do this for .env

app.use(express.json());

const SALT_ROUNDS=10;
 
//Post-creating new user

app.post("/register", async (req, res) => {

      const userBody = req.body; // user is sending
      const userExist = await isUserExisting(userBody.username);
      if(userExist) {
        res.send({
            status:400,
            message:"Username already exists"
        })
        return;
      }

      const hashedPassword = await bcrypt.hash(userBody.password, SALT_ROUNDS);
      const userObj = new User({
        username: userBody.username,
        password: hashedPassword,
        email: userBody.email,
      });
      await userObj.save();
  
      res.status(200).send("user has been created");
    })
  //Post -login 
  app.post("/login", async (req, res) => {
    
      const loginBody = req.body;  // send by the user
      let userData ; 
  try{
     userData = await User.findOne({ username: loginBody.username }); // data in database and it returns all document
  }catch(err){
    res.status(400).send({
      status:400,
      message:"user fetching failed!"
    })
  }

  let isPasswordSame;
  try{
     isPasswordSame = await bcrypt.compare(
      loginBody.password,  
      userData.password
    );
  } catch(err){
    res.status(400).send({
      status:400,
      message:"Bycrypt failed"
    })
  }
    //JWT auth
      let payload = {
        username: userData.username,
        password: userData,
        email: userData.email,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);


      if (isPasswordSame) {
        return res.status(200).send({
          status:200,
          message:"Successfully logged in",
          token : token
        });
      } else {
         return res.status(400).send("Incorrect password,please re-enter");
      }
    });




//Post-creating new todo
app.post("/todo",(req,res) => {
    const {task,isCompleted,username} = req.body;
 //if user donot send anything
    if(task.length ==0 || isCompleted==null || username.length==0) {
        res.send({
            status:400,
            message:"please enter the value in correct format"
        })
    }

    try{
        const todoObj =new Todo({
            task:task,
            isCompleted:isCompleted,
            username : username
        })
        todoObj.save();
        res.status(200).send("New todo is created");
    } catch(err){
        res.status(500).send("Internal server error")
    }
})
// GET-Fetch all todos

app.get("/todos/:username", isAuth, async (req,res) => {
    try{
      //for pagination
        const username = req.params.username;
        const page = req.query.skip || 1; //client
        const LIMIT =5;  //backend

        // const todos = await Todo.aggregate([
        //   {$match: {username:username}},
        //   {$sort:{time:-1}} ,
        //   {
        //     $facet: {
        //       data:[{$skip: (parseInt(page) -1) * LIMIT}, {$limit:LIMIT}],
        //     },
        //   }
        // ]);
        //same thing which is commented above
        const todos=await Todo.find({username}).sort({time:-1})  //1 is for ascending and -1 if for descending
        .skip((parseInt(page) -1) * LIMIT)
        .limit(LIMIT);
         
       res.status(200).send({
        status:200,
        message:"fetched all todo successfully",
        data:todos,
       })
    } catch(err){
       res.status(500).send("Internal server error")
    }
})

// GET-fetch single todo based on id

app.get("/todo/:id", isAuth,async (req,res) => {
    try{
       const todoId=req.params.id
       const todoObj=await Todo.findById(todoId)
       res.status(200).json(todoObj)
    } catch(err){
       res.status(500).send("Internal server error")
    }
})

//delete - delete the todo

app.delete("/todo/:id", isAuth,async (req,res) => {
    try{
       const todoId=req.params.id
       await Todo.findByIdAndDelete(todoId)
       res.status(200).json("Todo is deleted succesfully")
    } catch(err){
       res.status(500).send("Internal server error")
    }
})

// put -update todo based on id

app.put("/todo",isAuth, async (req,res) => {
    try{
       const updatedTodoData=req.body
       await Todo.findByIdAndUpdate(updatedTodoData.id,{
        isCompleted:updatedTodoData.isCompleted,
       })
       res.status(200).json("updated successfulyy")
    } catch(err){
       res.status(500).send("Internal server error")
    }
})


mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>console.log("MongoDB is connected"))
.catch((err) => console.log(err));

app.listen(PORT,() => {
    console.log("server is running at ",PORT);
})