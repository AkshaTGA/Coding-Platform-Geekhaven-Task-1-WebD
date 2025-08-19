const users = require("../../Models/users");
const bcrypt = require("bcrypt");

const { setsessionID, getsessionID } = require("./jwt");
const UserData = require("../../Models/UserData");

const isAuthenticated = (req, res) => {
  const token = req?.cookies?.uid;
  try {
    const valid = getsessionID(token);

    if (!valid || valid == "null") {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const HandleSignup = async (req, res) => {
  if (isAuthenticated(req, res) == true) {
    return res.redirect("/problems");
  }
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      status: "Signup Failed",
    });
  }

  const exists = await users.findOne({Email: email });
  if (exists) {
    return res.status(400).json({
      status: "User Already Exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users
    .create({
      Name: username,
      Email: email,
      Password: hashedPassword,
    })
    .then(async () => {
      const user = await users.findOne({ Name: username, Email: email });
      const UserID = user._id;
      UserData.create({
        Name: username,
        UserID: UserID,
        BookmarkedQuestions: [],
        CompletedQuestions: [],
      }).then(() => {
        res.status(201).json({
          status: "Signup Sucessful",
        });
      });
    })
    .catch((err) => {
      console.error("Failed to create new user:" + err);
      res.status(400).json({
        status: "Signup Failed",
      });
    });
};

const HandleLogin = async (req, res) => {
  if (isAuthenticated(req, res) == true) {
    return res.redirect("/problems");
  }
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      status: "Required Fields not found",
    });
  }
  const exists = await users.findOne({ Email: email });

  if (exists) {
    const match = await bcrypt.compare(password, exists.Password);
    if (exists.Email == email && match) {
      const token = setsessionID(exists);
      res.cookie("uid", token);
      return res.status(202).json({
        status: "Login Sucessful",
      });
    } else {
      return res.status(400).json({
        status: "Invalid Credentials",
      });
    }
  }
  return res.status(404).json({
    status: "User Not Found",
  });
};

const checkauth = (req, res) => {
  const ans = isAuthenticated(req);
  data = getsessionID(req?.cookies?.uid);
  userID=data?.id
  res.json({
    authenticated: ans,
    userID: ans ? userID : null,
    Name:ans?data.Name:null,
  Email:ans?data.Email:null
  });
};

module.exports = { HandleSignup, HandleLogin, isAuthenticated, checkauth };
