// import express from "express";
const express=require("express")

const app=express();

app.get("/test",(req,res)=>{
    res.status(200).json({
        data:{
            name:"vishal verma",
            place:"Dhanbad",
            age:35,
            interest:["games","travelling","cricket","football","swimming"]
        }
    })
})
//params
app.get("/profile/:userId",(req,res)=>{
    // console.log(req.params.userId)
const userId=req.params.userId
const userdata="db call"
res.status(200).json(userdata)
})
//query
app.get("/profile",(req,res)=>{
    const name=req.query.name
    console.log(name)
})

app.listen(8002, ()=>{
    console.log("server is running")
})