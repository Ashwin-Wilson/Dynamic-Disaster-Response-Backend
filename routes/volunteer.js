const express = require("express");
const router = express.Router();
const {
  handleVolunteerSignup,
  handleVolunteerLogin,
  handleGetAllVolunteers,
} = require("../controller/volunteer");

router.post("/signup", handleVolunteerSignup);
router.post("/login", handleVolunteerLogin);
router.get("/get-all-volunteers", handleGetAllVolunteers);

module.exports = router;
