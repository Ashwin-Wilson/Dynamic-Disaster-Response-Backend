const Volunteer = require("../model/volunteer");
const Roadblock = require("../model/roadBlock");
const { setUser } = require("../services/Auth");

async function handleVolunteerSignup(req, res) {
  const body = req.body;

  if (
    !body ||
    !body.full_name ||
    !body.email ||
    !body.password ||
    !body.contact_info?.phone
  ) {
    return res.status(400).json({
      message:
        "Essential information is missing. Please fill all required fields.",
    });
  }

  try {
    const result = await Volunteer.create({
      full_name: body.full_name,
      email: body.email,
      password: body.password,
      contact_info: body.contact_info,
      address: body.address,
      availability: body.availability,
      skills_and_training: body.skills_and_training,
      resource_availability: body.resource_availability,
      physical_fitness: body.physical_fitness,
      emergency_contact: body.emergency_contact,
      additional_notes: body.additional_notes,
      previous_volunteer_experience: body.previous_volunteer_experience,
      current_location: body.current_location,
      deployment_status: "available",
    });

    const token = setUser(result);
    const volunteerId = result._id;

    return res.status(201).header({ token }).json({
      message: "Volunteer registered successfully",
      token,
      volunteerId,
      volunteerName: result.full_name,
      volunteerEmail: result.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Email already registered. Please login or use a different email.",
      });
    }

    res.status(500).json({ error: error.message });
  }
}

async function handleVolunteerLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required!" });
  }

  try {
    const volunteer = await Volunteer.findOne({ email, password });

    if (!volunteer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = setUser(volunteer);
    const volunteerId = volunteer._id;

    return res.status(200).header({ token }).json({
      message: "Volunteer logged in successfully",
      token,
      volunteerId,
      volunteerName: volunteer.full_name,
      volunteerEmail: volunteer.email,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: error.message });
  }
}

async function handleGetAllVolunteers(req, res) {
  try {
    const volunteers = await Volunteer.find();
    if (!volunteers) {
      return res.status(404).json({ message: "No volunteers found" });
    }
    return res
      .status(200)
      .json({ message: "Volunteers successfully fetched", volunteers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function reportRoadBlock(req, res) {
  const { volunteerId, location } = req.body;
  if (!volunteerId || !location) {
    return res
      .status(400)
      .json({ message: "Volunteer ID and road block are required" });
  }
  try {
    const newRoadBlock = await Roadblock.create({
      reported_by: volunteerId,
      location: location,
    });
    return res.status(200).json({ message: "Block saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAllRoadBlocks(req, res) {
  try {
    const roadBlocks = await Roadblock.find();
    console.log(roadBlocks);
    if (!roadBlocks) {
      res.status(400).json({ message: "No road Blocks found in DB" });
    }
    res
      .status(200)
      .json({ message: "Road Blocks retrieved successfully", roadBlocks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleVolunteerSignup,
  handleVolunteerLogin,
  handleGetAllVolunteers,
  reportRoadBlock,
  getAllRoadBlocks,
};
