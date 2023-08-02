const express = require("express");
const app = express.Router();
const cheerio = require("cheerio");
const fetch = require("node-fetch");

app.get("/", async (req, res) => {
  const result = {
    status: 200,
    message: "Success",
    data: {},
  };

  const response = await fetch("https://truyentranhlh.net/");
  const $ = cheerio.load(await response.text(), { xmlMode: false });

  // get daily data
  result.data.daily = [];

  $(".owl-stage .owl-item").map((i, el) => {
    const mangaOBJ = {};

    mangaOBJ.title = $(el).find(".thumb_attr.series-title").text().trim();
    mangaOBJ.lastChap = $(el).find(".thumb-detail div").text().trim();
    mangaOBJ.cover = $(el)
      .find(".content.img-in-ratio")
      .css("background-image")
      .replace("url('", "")
      .replace("')", "")
      .replaceAll("&quot;", "");

    const mangaLink = $(el).find(".thumb-wrapper a").attr("href");
    const mangaEP = mangaLink.slice(-(mangaLink.length - 39));
    mangaOBJ.mangaEP = mangaEP;

    mangaOBJ.lastUpdate = $(el).find("time").attr("title");
    result.data.daily.push(mangaOBJ);
  });

  // get newest
  result.data.newUpdate = [];

  result.data.newManga = [];

  $(".card-body .row .thumb-item-flow.col-6").map((i, el) => {
    const mangaOBJ = {};

    mangaOBJ.title = $(el).find(".thumb_attr.series-title").text().trim();

    mangaOBJ.lastChap = $(el).find(".thumb-detail").text().trim();
    mangaOBJ.cover = $(el)
      .find(".content.img-in-ratio")
      .css("background-image")
      .replace("url('", "")
      .replace("')", "")
      .replaceAll("&quot;", "");

    const mangaLink = $(el).find(".thumb-wrapper a").attr("href");
    const mangaEP = mangaLink.slice(-(mangaLink.length - 39));
    mangaOBJ.mangaEP = mangaEP;

    mangaOBJ.lastUpdate = $(el).find(".timeago").attr("title");
    if (mangaOBJ.title.length !== 0) {
      if (i < 27) {
        result.data.newUpdate.push(mangaOBJ);
      } else {
        result.data.newManga.push(mangaOBJ);
      }
    }
  });

  res.send(result);
});

module.exports = app;
