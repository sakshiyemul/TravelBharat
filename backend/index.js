const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");
const touristPlaceRoutes = require("./routes/touristPlaceRoutes");

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ⭐ VERY IMPORTANT (for images)
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/places", touristPlaceRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});