const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const app = express.Router();

app.get("/", async (req, res) => {
  const randomPage = Math.floor(Math.random() * 288);

  const response = await fetch(
    `https://truyenlh.com/tim-kiem?sort=az&reject_genres=25%2C26&page=${randomPage}`
  );

  const $ = cheerio.load(await response.text());

  const randomManga = Math.floor(Math.random() * 17);

  const randomEP = $(".thumb-item-flow.col-6.col-md-2")[`${randomManga}`][
    "children"
  ][0]["children"][0]["attribs"].href.slice(39);

  res.send({
    randomEP,
  });
});

module.exports = app;
