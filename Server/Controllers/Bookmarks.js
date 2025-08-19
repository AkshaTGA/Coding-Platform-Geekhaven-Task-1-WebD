const Question = require("../Models/Question");
const UserData = require("../Models/UserData");

const getBookmarks = async (req, res) => {
  try {
    const userID = req.query.UserID;

    const user = await UserData.findOne({ UserID: userID });
    if (!user) return res.json({ Bookmark: [] });
    // return deduped bookmark ids
    const uniq = Array.from(new Set(user.BookmarkedQuestions || []));
    return res.json({ Bookmark: uniq });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const addtoBookmarks = async (req, res) => {
  try {
    const userID = req.body.UserID;
    const QuesID = req.body.QuesID;
    const user = await UserData.findOneAndUpdate(
      { UserID: userID },
      // use $addToSet to avoid duplicate entries
      { $addToSet: { BookmarkedQuestions: QuesID } },
      { new: true }
    );
    if (!user) {
      return res.json({ Bookmark: [] });
    }
    return res.json({ Bookmark: [...user.BookmarkedQuestions] });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const DeleteBookmark = async (req, res) => {
  try {
    const userID = req.body.UserID;
    const QuesID = req.body.QuesID;
    const user = await UserData.findOneAndUpdate(
      { UserID: userID },
      { $pull: { BookmarkedQuestions: QuesID } },
      { new: true }
    );
    if (!user) {
      return res.json({ Bookmark: [] });
    }
    return res.json({ Bookmark: [...user.BookmarkedQuestions] });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { getBookmarks, addtoBookmarks, DeleteBookmark };
