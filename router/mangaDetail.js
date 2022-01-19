const express = require("express");
const app = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.get("/:name", async (req, res) => {
  const name = req.params.name;
  const mangaObj = {};

  const respond = await fetch(`https://truyentranhlh.net/truyen-tranh/${name}`);
  const $ = cheerio.load(await respond.text());
  mangaObj.name = $(".series-name a").text().trim();
  mangaObj.cover = $(".content.img-in-ratio")
    .css("background-image")
    .replace(/.*\s?url\([\'\"]?/, "")
    .replace(/[\'\"]?\).*/, "");
  mangaObj.genres = [];
  mangaObj.otherName = [];
  mangaObj.author = [];
  $(".info-item").each((i, el) => {
    const item = $(el).find(":not(span:first-child) a");
    switch (i) {
      case 0:
        $(el)
          .find(":not(span:first-child)")
          .map((i, el) => {
            mangaObj.otherName.push(el["children"][0]["data"].trim());
          });
        break;
      case 1:
        item.map((i, el) => {
          mangaObj.genres.push(el["children"][0]["children"][0]["data"].trim());
        });
        break;
      case 2:
        item.map((i, el) => {
          mangaObj.author.push(el["children"][0]["data"].trim());
        });
        break;
      case 3:
        mangaObj.status = item.text();
    }
  });
  mangaObj.lastUpdate = $(".timeago").text().trim();
  mangaObj.rating = parseInt(
    $(".statistic-item:nth-child(2) .statistic-value")
      .clone()
      .children()
      .remove()
      .end()
      .text()
  );
  mangaObj.view = parseInt(
    $(".statistic-item:nth-child(3) .statistic-value")
      .clone()
      .children()
      .remove()
      .end()
      .text()
  );
  mangaObj.related = [];
  $(".others-list li").map((i, el) => {
    const name = $(el).find(".others-name a").text().trim();
    const mangaLink = $(el).find(".others-name a").attr("href");
    const mangaEP = mangaLink.slice(-(mangaLink.length - 39));
    const description = $(el).find(".series-summary").text().trim();
    const cover = $(el)
      .find(".content.img-in-ratio")
      .css("background-image")
      .replace(/.*\s?url\([\'\"]?/, "")
      .replace(/[\'\"]?\).*/, "");
    const manga = {
      name,
      mangaEP,
      description,
      cover,
    };
    mangaObj.related.push(manga);
  });
  mangaObj.description = $(".summary-content p").text().trim();
  const chaps = $(".list-chapters.at-series");
  mangaObj.chapsTotal = chaps[0]["children"].length;
  mangaObj.chaps = [];

  chaps[0]["children"].map((chap) => {
    const chapsLink = chap["attribs"]["href"];
    const chapTitle = chap["attribs"]["title"];
    const chapTime = chap["children"][0]["children"][1]["children"][0]["data"];
    const chapEP = chapsLink.slice(-(chapsLink.length - name.length - 40));
    const chapFormat = {
      chapTime,
      chapTitle,
      chapEP,
    };
    mangaObj.chaps.unshift(chapFormat);
  });

  res.send(mangaObj);
});

module.exports = app;
