require("dotenv").config();

const express = require("express");
const cors = require("cors");
//this is the connection to the database
const database = require("./database/database");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/species", async (req, res) => {
  try {
    const [guides] = await database.query(
      "SELECT id, name, image_path FROM care_guides",
    );
    res.json(guides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

database
  .query("SELECT 1")
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
