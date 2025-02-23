const express = require("express");
const router = express.Router();
const {
  handleDriverSignup,
  handleDriverLogin,
  handleDriverUpdate,
  handleVehicleConditionUpdate,
  handleAvailabilityUpdate,
} = require("../controller/driver");

router.post("/signup", handleDriverSignup);
router.post("/login", handleDriverLogin);
router.post("/update", handleDriverUpdate);

module.exports = router;
