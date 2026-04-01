const express = require("express");
const router = express.Router();
const TouristPlace = require("../models/TouristPlace");
const State = require("../models/State");
const City = require("../models/City");
const authMiddleware = require("../middleware/authMiddleware");
const PLACE_CATEGORIES = require("../constants/placeCategories");

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images
      .flatMap((image) => (typeof image === "string" ? image.split(",") : []))
      .map((image) => image.trim())
      .filter(Boolean);
  }

  if (typeof images === "string") {
    return images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

const serializePlace = (place) => {
  const data = place.toObject ? place.toObject() : place;
  return {
    ...data,
    images: normalizeImages(data.images),
  };
};

const normalizePlacePayload = (body = {}) => ({
  name: body.name?.trim(),
  description: body.description?.trim(),
  historicalInfo: body.historicalInfo?.trim() || "",
  category: body.category?.trim(),
  state: body.state,
  city: body.city,
  bestTime: body.bestTime?.trim() || "",
  entryFee: body.entryFee?.trim() || "",
  timings: body.timings?.trim() || "",
  nearbyAttractions: body.nearbyAttractions?.trim() || "",
  locationLink: body.locationLink?.trim() || "",
  images: normalizeImages(body.images),
});

const validatePlacePayload = async (payload) => {
  if (!payload.name || !payload.description || !payload.category || !payload.state || !payload.city) {
    return "Name, description, category, state, and city are required";
  }

  if (!PLACE_CATEGORIES.includes(payload.category)) {
    return "Invalid category selected";
  }

  if (payload.locationLink && !/^https?:\/\//i.test(payload.locationLink)) {
    return "Location link must start with http:// or https://";
  }

  const [state, city] = await Promise.all([
    State.findById(payload.state),
    City.findById(payload.city),
  ]);

  if (!state) {
    return "Selected state does not exist";
  }

  if (!city) {
    return "Selected city does not exist";
  }

  if (city.state.toString() !== payload.state.toString()) {
    return "Selected city does not belong to the selected state";
  }

  return null;
};

const getPlaceById = async (req, res) => {
  try {
    console.log("[GET destination by id] requested id:", req.params.id);

    const place = await TouristPlace.findById(req.params.id)
      .populate("state")
      .populate("city");

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const normalizedPlace = serializePlace(place);
    console.log("[GET destination by id] result:", {
      id: normalizedPlace._id,
      name: normalizedPlace.name,
      images: normalizedPlace.images,
    });
    res.json(normalizedPlace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Tourist Place
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const payload = normalizePlacePayload(req.body);
    const validationError = await validatePlacePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newPlace = new TouristPlace(payload);
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search & Filter Tourist Places
router.get("/search", async (req, res) => {
  try {
    const { name, state, category, city } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (state) {
      filter.state = state;
    }

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.city = city;
    }

    const places = await TouristPlace.find(filter)
      .populate("state")
      .populate("city");

    const normalizedPlaces = places.map(serializePlace);
    console.log("[GET /api/places/search] images:", normalizedPlaces.map((place) => ({
      id: place._id,
      name: place.name,
      images: place.images,
    })));
    res.json(normalizedPlaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get All Tourist Places
router.get("/", async (req, res) => {
  try {
    const places = await TouristPlace.find()
      .populate("state")
      .populate("city");

    res.json(places.map(serializePlace));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Tourist Place by ID (explicit destination route)
router.get("/destination/:id", getPlaceById);

// Get Single Tourist Place by ID
router.get("/:id", getPlaceById);

// Update Tourist Place
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const payload = normalizePlacePayload(req.body);
    const validationError = await validatePlacePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedPlace = await TouristPlace.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Tourist Place
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await TouristPlace.findByIdAndDelete(req.params.id);
    res.json({ message: "Tourist Place Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
