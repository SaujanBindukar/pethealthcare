const express = require("express");
const pool = require("../database/database");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const allowedSpecies = new Set(["Dog", "Cat", "Bird", "Fish"]);
const allowedLogTypes = new Set([
  "Health",
  "Medication",
  "Appointment",
  "Feeding",
  "Grooming",
  "Other",
]);

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

router.put("/:petId", requireAuth, async (req, res) => {
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
      "UPDATE pets SET name = ?, species = ? WHERE pet_id = ? AND user_id = ?",
      [name, species, req.params.petId, req.userId],
    );
    if (!result.affectedRows) {
      const [existingPets] = await pool.query(
        "SELECT pet_id FROM pets WHERE pet_id = ? AND user_id = ?",
        [req.params.petId, req.userId],
      );
      if (!existingPets.length) {
        return res.status(404).json({ error: "Pet not found" });
      }
    }
    res.json({ pet: { pet_id: Number(req.params.petId), name, species } });
  } catch (error) {
    console.error("Pet update failed:", error.message);
    res.status(500).json({ error: "Could not update pet" });
  }
});

router.delete("/:petId", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM pets WHERE pet_id = ? AND user_id = ?",
      [req.params.petId, req.userId],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Pet deletion failed:", error.message);
    res.status(500).json({ error: "Could not delete pet" });
  }
});

router.get("/:petId/logs", requireAuth, async (req, res) => {
  try {
    const [logs] = await pool.query(
      `SELECT pet_log_id, log_type, entry, DATE_FORMAT(logged_at, '%Y-%m-%d') AS logged_at
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
  const logType = req.body?.log_type;
  const entry = req.body?.entry?.trim();
  const loggedAt = req.body?.logged_at || new Date().toISOString().slice(0, 10);

  if (!entry || !logType) {
    return res.status(400).json({ error: "Log type and entry are required" });
  }
  if (!allowedLogTypes.has(logType)) {
    return res.status(400).json({ error: "That log type is not supported" });
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
      "INSERT INTO pet_logs (pet_id, log_type, entry, logged_at) VALUES (?, ?, ?, ?)",
      [req.params.petId, logType, entry, loggedAt],
    );
    res.status(201).json({
      log: {
        pet_log_id: result.insertId,
        log_type: logType,
        entry,
        logged_at: loggedAt,
      },
    });
  } catch (error) {
    console.error("Pet log creation failed:", error.message);
    res.status(500).json({ error: "Could not save pet log" });
  }
});

router.put("/:petId/logs/:logId", requireAuth, async (req, res) => {
  const logType = req.body?.log_type;
  const entry = req.body?.entry?.trim();
  const loggedAt = req.body?.logged_at;

  if (!entry || !logType || !loggedAt) {
    return res
      .status(400)
      .json({ error: "Log type, entry and date are required" });
  }
  if (!allowedLogTypes.has(logType)) {
    return res.status(400).json({ error: "That log type is not supported" });
  }

  try {
    const [existingLogs] = await pool.query(
      `SELECT pet_log_id
       FROM pet_logs
       WHERE pet_log_id = ?
         AND pet_id = ?
         AND pet_id IN (SELECT pet_id FROM pets WHERE user_id = ?)`,
      [req.params.logId, req.params.petId, req.userId],
    );
    if (!existingLogs.length) {
      return res.status(404).json({ error: "Log not found" });
    }

    await pool.query(
      `UPDATE pet_logs
       SET log_type = ?, entry = ?, logged_at = ?
       WHERE pet_log_id = ?
         AND pet_id = ?`,
      [logType, entry, loggedAt, req.params.logId, req.params.petId],
    );
    res.json({
      log: {
        pet_log_id: Number(req.params.logId),
        log_type: logType,
        entry,
        logged_at: loggedAt,
      },
    });
  } catch (error) {
    console.error("Pet log update failed:", error.message);
    res.status(500).json({ error: "Could not update pet log" });
  }
});

router.delete("/:petId/logs/:logId", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM pet_logs
       WHERE pet_log_id = ?
         AND pet_id = ?
         AND pet_id IN (SELECT pet_id FROM pets WHERE user_id = ?)`,
      [req.params.logId, req.params.petId, req.userId],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Pet log deletion failed:", error.message);
    res.status(500).json({ error: "Could not delete pet log" });
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
