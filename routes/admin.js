const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");

//controllers
const {
  handleAdminLogin,
  handleAdminSignup,
  handleAdminDelete,
} = require("../controller/admin");

router.post("/signup", handleAdminSignup);
router.get("/login", handleAdminLogin);
//following code is used to perform admin privilage actions
router.delete("/remove-admin", checkAuth("admin"), handleAdminDelete);

router.get("/:id", async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  return res.status(200).json(admin);
});

module.exports = router;
