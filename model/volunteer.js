const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    // Personal Details
    full_name: {
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
    address: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: {
        type: String,
        default: "United States",
      },
    },

    // Availability
    availability: {
      preferred_time_slots: {
        morning: {
          type: Boolean,
          default: false,
        },
        afternoon: {
          type: Boolean,
          default: false,
        },
        evening: {
          type: Boolean,
          default: false,
        },
        overnight: {
          type: Boolean,
          default: false,
        },
        weekends: {
          type: Boolean,
          default: false,
        },
      },
      emergency_availability: {
        type: Boolean,
        default: false,
      },
      notice_required: {
        type: String,
        enum: ["None", "Few hours", "Same day", "1-2 days", "3+ days"],
        default: "Same day",
      },
      max_hours_per_week: Number,
    },

    // Skills and Training
    skills_and_training: {
      first_aid: {
        certified: {
          type: Boolean,
          default: false,
        },
        certification_expiry: Date,
      },
      disaster_management: {
        type: Boolean,
        default: false,
      },
      swimming: {
        type: Boolean,
        default: false,
      },
      heavy_equipment: {
        type: Boolean,
        default: false,
      },
      search_and_rescue: {
        type: Boolean,
        default: false,
      },
      cooking: {
        type: Boolean,
        default: false,
      },
      medical_training: {
        has_training: {
          type: Boolean,
          default: false,
        },
        details: String,
      },
      languages: {
        english: {
          type: Boolean,
          default: true,
        },
        spanish: {
          type: Boolean,
          default: false,
        },
        sign_language: {
          type: Boolean,
          default: false,
        },
        other_languages: [String],
      },
      other_skills: [String],
    },

    // Resource Availability
    resource_availability: {
      tools: {
        boats: {
          available: {
            type: Boolean,
            default: false,
          },
          details: String,
        },
        ropes: {
          type: Boolean,
          default: false,
        },
        first_aid_kits: {
          type: Boolean,
          default: false,
        },
        power_tools: {
          type: Boolean,
          default: false,
        },
        other_tools: [String],
      },
      vehicle: {
        available: {
          type: Boolean,
          default: false,
        },
        type: {
          type: String,
          enum: ["None", "Sedan", "SUV", "Truck", "Van", "Other"],
          default: "None",
        },
        details: String,
      },
    },

    // Physical Fitness
    physical_fitness: {
      is_physically_fit: {
        type: Boolean,
        required: true,
      },
      fitness_level: {
        type: String,
        enum: ["Limited", "Moderate", "Good", "Excellent"],
      },
      limitations: String,
      can_lift_weight: {
        type: String,
        enum: ["Under 10 lbs", "10-25 lbs", "25-50 lbs", "50+ lbs"],
      },
    },

    // Deployment Status
    deployment_status: {
      type: String,
      enum: ["available", "assigned", "on-duty", "unavailable"],
      default: "available",
    },
    assigned_location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisasterLocation",
    },

    // Location - for tracking purposes during deployment
    current_location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },

    // Additional Information
    emergency_contact: {
      name: String,
      relationship: String,
      phone: String,
    },
    additional_notes: String,
    previous_volunteer_experience: String,

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create index for geospatial queries
volunteerSchema.index({ current_location: "2dsphere" });

const Volunteer = mongoose.model("volunteer", volunteerSchema);

module.exports = Volunteer;
