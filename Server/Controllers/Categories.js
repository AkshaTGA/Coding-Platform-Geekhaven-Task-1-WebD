const Category = require("../Models/Categories");




const HandleCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const categories = await Category.find()
            .skip(skip)
            .limit(limit);
        const total = await Category.countDocuments();


const fetchedsofar=()=>{
        if(skip+limit>=total){
            return  total
        }else{
            return skip+limit
        }
}


        res.json({
            page,
            limit,
            total,
            soFar:fetchedsofar(),
            categories
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};


module.exports=HandleCategories;