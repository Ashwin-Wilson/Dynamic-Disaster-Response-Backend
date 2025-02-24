//models
const Admin = require("../model/admin");
const DisasterReport = require("../model/disasterReports");
const Family = require("../model/family");
const Driver = require("../model/driver");
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
    const adminId = result._id;
    return res
      .status(200)
      .header({ token })
      .json({ message: "Admin signed up successfully", token, adminId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleAdminLogin(req, res) {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res
      .status(400)
      .json({ message: "Email and Password are required!" });
  }

  try {
    const user = await Admin.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = setUser(user);
    const adminId = user._id;

    return res
      .status(200)
      .header({ token })
      .json({ message: "Admin logged in successfully", token, adminId });
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

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleDisasterReport(req, res) {
  const { disaster_title, description, author, location, intensity } = req.body;
  if (!disaster_title || !description || !author || !location || !intensity) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  try {
    const newDisasterReport = await DisasterReport.create({
      disaster_title,
      description,
      location,
      author,
      intensity,
    });

    return res.status(201).json({
      message: "Disaster report created successfully",
      newDisasterReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create disaster report",
      details: error.message,
    });
  }
}

// Helper function to calculate distance using geospatial queries
const getNearbyFamilies = async (disasterLocation, radius) => {
  try {
    if (
      !disasterLocation ||
      !disasterLocation.coordinates ||
      disasterLocation.coordinates.length !== 2
    ) {
      throw new Error("Invalid disaster location coordinates");
    }

    // Get families within a given radius (in meters)
    const families = await Family.find({
      "address.location": {
        $geoWithin: {
          $centerSphere: [
            [disasterLocation.coordinates[0], disasterLocation.coordinates[1]], // [longitude, latitude]
            radius / 6378.1, // Convert km to radians
          ],
        },
      },
    });

    return families;
  } catch (error) {
    throw new Error("Error fetching nearby families: " + error.message);
  }
};

//To remove family duplicate in different ranges
const removeFamiliesWithinAFromB = (A, B) => {
  return B.filter((b) => {
    return !A.some((a) => a.email === b.email);
  });
};

async function handleAdminDashboard(req, res) {
  try {
    // Get the disaster location (coordinates)
    const disasterId = req.headers.disasterid;
    const disaster = await DisasterReport.findById(disasterId);

    if (!disaster) {
      return res.status(404).json({
        message: "Disaster report not found",
      });
    }

    const disasterLocation = disaster.location; // Disaster location [longitude, latitude]

    //Get families within 5km and 50km radius
    const familiesWithin5km = await getNearbyFamilies(disasterLocation, 5); // 5km radius
    let familiesWithin10km = await getNearbyFamilies(disasterLocation, 10);
    let familiesWithin50km = await getNearbyFamilies(disasterLocation, 50);

    familiesWithin10km = await removeFamiliesWithinAFromB(
      familiesWithin5km,
      familiesWithin10km
    );

    familiesWithin50km = await removeFamiliesWithinAFromB(
      familiesWithin5km,
      familiesWithin50km
    );

    return res.status(200).json({
      disaster_report: disaster,
      families: {
        within5km: familiesWithin5km,
        within10km: familiesWithin10km,
        within50km: familiesWithin50km,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleGetAllFamilies(req, res) {
  try {
    const families = await Family.find();

    res.status(200).json({ families });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch families!" });
    console.log(error);
  }
}

async function handleGetAllDrivers(req, res) {
  try {
    const drivers = await Driver.find();

    res.status(200).json({ drivers });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch drivers!" });
    console.log(error);
  }
}

async function handleGetAllDisasterReports(req, res) {
  try {
    const disasterReports = await DisasterReport.find();

    res.status(200).json({ disasterReports });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch Disaster Reports!" });
    console.log(error);
  }
}

module.exports = {
  handleAdminSignup,
  handleAdminLogin,
  handleAdminDelete,
  handleDisasterReport,
  handleAdminDashboard,
  handleGetAllFamilies,
  handleGetAllDrivers,
  handleGetAllDisasterReports,
};
