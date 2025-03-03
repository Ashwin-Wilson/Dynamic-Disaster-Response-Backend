const mongoose = require("mongoose");

const roadblockSchema = new mongoose.Schema(
  {
    // Reference to the volunteer who reported the roadblock
    reported_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "volunteer",
      required: true,
    },

    // Location of the roadblock
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
  { timestamps: true }
);

// Create index for geospatial queries
roadblockSchema.index({ location: "2dsphere" });

const Roadblock = mongoose.model("roadblock", roadblockSchema);

module.exports = Roadblock;
