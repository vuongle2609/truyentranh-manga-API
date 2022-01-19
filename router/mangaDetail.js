const express = require("express");
const app = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.get("/:name", async (req, res) => {
  const name = req.params.name;
  const result = {
    status: 200,
    message: "Success",
    data: {},
  };

  const respond = await fetch(`https://truyentranhlh.net/truyen-tranh/${name}`);

  const $ = cheerio.load(await respond.text());

  result.data.name = $(".series-name a").text().trim();
  result.data.cover = $(".content.img-in-ratio")
    .css("background-image")
    .replace(/.*\s?url\([\'\"]?/, "")
    .replace(/[\'\"]?\).*/, "");
  result.data.genres = null;
  result.data.otherName = null;
  result.data.author = "Chưa được cập nhật";

  $(".info-item").each((i, el) => {
    const item = $(el).find(":not(span:first-child) a");

    const label = $(el).find(".info-name").text();

    switch (label) {
      case "Tên khác:":
        result.data.otherName = [];
        $(el)
          .find(":not(span:first-child)")
          .map((i, el) => {
            if ($(el)) {
              result.data.otherName.push($(el).text().trim());
            } else {
              result.data.otherName = null;
            }
          });
        break;
      case "Thể loại:":
        result.data.genres = [];
        item.map((i, el) => {
          if (item) {
            result.data.genres.push($(el).text().trim());
          } else {
            result.data.genres = null;
          }
        });
        break;
      case "Tác giả:":
        result.data.author = [];
        item.map((i, el) => {
          if ($(el) && $(el).text() !== "Đang cập nhật") {
            console;
            result.data.author.push($(el).text().trim());
          } else {
            result.data.author = "Chưa được cập nhật";
          }
        });
        break;
      case "Tình trạng:":
        item
          ? (result.data.status = item.text())
          : (result.data.status = "không xác định");
    }
  });

  result.data.lastUpdate = $(".timeago").text().trim();

  result.data.rating = parseInt(
    $(".statistic-item:nth-child(2) .statistic-value")
      .clone()
      .children()
      .remove()
      .end()
      .text()
  );

  result.data.view = parseInt(
    $(".statistic-item:nth-child(3) .statistic-value")
      .clone()
      .children()
      .remove()
      .end()
      .text()
  );

  result.data.related = [];
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

    result.data.related.push(manga);
  });

  result.data.description = $(".summary-content p").text().trim();

  const chaps = $(".list-chapters.at-series");
  result.data.chapsTotal = chaps[0]["children"].length;

  result.data.chaps = [];

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
    result.data.chaps.unshift(chapFormat);
  });

  res.send(result);
});

module.exports = app;
