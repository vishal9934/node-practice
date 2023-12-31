
const Mongoose=require("mongoose");
const Schema=Mongoose.Schema;

const user= new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false,
        unique:true
    },
},
{
    strict:false,
}
);
module.exports =Mongoose.model("users",user) ;