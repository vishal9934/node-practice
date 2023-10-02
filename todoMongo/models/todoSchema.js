
const Mongoose=require("mongoose");
const Schema=Mongoose.Schema;

const todo= new Schema({
    task:{
        type:String,
        required:true
    },
    isCompleted:{
        type:Boolean,
        required:true
    },
    Time:{
        type:Date,
        default:Date.now(),
        required:false
    },
    username:{
        type: String ,
        required : true
    }
},
{
    strict:false,
}
);
module.exports =Mongoose.model("todos",todo) ;