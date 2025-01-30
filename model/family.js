const mongoose = require("mongoose");

const familySchema = new mongoose.Schema(
  {
    family_name: {
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
    role: {
      type: String,
      required: true,
    },
    family_members: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: true,
        },
        relation: {
          type: String,
          required: true,
        },
        is_vulnerable: {
          type: Boolean,
          default: false,
        },
        vulnerability_type: {
          pregnant: Boolean,
          disabled: Boolean,
          elderly: Boolean,
          child: Boolean,
        },
        chronic_illness: [
          {
            condition: String,
            medication_required: Boolean,
            details: String,
          },
        ],
      },
    ],
    total_members: {
      type: Number,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
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
      proximity_to_risks: [
        {
          risk_type: {
            type: String,
            enum: ["river", "slope", "coast", "other"],
          },
          distance: Number, // distance in meters
          details: String,
        },
      ],
    },
    housing: {
      type: {
        type: String,
        enum: ["permanent", "temporary", "makeshift"],
        default: "permanent",
        required: true,
      },
      details: String,
    },
    medical_requirements: {
      dependent_on_equipment: Boolean,
      equipment_details: [
        {
          equipment_type: String,
          quantity: Number,
          power_required: Boolean,
        },
      ],
      regular_medications: Boolean,
      medication_details: String,
      immediate_medical_assistance_needed: Boolean,
    },
    evacuation_details: {
      personal_transport_available: Boolean,
      vehicle_type: String,
      assistance_required: Boolean,
      assistance_type: String,
      preferred_evacuation_center: String,
    },
    disaster_preparedness: {
      disaster_kit_available: Boolean,
      kit_last_checked: Date,
      evacuation_protocol_awareness: Boolean,
      emergency_contacts: [
        {
          name: String,
          relationship: String,
          phone: String,
        },
      ],
      meeting_point: String,
    },
    disaster_history: [
      {
        disaster_type: {
          type: String,
          enum: ["flood", "landslide", "other"],
        },
        date: Date,
        impact_level: {
          type: String,
          enum: ["minor", "moderate", "severe"],
        },
        damages: String,
        evacuation_required: Boolean,
      },
    ],
    primary_contact: {
      phone: String,
      alternate_phone: String,
      emergency_contact: String,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
familySchema.index({ "address.location": "2dsphere" });

const Family = mongoose.model("family", familySchema);

module.exports = Family;
