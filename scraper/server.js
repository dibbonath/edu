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

    // Loop through each profile block
    $("div.t3iYD").each((i, el) => {
      const photo = $(el).find("img").attr("src") || "";

      const nameElem = $(el).closest(".hJDwNd-AhqUyc-II5mzb")
        .find("h2 span.C9DxTc")
        .first()
        .text()
        .trim();

      const roleElem = $(el).closest(".hJDwNd-AhqUyc-II5mzb")
        .find("p span.C9DxTc")
        .first()
        .text()
        .trim();

      if (nameElem && roleElem && photo) {
        faculty.push({
          name: nameElem,
          role: roleElem,
          photo,
        });
      }
    });

    res.json(faculty);
  } catch (err) {
    console.error("Scrape failed:", err.message);
    res.status(500).json({ error: "Failed to scrape faculty members." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
