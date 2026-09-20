const express = require("express");
const pool = require("../database/database");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const allowedSpecies = new Set(["Dog", "Cat", "Bird", "Fish"]);

router.get("/", requireAuth, async (req, res) => {
  try {
    const [pets] = await pool.query(
      "SELECT pet_id, name, species FROM pets WHERE user_id = ? ORDER BY name",
      [req.userId],
    );
    res.json({ pets });
  } catch (error) {
    console.error("Pet list failed:", error.message);
    res.status(500).json({ error: "Could not fetch pets" });
  }
});

router.get("/:petId/logs", requireAuth, async (req, res) => {
  try {
    const [logs] = await pool.query(
      `SELECT pet_log_id, entry, DATE_FORMAT(logged_at, '%Y-%m-%d') AS logged_at
       FROM pet_logs
       WHERE pet_id = ? AND pet_id IN (SELECT pet_id FROM pets WHERE user_id = ?)
       ORDER BY logged_at DESC, pet_log_id DESC`,
      [req.params.petId, req.userId],
    );
    res.json({ logs });
  } catch (error) {
    console.error("Pet log list failed:", error.message);
    res.status(500).json({ error: "Could not fetch pet logs" });
  }
});

router.post("/:petId/logs", requireAuth, async (req, res) => {
  const entry = req.body?.entry?.trim();
  const loggedAt = req.body?.logged_at || new Date().toISOString().slice(0, 10);

  if (!entry) {
    return res.status(400).json({ error: "A log entry is required" });
  }

  try {
    const [petRows] = await pool.query(
      "SELECT pet_id FROM pets WHERE pet_id = ? AND user_id = ?",
      [req.params.petId, req.userId],
    );
    if (!petRows.length) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO pet_logs (pet_id, entry, logged_at) VALUES (?, ?, ?)",
      [req.params.petId, entry, loggedAt],
    );
    res.status(201).json({
      log: { pet_log_id: result.insertId, entry, logged_at: loggedAt },
    });
  } catch (error) {
    console.error("Pet log creation failed:", error.message);
    res.status(500).json({ error: "Could not save pet log" });
  }
});

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
