const mongoose = require("mongoose");

const disasterReportSchema = new mongoose.Schema(
  {
    disaster_title: {
      type: String,
      required: true,
    },
    description: {
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
    // admin_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "admins",
    //   required: true,
    // },
    author: {
      role: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    intensity: {
      type: String,
      enum: ["low", "moderate", "high", "severe"],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for geospatial queries on location
disasterReportSchema.index({ location: "2dsphere" });

const DisasterReport = mongoose.model("disaster_reports", disasterReportSchema);

module.exports = DisasterReport;
