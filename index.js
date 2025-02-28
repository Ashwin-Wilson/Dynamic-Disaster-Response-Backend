const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//connections
const { connectMongoDB } = require("./connections");

//routes
const adminRouter = require("./routes/admin");
const familyRouter = require("./routes/family");
const driverRouter = require("./routes/driver");
const caretakerRouter = require("./routes/caretaker");

//connecting with MongoDB
connectMongoDB("mongodb://127.0.0.1:27017/ashwin");

// middlewares
mongodb: app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); //for formdata

//routes
app.use("/admin", adminRouter);
app.use("/family", familyRouter);
app.use("/driver", driverRouter);
app.use("/volunteer", driverRouter);
app.use("/caretaker", caretakerRouter);

app.get("/", (req, res) => {
  return res.end("Ashwin Wilson");
});

app.listen(8000, (req, res) => console.log("Server is running"));
