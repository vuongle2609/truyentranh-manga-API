const express = require("express");
const app = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.get("/:name/:chap", async (req, res) => {
  const name = req.params.name;
  const chap = req.params.chap;
  const mangaObj = {};

  const mangaLink = `https://truyentranhlh.net/truyen-tranh/${name}/${chap}`;
  const response = await fetch(mangaLink);
  const $ = cheerio.load(await response.text());

  const prevLink = $(".rd_sd-button_item2.rd_top-left")
    .attr("href")
    .slice(-(mangaLink.length - name.length - 40));
  const nextLink = $(".rd_sd-button_item2.rd_top-right")
    .attr("href")
    .slice(-(mangaLink.length - name.length - 40));
  mangaObj.prevChapter = prevLink !== "#" ? prevLink : null;
  mangaObj.nextChapter = nextLink !== "#" ? nextLink : null;

  mangaObj.pages = [];
  $("#chapter-content img").map((i, el) => {
    mangaObj.pages.push(
      $(el).attr("src") ? $(el).attr("src") : $(el).attr("data-src")
    );
  });
  res.send(mangaObj);
});

module.exports = app;
