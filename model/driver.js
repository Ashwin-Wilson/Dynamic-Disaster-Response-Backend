const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    // Personal Details
    driver_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact_info: {
      phone: {
        type: String,
        required: true,
      },
      alternate_phone: String,
    },
    vehicle: {
      type: {
        type: String,
        required: true,
        enum: ["car", "suv", "van", "truck", "other"],
      },
      registration_number: {
        type: String,
        required: true,
        unique: true,
      },
    },

    // Availability
    available: {
      type: Boolean,
      default: false,
      required: true,
    },

    //Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    // Driving Skills and Experience
    driving_experience: {
      rough_terrain_experience: {
        type: Boolean,
        default: false,
      },
      flood_area_experience: {
        type: Boolean,
        default: false,
      },
      license: {
        number: {
          type: String,
          required: true,
          unique: true,
        },
        valid_from: {
          type: Date,
          required: true,
        },
        valid_until: {
          type: Date,
          required: true,
        },
      },
    },

    // Vehicle Condition
    vehicle_condition: {
      fuel_status: {
        type: String,
        enum: ["full", "partial", "empty"],
        required: true,
      },
      capacity: {
        passengers: {
          type: Number,
          required: true,
        },
        weight_limit: {
          type: Number, // in kilograms
          required: true,
        },
      },
    },

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("driver", driverSchema);

module.exports = Driver;
