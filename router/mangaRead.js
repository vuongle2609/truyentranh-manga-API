const express = require("express");
const app = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.get("/:name/:chap", async (req, res) => {
  const name = req.params.name;
  const chap = req.params.chap;
  const result = {
    status: 200,
    message: "Success",
    data: {},
  };

  const testL = "https://truyenlh.com/truyen-tranh/";
  const mangaLink = `https://truyenlh.com/truyen-tranh/${name}/${chap}`;
  console.log(mangaLink);
  const cut = mangaLink.slice(testL.length);
  const response = await fetch(mangaLink);
  const $ = cheerio.load(await response.text());

  const prevLink = $(".rd_sd-button_item2.rd_top-left")
    .attr("href")
    .slice(testL.length)
    .slice(cut.indexOf("/") + 1);
  const nextLink = $(".rd_sd-button_item2.rd_top-right")
    .attr("href")
    .slice(testL.length)
    .slice(cut.indexOf("/") + 1);
  const currentChapter = $(".breadcrumb li:last-child").text();

  result.data.currentChapter = currentChapter;
  result.data.prevChapter = prevLink !== "#" ? prevLink : null;
  result.data.nextChapter = nextLink !== "#" ? nextLink : null;

  result.data.pages = [];
  $("#chapter-content img").map((i, el) => {
    result.data.pages.push(
      $(el).attr("src") ? $(el).attr("src") : $(el).attr("data-src")
    );
  });

  result.data.chapterList = [];

  $("#chap_list li").map((i, el) => {
    chapterObj = {};

    chapterObj.chapter = $(el).text().trim();

    chapterObj.chapEP = $(el)
      .find("a")
      .attr("href")
      .slice(testL.length)
      .slice(cut.indexOf("/") + 1);

    result.data.chapterList.push(chapterObj);
  });
  res.send(result);
});

module.exports = app;
