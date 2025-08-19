const mongoose = require("mongoose");
const axios = require("axios");
const Category = require("./Models/Categories");
const questions = require("./Models/Question");
const ConnectToMongoDB = require("./MongoConnect");
require("dotenv").config();

ConnectToMongoDB(process.env.atlas_url).then(() =>
  console.log("Conneted to MONGODB")
);

const addintoCategory = async (payload) => {
  return await Category.create(payload);
};
const seed = async () => {
  const base_url = "https://test-data-gules.vercel.app/data.json";
  const response = await axios(base_url);

  const topics = response.data.data;

  const ques = await questions.find({});
  let i = 0;
  for (let topic of topics) {
    let arr = [];
    for (let question of topic.ques) {
      if (question.p1_link) {
        arr.push(ques[i]._id);
        i++;
      }
      if (question.p2_link) {
        arr.push(ques[i]._id);
        i++;
      }
    }
    const payload = {
      title: topic.title,
      questions: arr,
    };
    await addintoCategory(payload).then(()=>console.log(topic.title+"------------>Done"));
  }
  console.log("Done!!!");
  mongoose.disconnect();
};

seed();
