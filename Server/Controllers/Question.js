const Category = require("../Models/Categories");
const Question = require("../Models/Question");

const HandleQuestionbytopic = async (req, res) => {
  try {
    const topicId = req.query.topicid;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const topic = await Category.findById(topicId);

    const questionIdList = topic.questions;

    const selectedIds = questionIdList.slice(skip, skip + limit);

    const questionList = await Question.find({ _id: { $in: selectedIds } });
const fetchedsofar=()=>{
        if(skip+limit>=questionIdList.length){
            return  questionIdList.length
        }else{
            return skip+limit
        }
}
    res.json({
      status: true,
      totalQuestions: questionIdList.length,
      SoFar:fetchedsofar(),
      fetched: questionList.length,
      questions: questionList,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = HandleQuestionbytopic;
