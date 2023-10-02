const express=require("express")

const app=express();

app.use(express.json()); // when we work with post method then we use this

// creating endPoint for add operation
// example query="/add?num1=5&num2=10"

app.get("/add",(req,res)=>{
    const num1 =parseInt(req.query.num1)
    const num2 =parseInt(req.query.num2)
    const sum=num1+num2;    


    if(num2<=0){
        res.status(400).send("Enner a valid number")
    }


    res.status(200).json(sum);
   

})
// claculate api using body data
// add

app.post("/add",(req,res)=>{
    const numArray=req.body.nums
    let sum=0;  
    for(let i=0;i<numArray.length;i++){
        sum+=numArray[i];
    }

    res.status(200).json(sum);
})



app.listen(8003, ()=>{
    console.log("server is running on 8003")
})