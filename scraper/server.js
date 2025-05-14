const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/faculty", async (req, res) => {
  try {
    const url = "https://www.eastdelta.edu.bd/faculty-members/school-of-science-engineering-technology";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const faculty = [];

    $(".et_pb_team_member").each((i, el) => {
      const name = $(el).find("h4").text().trim();
      const role = $(el).find("p").first().text().trim();
      const photo = $(el).find("img").attr("src") || "";
      faculty.push({ name, role, photo });
    });

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
