const express = require("express");
const pool = require("../database/database");

const router = express.Router();

// Return the veterinary providers displayed in the support section.
router.get("/", async (req, res) => {
  try {
    const [services] = await pool.query(
      `SELECT service_id, service_type, name, phone, description
       FROM care_services
       ORDER BY display_order, name`,
    );
    res.json(services);
  } catch (error) {
    console.error("Service list failed:", error.message);
    res.status(500).json({ error: "Could not fetch care services" });
  }
});

module.exports = router;
