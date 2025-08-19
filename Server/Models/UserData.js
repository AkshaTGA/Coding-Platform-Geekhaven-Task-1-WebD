const mongoose=require("mongoose")



const UserDataSchema=mongoose.Schema({
        Name:{
            type:String,
            required:true
        },
        UserID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userlogin",
            required:true
        },
        BookmarkedQuestions:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Question"
        }],
        CompletedQuestions:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Question"
        }],
        
})

const UserData=mongoose.model("UserData",UserDataSchema)


module.exports=UserData;