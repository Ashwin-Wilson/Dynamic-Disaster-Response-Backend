const mongoose = require("mongoose");

async function connectMongoDB(url) {
  mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB database"))
    .catch((err) =>
      console.log("Issue in connecting with MongoDB database : ", err)
    );
}

module.exports = { connectMongoDB };
