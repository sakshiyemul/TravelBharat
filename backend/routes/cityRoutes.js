const express = require("express");
const router = express.Router();
const City = require("../models/City");
const State = require("../models/State");
const TouristPlace = require("../models/TouristPlace");
const authMiddleware = require("../middleware/authMiddleware");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Add City (Protected)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const state = req.body.state;

    if (!name || !state) {
      return res.status(400).json({ message: "City name and state are required" });
    }

    const existingState = await State.findById(state);

    if (!existingState) {
      return res.status(400).json({ message: "Selected state does not exist" });
    }

    const existingCity = await City.findOne({
      state,
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    });

    if (existingCity) {
      return res.status(400).json({ message: "City already exists in this state" });
    }

    const newCity = new City({ name, state });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find().populate("state");
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update City (Protected)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body.name?.trim();
    const state = req.body.state;

    if (!name || !state) {
      return res.status(400).json({ message: "City name and state are required" });
    }

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const existingState = await State.findById(state);

    if (!existingState) {
      return res.status(400).json({ message: "Selected state does not exist" });
    }

    const existingCity = await City.findOne({
      _id: { $ne: id },
      state,
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    });

    if (existingCity) {
      return res.status(400).json({ message: "City already exists in this state" });
    }

    city.name = name;
    city.state = state;

    await city.save();
    await city.populate("state");
    res.json(city);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete City (Protected)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [city, placeCount] = await Promise.all([
      City.findById(id),
      TouristPlace.countDocuments({ city: id }),
    ]);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    if (placeCount > 0) {
      return res.status(400).json({
        message: "Cannot delete this city while destinations are linked to it",
      });
    }

    await City.findByIdAndDelete(id);
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
