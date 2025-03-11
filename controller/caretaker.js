const Caretaker = require("../model/caretaker");
const { Shelter, ShelterReport } = require("../model/shelter");
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/Auth");
const { response } = require("express");

// Caretaker Signup
async function handleCaretakerSignup(req, res) {
  const {
    full_name,
    email,
    password,
    contact_info,
    address,
    training,
    shelter_experience,
    availability,
    languages,
    counseling,
    special_skills,
    resource_knowledge,
    mobility_limitations,
    emergency_contact,
    additional_notes,
    current_location,
  } = req.body;

  if (!full_name || !email || !password || !contact_info || !address) {
    return res.status(400).json({ message: "Essential fields are required!" });
  }

  try {
    const existingCaretaker = await Caretaker.findOne({ email });
    if (existingCaretaker) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCaretaker = await Caretaker.create({
      full_name,
      email,
      password: hashedPassword,
      contact_info,
      address,
      training: training || {},
      shelter_experience: shelter_experience || { level: "none" },
      availability: availability || { duration: "1-3 days" },
      languages: languages || { english: true },
      counseling: counseling || { has_training: false },
      special_skills: special_skills || [],
      resource_knowledge: resource_knowledge || {},
      mobility_limitations,
      emergency_contact: emergency_contact || {},
      additional_notes,
      current_location,
      deployment_status: "unassigned",
    });

    const token = setUser(newCaretaker);

    return res.status(201).header({ token }).json({
      message: "Caretaker registered successfully",
      token,
      newCaretaker,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Caretaker Login
async function handleCaretakerLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  try {
    const caretaker = await Caretaker.findOne({ email });
    if (!caretaker) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, caretaker.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = setUser(caretaker);

    return res
      .status(200)
      .header({ token })
      .json({ message: "Caretaker logged in successfully", token, caretaker });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Caretaker Update Information
async function handleCaretakerUpdate(req, res) {
  const { token, updates } = req.body;

  if (!token || !updates) {
    return res
      .status(400)
      .json({ message: "Caretaker ID and update data are required!" });
  }
  const caretakerId = getUser(token).id;

  try {
    const updatedCaretaker = await Caretaker.findByIdAndUpdate(
      caretakerId,
      updates,
      {
        new: true,
      }
    );

    if (!updatedCaretaker) {
      return res.status(404).json({ message: "Caretaker not found!" });
    }

    return res.status(200).json({
      message: "Caretaker details updated successfully",
      updatedCaretaker,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleShelterCreate(req, res) {
  const {
    shelter_name,
    address,
    capacity,
    medical_cases,
    supply_status,
    sanitation,
    status,
    assigned_caretakers,
  } = req.body;

  // Check for required fields
  if (!shelter_name || !address || !capacity) {
    return res
      .status(400)
      .json({ message: "Essential shelter information is required!" });
  }

  // Validate address components
  if (
    !address.street ||
    !address.city ||
    !address.state ||
    !address.postal_code ||
    !address.location
  ) {
    return res
      .status(400)
      .json({ message: "Complete address information is required!" });
  }

  // Validate location coordinates
  if (
    !address.location.coordinates ||
    address.location.coordinates.length !== 2
  ) {
    return res
      .status(400)
      .json({ message: "Valid location coordinates are required!" });
  }

  // Validate capacity values
  if (capacity.max_capacity <= 0 || capacity.available_beds < 0) {
    return res.status(400).json({ message: "Invalid capacity values!" });
  }

  try {
    // Check if shelter with same name already exists in same location
    const existingShelter = await Shelter.findOne({
      shelter_name,
      "address.city": address.city,
      "address.state": address.state,
    });

    if (existingShelter) {
      return res.status(400).json({
        message: "A shelter with this name already exists in this location!",
      });
    }

    // Create new shelter
    const newShelter = await Shelter.create({
      shelter_name,
      address,
      capacity,
      medical_cases: medical_cases || { count: 0, details: [] },
      supply_status: supply_status || {
        food: 100,
        water: 100,
        medicine: 100,
        other_supplies: 100,
      },
      sanitation: sanitation || "good",
      status: status || "preparing",
      last_inspection: new Date(),
      assigned_caretakers: assigned_caretakers || [],
    });

    // If caretakers are assigned, update their deployment status
    if (assigned_caretakers && assigned_caretakers.length > 0) {
      await Caretaker.updateMany(
        { _id: { $in: assigned_caretakers } },
        {
          deployment_status: "assigned",
          assigned_shelter: newShelter._id,
        }
      );
    }

    return res.status(200).json({
      message: "Shelter created successfully",
      shelterId: newShelter._id,
    });
  } catch (error) {
    console.error("Shelter creation error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGetShelterById(req, res) {
  const shelterId = req.header("shelterId");
  try {
    const existingShelter = await Shelter.findOne({
      _id: shelterId,
    });
    res.status(200).json({
      message: "Shelter found successfully",
      shelter: existingShelter,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleShelterReports(req, res) {
  const { shelterId, updates } = req.body;

  if (!shelterId || !updates) {
    res.status(400).json({ message: "shelterId and updates are required" });
  }
  try {
    const newReport = await ShelterReport.create({
      title: updates.title,
      description: updates.description,
    });

    const updatedShelter = await Shelter.findByIdAndUpdate(
      shelterId,
      { $push: { reports: newReport } },
      {
        new: true,
      }
    );

    if (!updatedShelter) {
      return res.status(404).json({ message: "Shelter not found!" });
    }

    return res.status(200).json({
      message: "Shelter details updated successfully",
      updatedShelter,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleShelterUpdate(req, res) {
  const { shelterId, updates } = req.body;
  if (!shelterId || !updates) {
    return res
      .status(400)
      .json({ message: "ShelterId and updates are required" });
  }
  try {
    const updatedShelter = await Shelter.findByIdAndUpdate(shelterId, updates, {
      new: true,
    });
    if (updatedShelter) {
      return res.status(200).json({
        message: "Shelter details updated successfully",
        shelter: updatedShelter,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleCaretakerSignup,
  handleCaretakerLogin,
  handleCaretakerUpdate,
  handleShelterCreate,
  handleShelterUpdate,
  handleShelterReports,
  handleGetShelterById,
};
