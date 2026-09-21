const express = require("express");
const pool = require("../database/database");

const router = express.Router();

// Return the breed cards shown on the home page.
router.get("/", async (req, res) => {
  try {
    const [breeds] = await pool.query(
      `SELECT breed_id, slug, name, description, image_url
       FROM dog_breeds
       ORDER BY name`,
    );
    res.json(breeds);
  } catch (error) {
    console.error("Breed list failed:", error.message);
    res.status(500).json({ error: "Could not fetch dog breeds" });
  }
});

// Return one breed with its care sections and questions.
router.get("/:slug", async (req, res) => {
  try {
    const [breeds] = await pool.query(
      `SELECT breed_id, slug, name, description, image_url
       FROM dog_breeds
       WHERE slug = ?`,
      [req.params.slug],
    );
    if (!breeds.length) {
      return res.status(404).json({ error: "Dog breed not found" });
    }

    const [sections] = await pool.query(
      "SELECT section_id, title, content FROM breed_sections WHERE breed_id = ? ORDER BY section_id",
      [breeds[0].breed_id],
    );
    const sectionIds = sections.map((section) => section.section_id);
    let questions = [];
    if (sectionIds.length) {
      [questions] = await pool.query(
        "SELECT question_id, section_id, question, answer FROM breed_questions WHERE section_id IN (?) ORDER BY question_id",
        [sectionIds],
      );
    }

    // Group questions so the client can render each section as one guide block.
    const questionsBySection = new Map();
    questions.forEach((question) => {
      const sectionQuestions =
        questionsBySection.get(question.section_id) || [];
      sectionQuestions.push(question);
      questionsBySection.set(question.section_id, sectionQuestions);
    });
    sections.forEach((section) => {
      section.questions = questionsBySection.get(section.section_id) || [];
    });

    res.json({ ...breeds[0], sections });
  } catch (error) {
    console.error("Breed detail failed:", error.message);
    res.status(500).json({ error: "Could not fetch dog breed" });
  }
});

module.exports = router;
