const mongoose = require("mongoose");

// Schema for reports within the shelter
const shelterReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Date and time will be automatically set
  },
  { timestamps: true }
);

const shelterSchema = new mongoose.Schema(
  {
    shelter_name: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postal_code: {
        type: String,
        required: true,
      },
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
    },
    created_by: {
      type: String,
      require: true,
    },
    capacity: {
      max_capacity: {
        type: Number,
        required: true,
      },
      current_occupancy: {
        type: Number,
        default: 0,
      },
      available_beds: {
        type: Number,
        required: true,
      },
    },
    medical_cases: {
      count: {
        type: Number,
        default: 0,
      },
      details: [
        {
          case_type: String,
          severity: {
            type: String,
            enum: ["low", "moderate", "high", "critical"],
          },
          count: Number,
        },
      ],
    },
    supply_status: {
      food: {
        type: Number, // Percentage
        min: 0,
        max: 100,
        default: 100,
      },
      water: {
        type: Number, // Percentage
        min: 0,
        max: 100,
        default: 100,
      },
      medicine: {
        type: Number, // Percentage
        min: 0,
        max: 100,
        default: 100,
      },
      other_supplies: {
        type: Number, // Percentage
        min: 0,
        max: 100,
        default: 100,
      },
    },
    sanitation: {
      type: String,
      enum: ["good", "moderate", "poor"],
      default: "good",
    },
    last_inspection: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "full", "closed", "preparing"],
      default: "preparing",
    },
    assigned_caretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "caretaker",
    },

    reports: [shelterReportSchema],
  },
  { timestamps: true }
);

// Index for geospatial queries on location
shelterSchema.index({ "address.location": "2dsphere" });

const Shelter = mongoose.model("shelter", shelterSchema);
const ShelterReport = mongoose.model("shelterReport", shelterReportSchema);

module.exports = { Shelter, ShelterReport };
