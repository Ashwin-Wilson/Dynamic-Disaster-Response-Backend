const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");
const {
  handleFamilySignup,
  handleFamilyLogin,
  handleFamilyUpdate,
} = require("../controller/family");

router.post("/signup", handleFamilySignup);
router.get("/login", handleFamilyLogin);
router.post("/update", handleFamilyUpdate);
// router.delete("/remove-admin", checkAuth("family"), handleFamilyDelete);

module.exports = router;
