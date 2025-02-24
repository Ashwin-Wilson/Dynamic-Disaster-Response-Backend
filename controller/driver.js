const Driver = require("../model/driver");
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/Auth");

// Driver Signup
async function handleDriverSignup(req, res) {
  const data = req.body;

  const {
    driver_name,
    email,
    password,
    contact_info,
    vehicle,
    available,
    location,
    driving_experience,
    vehicle_condition,
  } = req.body;

  if (
    !driver_name ||
    !email ||
    !password ||
    !contact_info ||
    !vehicle ||
    !available ||
    !location ||
    !driving_experience ||
    !vehicle_condition
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    data.password = await bcrypt.hash(password, 10);

    const newDriver = await Driver.create(data);

    const token = setUser(newDriver);

    return res
      .status(201)
      .header({ token })
      .json({ message: "Driver registered successfully", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Driver Login
async function handleDriverLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  try {
    const driver = await Driver.findOne({ email, password });
    if (!driver) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // const isMatch = await bcrypt.compare(password, driver.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    // }

    const token = setUser(driver);

    return res
      .status(200)
      .header({ token })
      .json({
        message: "Driver logged in successfully",
        token,
        driverId: driver._id,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Driver Update Profile
async function handleDriverUpdate(req, res) {
  const { token, updates } = req.body;

  if (!token || !updates) {
    return res
      .status(400)
      .json({ message: "Driver ID and update data are required!" });
  }

  const driverId = getUser(token).id;

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updates, {
      new: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    return res
      .status(200)
      .json({ message: "Driver details updated successfully", updatedDriver });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Update Vehicle Condition
async function handleVehicleConditionUpdate(req, res) {
  const { token, fuel_status, capacity } = req.body;

  if (!token || !fuel_status || !capacity) {
    return res
      .status(400)
      .json({ message: "All vehicle condition details are required!" });
  }

  const driverId = getUser(token).id;

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      {
        vehicle_condition: {
          fuel_status,
          capacity,
        },
      },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    return res.status(200).json({
      message: "Vehicle condition updated successfully",
      updatedDriver,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Update Driver Availability
async function handleAvailabilityUpdate(req, res) {
  const { token, emergency_driving, preferred_areas } = req.body;

  if (!token || emergency_driving === undefined) {
    return res
      .status(400)
      .json({ message: "Emergency driving status is required!" });
  }

  const driverId = getUser(token).id;

  try {
    const updateData = {
      "availability.emergency_driving": emergency_driving,
    };

    if (preferred_areas) {
      updateData["availability.preferred_areas"] = preferred_areas;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, {
      new: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    return res.status(200).json({
      message: "Driver availability updated successfully",
      updatedDriver,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get Drivers by Area
async function handleGetDriversByArea(req, res) {
  const { locality } = req.query;

  if (!locality) {
    return res.status(400).json({ message: "Locality is required!" });
  }

  try {
    const drivers = await Driver.find({
      "availability.preferred_areas.locality": locality,
    });

    return res.status(200).json({
      message: "Drivers retrieved successfully",
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleDriverSignup,
  handleDriverLogin,
  handleDriverUpdate,
  handleVehicleConditionUpdate,
  handleAvailabilityUpdate,
  handleGetDriversByArea,
};
