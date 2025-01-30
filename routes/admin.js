const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");

//controllers
const {
  handleAdminLogin,
  handleAdminSignup,
  handleAdminDelete,
  handleDisasterReport,
  handleAdminDashboard,
} = require("../controller/admin");

router.post("/signup", handleAdminSignup);
router.get("/login", handleAdminLogin);
router.delete("/remove-admin", checkAuth("admin"), handleAdminDelete);
router.post("/report-disaster", handleDisasterReport);
router.get("/dashboard", handleAdminDashboard);
//following code is used to perform admin privilage actions

module.exports = router;
