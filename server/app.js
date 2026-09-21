const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/pets");
const breedRoutes = require("./routes/breeds");
const guideRoutes = require("./routes/guides");
const serviceRoutes = require("./routes/services");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Feature APIs are mounted under stable public URL prefixes.
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/breeds", breedRoutes);
app.use("/api/species", guideRoutes);
app.use("/api/services", serviceRoutes);

module.exports = app;
