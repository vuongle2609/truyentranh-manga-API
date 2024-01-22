const express = require("express");
const app = express.Router();
const cheerio = require("cheerio");
const fetch = require("node-fetch");

app.get("/", async (req, res) => {
  const keyWord = req.query.keyword;
  const artist = req.query.artist;
  const status = req.query.status;
  const sort = req.query.sort;
  const page = req.query.page;
  const blockGenres = req.query.blockgenres;
  const genres = req.query.genres;
  const result = {
    status: 200,
    message: "Success",
    data: {},
  };

  let statusLink;
  if (status === "0") {
    statusLink = "dangtienhanh";
  } else if (status === "1") {
    statusLink = "tamngung";
  } else if (status === "2") {
    statusLink = "hoanthanh";
  }

  let sortLink;
  switch (sort) {
    case "0":
      sortLink = "az";
      break;
    case "1":
      sortLink = "za";
      break;
    case "2":
      sortLink = "update";
      break;
    case "3":
      sortLink = "new";
      break;
    case "4":
      sortLink = "top";
      break;
    case "5":
      sortLink = "like";
  }

  const fetchApi = `https://truyenlh.com/tim-kiem?${
    keyWord ? "q=" + keyWord + "&" : ""
  }${artist ? "artist=" + artist + "&" : ""}${
    status ? statusLink + "=1&" : ""
  }${sort ? "sort=" + sortLink + "&" : ""}${
    genres ? "accept_genres=" + genres + "&" : ""
  }${blockGenres ? "reject_genres=" + blockGenres + "&" : ""}${
    page ? "page=" + page : "page=1"
  }`;

  const response = await fetch(fetchApi);
  const $ = cheerio.load(await response.text());

  const mangaBlock = $('.thumb-item-flow.col-6.col-md-3')

  if (!mangaBlock)
  return res.status(404).send({
    status: 404,
    message: "bad resquest",
    data: null,
  });
  const lastPagesLink = $(".pagination_wrap").find("a:last-child").attr("href");

  result.data.currentPage = Number(page ? page : 1);

  if (lastPagesLink) {
    result.data.totalPages = Number(
      lastPagesLink.slice(lastPagesLink.search("page=") + 5)
    );
  } else {
    result.data.totalPages = 1
  }
  result.data.mangas = [];
  $(".thumb-item-flow.col-6").map((i, el) => {
    const title = $(el).find(".series-title").text().trim();
    const lastChap = $(el)
      .find(".thumb_attr.chapter-title.text-truncate")
      .text()
      .trim();

    const cover = $(el)
      .find(".content.img-in-ratio")
      .css("background-image")
      .replace(/.*\s?url\([\'\"]?/, "")
      .replace(/[\'\"]?\).*/, "");

    const lastUpdate = $(el).find(".timeago").attr("datetime");

    mangaLink = $(el).find("a").attr("href");
    const mangaEP = mangaLink.slice(-(mangaLink.length - 39));

    const mangaObj = {
      title,
      lastChap,
      cover,
      mangaEP,
      lastUpdate,
    };

    result.data.mangas.push(mangaObj);
  });
  res.send(result);
});

module.exports = app;
