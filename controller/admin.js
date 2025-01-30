//models
const Admin = require("../model/admin");

const { setUser } = require("../services/Auth");

async function handleAdminSignup(req, res) {
  const body = req.body;
  if (!body || !body.first_name || !body.last_name || !body.email) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const result = await Admin.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
      role: body.role,
    });

    const token = setUser(result);

    return res
      .status(200)
      .header({ token })
      .json({ message: "Admin signed up successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleAdminLogin(req, res) {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res
      .status(400)
      .json({ message: "Email and Password are required!", he: req.body });
  }

  try {
    const user = await Admin.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = setUser(user);

    return res
      .status(200)
      .header({ token })
      .json({ messae: "Admin logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleAdminDelete(req, res) {
  const id = req.body.id;
  if (!req.body.id) {
    return res.status(400).json("Id is required!");
  }

  try {
    const result = await Admin.deleteOne({ _id: req.body.id });
    console.log(req.body.user);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleAdminSignup,
  handleAdminLogin,
  handleAdminDelete,
};
