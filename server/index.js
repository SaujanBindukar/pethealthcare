require("dotenv").config();

const express = require("express");
const cors = require("cors");
//this is the connection to the database
const database = require("./database/database");

const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/pets");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);

app.get("/api/services", async (req, res) => {
  try {
    const [services] = await database.query(
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

app.get("/api/breeds", async (req, res) => {
  try {
    const [breeds] = await database.query(
      `SELECT breed_id, slug, name, description, image_path
       FROM dog_breeds
       ORDER BY name`,
    );
    res.json(breeds);
  } catch (error) {
    console.error("Breed list failed:", error.message);
    res.status(500).json({ error: "Could not fetch dog breeds" });
  }
});

app.get("/api/breeds/:slug", async (req, res) => {
  try {
    const [breeds] = await database.query(
      `SELECT breed_id, slug, name, description, image_path
       FROM dog_breeds
       WHERE slug = ?`,
      [req.params.slug],
    );
    if (!breeds.length) {
      return res.status(404).json({ error: "Dog breed not found" });
    }
    const [sections] = await database.query(
      "SELECT section_id, title, content FROM breed_sections WHERE breed_id = ? ORDER BY section_id",
      [breeds[0].breed_id],
    );
    const sectionIds = sections.map((section) => section.section_id);
    let questions = [];
    if (sectionIds.length) {
      [questions] = await database.query(
        "SELECT question_id, section_id, question, answer FROM breed_questions WHERE section_id IN (?) ORDER BY question_id",
        [sectionIds],
      );
    }
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

app.get("/api/species/:id/sections", async (req, res) => {
  try {
    const [sections] = await database.query(
      "SELECT * FROM guide_sections WHERE guide_id = ? ORDER BY id",
      [req.params.id],
    );

    if (!sections.length) {
      res.json([]);
      return;
    }

    const sectionIds = sections.map((section) => section.id);
    const [questions] = await database.query(
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch guide sections" });
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
