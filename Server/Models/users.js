const mongoose=require("mongoose")

const UserSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        unique:true,
        required:true
    },
    Password:{
        type:String,
        required:true,
    }
})


const users=mongoose.model("UserLogin",UserSchema)

module.exports=users;