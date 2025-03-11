const mongoose = require("mongoose");

const caretakerSchema = new mongoose.Schema(
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

    shelter_id: {
      type: String,
      default: null,
    },

    // Experience and Skills
    training: {
      first_aid: {
        type: Boolean,
        default: false,
      },
      emergency_medical: {
        type: Boolean,
        default: false,
      },
      crowd_management: {
        type: Boolean,
        default: false,
      },
      sanitation: {
        type: Boolean,
        default: false,
      },
      food_safety: {
        type: Boolean,
        default: false,
      },
      other_training: String,
    },
    shelter_experience: {
      level: {
        type: String,
        enum: ["none", "1-2 events", "3-5 events", "5+ events"],
        default: "none",
      },
      description: String,
    },

    // Availability
    availability: {
      overnight_stay: {
        type: Boolean,
        default: false,
      },
      full_time: {
        type: Boolean,
        default: false,
      },
      duration: {
        type: String,
        enum: ["1-3 days", "4-7 days", "1-2 weeks", "2+ weeks"],
        required: true,
      },
      preferred_shifts: {
        morning: {
          type: Boolean,
          default: false,
        },
        afternoon: {
          type: Boolean,
          default: false,
        },
        night: {
          type: Boolean,
          default: false,
        },
        flexible: {
          type: Boolean,
          default: false,
        },
      },
      currently_available: {
        type: Boolean,
        default: false,
      },
    },

    // Special Skills
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
    counseling: {
      has_training: {
        type: Boolean,
        default: false,
      },
      details: String,
    },
    special_skills: [String],

    // Resource Knowledge
    resource_knowledge: {
      shelter_supplies: {
        type: Boolean,
        default: false,
      },
      management_protocols: {
        trained: {
          type: Boolean,
          default: false,
        },
        certification_details: String,
      },
      local_emergency_resources: {
        type: Boolean,
        default: false,
      },
    },

    // Additional Information
    mobility_limitations: String,
    emergency_contact: {
      name: String,
      relationship: String,
      phone: String,
    },
    additional_notes: String,

    // Deployment Status
    deployment_status: {
      type: String,
      enum: ["unassigned", "assigned", "on-duty", "off-duty", "unavailable"],
      default: "unassigned",
    },
    assigned_shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
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

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create index for geospatial queries
caretakerSchema.index({ current_location: "2dsphere" });

const Caretaker = mongoose.model("caretaker", caretakerSchema);

module.exports = Caretaker;
