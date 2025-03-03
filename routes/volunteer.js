const express = require("express");
const router = express.Router();
const {
  handleVolunteerSignup,
  handleVolunteerLogin,
  handleGetAllVolunteers,
  reportRoadBlock,
  getAllRoadBlocks,
} = require("../controller/volunteer");

router.post("/signup", handleVolunteerSignup);
router.post("/login", handleVolunteerLogin);
router.get("/get-all-volunteers", handleGetAllVolunteers);
router.post("/report-road-block", reportRoadBlock);
router.get("/get-all-road-blocks", getAllRoadBlocks);

module.exports = router;
