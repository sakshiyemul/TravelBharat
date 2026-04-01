const express = require("express");
const router = express.Router();
const State = require("../models/State");
const City = require("../models/City");
const TouristPlace = require("../models/TouristPlace");
const authMiddleware = require("../middleware/authMiddleware");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Add State (Protected)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || "";
    const image = req.body.image?.trim() || "";

    if (!name) {
      return res.status(400).json({ message: "State name is required" });
    }

    const existingState = await State.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });

    if (existingState) {
      return res.status(400).json({ message: "State already exists" });
    }

    const newState = new State({ name, description, image });
    await newState.save();
    res.status(201).json(newState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All States
router.get("/", async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update State (Protected)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || "";
    const image = req.body.image?.trim() || "";

    if (!name) {
      return res.status(400).json({ message: "State name is required" });
    }

    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const existingState = await State.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    });

    if (existingState) {
      return res.status(400).json({ message: "State already exists" });
    }

    state.name = name;
    state.description = description;
    state.image = image;

    await state.save();
    res.json(state);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete State (Protected)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [state, cityCount, placeCount] = await Promise.all([
      State.findById(id),
      City.countDocuments({ state: id }),
      TouristPlace.countDocuments({ state: id }),
    ]);

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    if (cityCount > 0 || placeCount > 0) {
      return res.status(400).json({
        message: "Cannot delete this state while cities or destinations are linked to it",
      });
    }

    await State.findByIdAndDelete(id);
    res.json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
