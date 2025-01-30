const Family = require("../model/family");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/Auth");

// Family Signup
async function handleFamilySignup(req, res) {
  const { family_name, email, password, role, total_members, address } =
    req.body;

  if (
    !family_name ||
    !email ||
    !password ||
    !role ||
    !total_members ||
    !address
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingFamily = await Family.findOne({ email });
    if (existingFamily) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFamily = await Family.create({
      family_name,
      email,
      password: hashedPassword,
      role,
      total_members,
      address,
    });

    const token = setUser(newFamily);

    return res
      .status(201)
      .header({ token })
      .json({ message: "Family registered successfully", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Family Login
async function handleFamilyLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  try {
    const family = await Family.findOne({ email });
    if (!family) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, family.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = setUser(family);

    return res
      .status(200)
      .header({ token })
      .json({ message: "Family logged in successfully", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Family Update Information
async function handleFamilyUpdate(req, res) {
  const { familyId, updates } = req.body;

  if (!familyId || !updates) {
    return res
      .status(400)
      .json({ message: "Family ID and update data are required!" });
  }

  try {
    const updatedFamily = await Family.findByIdAndUpdate(familyId, updates, {
      new: true,
    });

    if (!updatedFamily) {
      return res.status(404).json({ message: "Family not found!" });
    }

    return res
      .status(200)
      .json({ message: "Family details updated successfully", updatedFamily });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleFamilySignup,
  handleFamilyLogin,
  handleFamilyUpdate,
};
