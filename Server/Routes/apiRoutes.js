const {rateLimit} = require("express-rate-limit");
const express = require("express");
require("dotenv").config();
const {
  HandleSignup,
  HandleLogin,
  checkauth,
} = require("../Controllers/auth/auth");
const { isAuthenticated } = require("../Controllers/auth/auth");
const HandleCategories = require("../Controllers/Categories");
const { searchQuestions } = require("../Controllers/search");
const { getquestionbyId } = require("../Controllers/search");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const HandleQuestionbytopic = require("../Controllers/Question");
const {
  getBookmarks,
  addtoBookmarks,
  DeleteBookmark,
} = require("../Controllers/Bookmarks");
const {
  getCompleted,
  addtoCompleted,
  DeleteCompleted,
} = require("../Controllers/Completed");

const router = express.Router();

const requireAuth = (req, res, next) => {
  try {
    if (isAuthenticated(req)) return next();
  } catch (e) {}
  return res.status(401).json({ error: "Unauthorized" });
};

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    status: 429,
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, 
  message: {
    status: 429,
    error: "Too many signup attempts. Please try again later.",
  },
});











router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.post("/api/v1/auth/register",signupLimiter, HandleSignup);
router.post("/api/v1/auth/login",loginLimiter, HandleLogin);

router.get("/api/v1/auth/checkauth", checkauth);

router.get("/api/v1/user/bookmarks", requireAuth, getBookmarks);
router.post("/api/v1/user/bookmarks", requireAuth, addtoBookmarks);
router.post("/api/v1/user/bookmarks/delete", requireAuth, DeleteBookmark);

router.get("/api/v1/user/completed", requireAuth, getCompleted);
router.post("/api/v1/user/completed", requireAuth, addtoCompleted);
router.post("/api/v1/user/completed/delete", requireAuth, DeleteCompleted);

router.get("/api/categories", requireAuth, HandleCategories);
router.get("/api/getQuestions", requireAuth, HandleQuestionbytopic);

router.get("/api/search", requireAuth, searchQuestions);
router.get("/api/search/id", requireAuth, getquestionbyId);

module.exports = router;
