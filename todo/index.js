const express=require("express");
const fs=require("fs");

const app=express();

const PORT=8000

app.use(express.json());  // it is used to convert http request format into json format

// create a todo app
app.post("/todo",(req,res)=>{
        try{
         const newTodo=req.body;
        const fileData=JSON.parse(fs.readFileSync("./database.json").toString());
        fileData.todos.push(newTodo);
        fs.writeFileSync("./database.json",JSON.stringify(fileData));

        res.status(201).send("todos is successfully created")
        }
        catch (err){
         res.status(500).json({messeage:err});
        }
        
})

//get all todos

app.get("/todos",(req,res) =>{
        try{

                const fileData=JSON.parse(fs.readFileSync("./database.json").toString());
                const todos=fileData.todos;
                res.status(200).json({todos})

        } catch(err){
       res.status(500).json({messeage:err})
        }
})


// Get single todo

app.get("/todos/:id", (req, res) =>{
        try{
         const todoId=req.params.id;
         const fileData=JSON.parse(fs.readFileSync("./database.json").toString());
         const todoList = fileData.todos;
         var todoWithId=todoList.filter((t) => t.id == todoId);
         res.status(200).json(todoWithId)
        } catch(err){
            res.status(500).json({messeage:err});
        }
})

// Delete a todo

app.delete("/todo/:id", (req, res) =>{
        try{
         let todoId=req.params.id;
         let fileData=JSON.parse(fs.readFileSync("./database.json").toString());
         let todoList = fileData.todos;
         var listOftodoAfterDeleting=todoList.filter((t) => t.id != todoId);

         fileData.todos=listOftodoAfterDeleting;
         fs.writeFileSync("./database.json",JSON.stringify(fileData));


         res.status(200).send("data is deleted")
        } catch(err){
            res.status(500).json({messeage:err});
        }
})

//PUT -update a todo
app.put("/todo/:id", (req, res) =>{
        try{
         let todoId=req.params.id;
         const updateTodoBody=req.body;

         let fileData=JSON.parse(fs.readFileSync("./database.json").toString());

           let todoList = fileData.todos;
           for(let i=0;i<todoList.length;i++){
                if(todoList[i].id==todoId){
                        //updating the data
                        fileData.todos[i]=updateTodoBody;
                        break;
                }
           }

         fs.writeFileSync("./database.json",JSON.stringify(fileData));
         res.status(200).send("data is updated")
        } catch(err){
            res.status(500).json({messeage:err});
        }
})


app.listen(PORT,()=>{
        console.log("serving is running",PORT)
})





// {
//         "id":"1",
//         "task":"complete fs module",
//         "time":"2023-08-12",
//         "isCompleted":false
    
//     }