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

  const respond = await fetch(`https://truyenlh.com/truyen-tranh/${name}`);

  const $ = cheerio.load(await respond.text());

  if ($(".content.img-in-ratio").css("background-image") === undefined) {
    result.status = 404;
    result.message = "not found";
    result.data = null;
    return res.status(404).send(result);
  }

  result.data.title = $(".series-name a").text().trim();
  result.data.cover = $(".content.img-in-ratio")
    .css("background-image")
    .replace("url('", "")
    .replace("')", "")
    .replaceAll("&quot;", "");
  result.data.genres = null;
  result.data.otherTitle = null;
  result.data.author = "Chưa được cập nhật";

  $(".info-item").each((i, el) => {
    const item = $(el).find(":not(span:first-child) a");

    const label = $(el).find(".info-name").text();

    switch (label) {
      case "Tên khác:":
        result.data.otherTitle = [];
        $(el)
          .find(":not(span:first-child)")
          .map((i, el) => {
            if ($(el)) {
              result.data.otherTitle.push($(el).text().trim());
            } else {
              result.data.otherTitle = null;
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
  $(".others-list li")
    .map((i, el) => {
      const title = $(el).find(".others-name a").text().trim();
      const mangaLink = $(el).find(".others-name a").attr("href");
      if (!mangaLink) return null;

      const mangaEP = mangaLink.split("/truyen-tranh/")[1];
      const description = $(el).find(".series-summary").text().trim();
      const cover = $(el)
        .find(".content.img-in-ratio")
        .css("background-image")
        .replace("url('", "")
        .replace("')", "");
      const manga = {
        title,
        mangaEP,
        description,
        cover,
      };

      result.data.related.push(manga);
    })
    .filter(Boolean);

  result.data.description = $(".summary-content p").text().trim();

  const chaps = $(".list-chapters.at-series");
  result.data.chapsTotal = chaps[0]["children"].length;

  result.data.chaps = [];

  chaps[0]["children"].map((chap) => {
    const chapsLink = chap["attribs"]["href"];
    const chapTitle = chap["attribs"]["title"];
    const chapTime = chap["children"][0]["children"][1]["children"][0]["data"];
    const chapEP = chapsLink.split("/")[5];

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
