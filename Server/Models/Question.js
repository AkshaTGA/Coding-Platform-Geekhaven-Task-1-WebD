const mongoose=require("mongoose")



const QuestionSchema=mongoose.Schema({
        title:{
            type:String,
        },
        url:{
            type:String,
        },
        difficulty:{
            type:String,
            enum: ["Easy", "Medium", "Hard"]
        }
})

const questions=mongoose.model("Question",QuestionSchema)


module.exports=questions;