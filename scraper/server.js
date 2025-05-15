const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.get("/api/faculty", async (req, res) => {
  try {
    const url = "https://www.eastdelta.edu.bd/faculty-members/school-of-science-engineering-technology";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const faculty = [];

    // Loop through all faculty containers with the class oKdM2c
    $(".oKdM2c").each((i, el) => {
      // Extract the faculty name (inside <h2> tag with span class C9DxTc)
      const name = $(el).find("h2 span.C9DxTc").text().trim();

      // Extract the faculty role (inside <p> tag with span class C9DxTc)
      const role = $(el).find("p span.C9DxTc").text().trim();

      // Extract the faculty photo (from <img> tag)
      const photo = $(el).find("img").attr("src");

      // Only add data if all necessary elements are found
      if (name && role && photo) {
        faculty.push({ name, role, photo });
      }
    });

    // Send the scraped data as a JSON response
    res.json(faculty);
  } catch (err) {
    console.error("Scrape failed:", err.message);
    res.status(500).json({ error: "Failed to scrape" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
