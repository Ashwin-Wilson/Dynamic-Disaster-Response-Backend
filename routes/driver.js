const express = require("express");
const router = express.Router();
const {
  handleDriverSignup,
  handleDriverLogin,
  handleDriverUpdate,
  handleVehicleConditionUpdate,
  handleAvailabilityUpdate,
  handleGetAllShelters,
} = require("../controller/driver");

router.post("/signup", handleDriverSignup);
router.post("/login", handleDriverLogin);
router.post("/update", handleDriverUpdate);
router.get("/get-all-shelters", handleGetAllShelters);

module.exports = router;
