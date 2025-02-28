const express = require("express");
const router = express.Router();
const {
  handleCaretakerSignup,
  handleCaretakerLogin,
  handleCaretakerUpdate,
  handleShelterCreate,
  handleGetShelterById,
} = require("../controller/caretaker");

router.post("/signup", handleCaretakerSignup);
router.post("/login", handleCaretakerLogin);
router.post("/update", handleCaretakerUpdate);
router.post("/shelter/create", handleShelterCreate);
router.get("/shelter", handleGetShelterById);

module.exports = router;
