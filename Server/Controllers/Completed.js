const { default: mongoose } = require("mongoose");
const Question = require("../Models/Question");
const UserData = require("../Models/UserData");

const getCompleted = async (req, res) => {
  try {
    const userID = req.query.UserID;

    const user = await UserData.findOne({ UserID: userID });
    return res.json({
      Completed: [...user?.CompletedQuestions],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const addtoCompleted = async (req, res) => {
  try {
    const userID = req.body.UserID;
    const QuesID = req.body.QuesID;
    const user = await UserData.findOneAndUpdate(
      { UserID: userID },
      // prevent duplicates
      { $addToSet: { CompletedQuestions: QuesID } },
      { new: true }
    );
    if (!user) return res.json({ Completed: [] });
    return res.json({ Completed: [...user.CompletedQuestions] });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const DeleteCompleted = async (req, res) => {
  try {
    const userID = req.body.UserID;
    const QuesID = req.body.QuesID;
    const user = await UserData.findOneAndUpdate(
      { UserID: userID },
      { $pull: { CompletedQuestions: QuesID } },
      { new: true }
    );
    if (!user) return res.json({ Completed: [] });
    return res.json({ Completed: [...user.CompletedQuestions] });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { getCompleted, addtoCompleted, DeleteCompleted };
