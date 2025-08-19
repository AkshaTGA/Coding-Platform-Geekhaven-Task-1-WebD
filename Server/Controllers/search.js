const Question = require("../Models/Question");

const searchQuestions = async (req, res) => {
  try {
    const search = req.query.q;
    const page = parseInt(req.query.page) || 1;
   

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const questions = await Question.find(query)
    const total = await Question.countDocuments(query);

    res.json({
      page,
      total,
      questions,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};



const getquestionbyId = async (req, res) => {
  try {
    const id = req.query.id;
   

    const query = id ? { _id: id } : {};

    const question = await Question.find(query)

    res.json({
      question
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports =  {searchQuestions,getquestionbyId} ;
