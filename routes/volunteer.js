const express = require("express");
const router = express.Router();
const {
  handleFamilySignup,
  handleFamilyLogin,
  handleFamilyUpdate,
} = require("../controller/family");

router.post("/signup", handleFamilySignup);

module.exports = router;
