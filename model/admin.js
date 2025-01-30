const mongoose = require("mongoose");

//Creating admin schema
const adminSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Creating admin model
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
