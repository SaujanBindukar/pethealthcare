require("dotenv").config();

const database = require("./database/database");
const app = require("./app");

const PORT = Number(process.env.PORT || 3000);

database
  .query("SELECT 1")
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
