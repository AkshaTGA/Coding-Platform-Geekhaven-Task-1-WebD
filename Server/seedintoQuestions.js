const mongoose = require("mongoose");
const axios = require("axios");
const questions = require("./Models/Question");
const ConnectToMongoDB = require("./MongoConnect");
require("dotenv").config();

ConnectToMongoDB(process.env.atlas_url);

const addintoQuestion = async (payload) => {
  return await questions.create(payload);
};


const difficulty = ["Easy", "Medium", "Hard"];

const getdifficulty = () => {
  let a = Math.floor(Math.random() * 3);
  return difficulty[a];
};

const seed = async () => {
  const base_url = "https://test-data-gules.vercel.app/data.json";
  const response = await axios(base_url);

  const topics = response.data.data;

  for (const topic of topics) {
    for (const question of topic.ques) {
      if (question.p1_link && question.p1_link !== "null") {
        const payload = {
          title: question.title,
          url: question.p1_link,
          difficulty: getdifficulty(),
        };

        await addintoQuestion(payload);
        console.log(payload.title + " --------------------> Done");
      }

      if (question.p2_link && question.p2_link !== "null") {
        const payload = {
          title: question.title,
          url: question.p2_link,
          difficulty: getdifficulty(),
        };
        await addintoQuestion(payload);
        console.log(payload.title + " --------------------> Done");
      }
    }
  }

  console.log("Done!!!");
};

seed();
