const express = require("express");
const router = express.Router();
const {
  handleFamilySignup,
  handleFamilyLogin,
  handleFamilyUpdate,
  handleGetFamilyById,
} = require("../controller/family");

router.post("/signup", handleFamilySignup);
router.post("/login", handleFamilyLogin);
router.post("/update", handleFamilyUpdate);
router.get("/get-family-by-id", handleGetFamilyById);

// router.delete("/remove-admin", checkAuth("family"), handleFamilyDelete);

module.exports = router;
