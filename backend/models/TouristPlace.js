const mongoose = require("mongoose");
const PLACE_CATEGORIES = require("../constants/placeCategories");

const touristPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  category: {
    type: String,
    enum: PLACE_CATEGORIES,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  historicalInfo: {
    type: String
  },
  bestTime: {
    type: String
  },
  entryFee: {
    type: String
  },
  timings: {
    type: String
  },
  nearbyAttractions: {
    type: String
  },
  locationLink: {
    type: String
  },
  images: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("TouristPlace", touristPlaceSchema);
