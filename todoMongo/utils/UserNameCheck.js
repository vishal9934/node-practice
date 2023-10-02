const User = require("../models/UserSchema")

const isUserExisting= async (username) =>{
    try{
        var userData=await User.findOne({username});
    }catch(e){
        console.log(e);
    }
    
    if(userData){
        return true;
    }else{
        return false;
    }
};

module.exports = {isUserExisting};