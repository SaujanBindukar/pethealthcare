const express = require("express");
const pool = require("../database/database");

const router = express.Router();

function clientAssetPath(imagePath) {
  if (!imagePath || imagePath.startsWith("../")) return imagePath;
  return `../shared/assets/${imagePath}`;
}

router.get("/", async (req, res) => {
  try {
    const [guides] = await pool.query(
      "SELECT id, name, image_path FROM care_guides",
    );
    res.json(
      guides.map((guide) => ({
        ...guide,
        image_path: clientAssetPath(guide.image_path),
      })),
    );
  } catch (error) {
    console.error("Guide list failed:", error.message);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

router.get("/:id/sections", async (req, res) => {
  try {
    const [sections] = await pool.query(
      "SELECT * FROM guide_sections WHERE guide_id = ? ORDER BY id",
      [req.params.id],
    );
    if (!sections.length) return res.json([]);

    const sectionIds = sections.map((section) => section.id);
    const [questions] = await pool.query(
      "SELECT id, section_id, question, answer FROM guide_questions WHERE section_id IN (?) ORDER BY id",
      [sectionIds],
    );
    const questionsBySection = new Map();
    questions.forEach((question) => {
      const sectionQuestions =
        questionsBySection.get(question.section_id) || [];
      sectionQuestions.push(question);
      questionsBySection.set(question.section_id, sectionQuestions);
    });
    sections.forEach((section) => {
      section.questions = questionsBySection.get(section.id) || [];
    });
    res.json(sections);
  } catch (error) {
    console.error("Guide sections failed:", error.message);
    res.status(500).json({ error: "Failed to fetch guide sections" });
  }
});

module.exports = router;
