const express = require("express");
const pool = require("../database/database");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const allowedSpecies = new Set(["Dog", "Cat", "Bird", "Fish"]);

router.post("/", requireAuth, async (req, res) => {
  const name = req.body?.name?.trim();
  const species = req.body?.species;

  if (!name || !species) {
    return res.status(400).json({ error: "Pet name and type are required" });
  }

  if (!allowedSpecies.has(species)) {
    return res.status(400).json({ error: "That pet type is not supported" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO pets (user_id, name, species) VALUES (?, ?, ?)",
      [req.userId, name, species],
    );

    res.status(201).json({
      pet: {
        pet_id: result.insertId,
        user_id: req.userId,
        name,
        species,
      },
    });
  } catch (error) {
    console.error("Pet creation failed:", error.message);
    res.status(500).json({ error: "Could not save pet" });
  }
});

module.exports = router;
