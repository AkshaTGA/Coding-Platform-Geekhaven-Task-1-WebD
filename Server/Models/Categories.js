const mongoose=require("mongoose")



const CategorySchema=mongoose.Schema({
        title:{
            type:String,
        },
        questions:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Question"
        }],
        
})

const Category=mongoose.model("Category",CategorySchema)


module.exports=Category;