const express = require("express");
const app = express.Router();
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { removeVietnameseTones } = require("../function/vietnamesetone");

app.get("/", async (req, res) => {
  const genre = req.query.genre;
  const list = req.query.list;
  const status = req.query.status;
  const sort = req.query.sort;
  const page = req.query.page;
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

  if (!genre && !list) {
    const genresList = [
      "Action",
      "Adult",
      "Adventure",
      "Anime",
      "Chuyển Sinh",
      "Cổ Đại",
      "Comedy",
      "Comic",
      "Demons",
      "Detective",
      "Doujinshi",
      "Drama",
      "Đam Mỹ",
      "Ecchi",
      "Fantasy",
      "Gender Bender",
      "Harem",
      "Historical",
      "Horror",
      "Huyền Huyễn",
      "Isekai",
      "Josei",
      "Mafia",
      "Magic",
      "Manhua",
      "Manhwa",
      "Martial Arts",
      "Mature",
      "Military",
      "Mystery",
      "Ngôn Tình",
      "One shot",
      "Psychological",
      "Romance",
      "School Life",
      "Sci-fi",
      "Seinen",
      "Shoujo",
      "Shoujo Ai",
      "Shounen",
      "Shounen Ai",
      "Slice of life",
      "Smut",
      "Sports",
      "Supernatural",
      "Tragedy",
      "Trọng Sinh",
      "Truyện Màu",
      "Webtoon",
      "Xuyên Không",
      "Yaoi",
      "Yuri",
      "Mecha",
      "Cooking",
      "Trùng Sinh",
      "Gourmet",
    ];

    result.data.genresListFilter = [];
    genresList.map((genre) => {
      genreObj = {};
      genreObj.genre = genre;
      genreObj.api =
        "https://mangalh-api.vercel.app/genres?genre=" +
        removeVietnameseTones(genre).toLowerCase().replace(/\s/g, "-");

        result.data.genresListFilter.push(genreObj);
    });

    res.send(result);
    return;
  }

  let fetchLink
  if (genre) {
    fetchLink = `https://truyentranhlh.net/the-loai/${genre}?${
    status ? statusLink + "=1&" : ""
  }${sort ? "sort=" + sortLink + "&" : ""}${page ? "page=" + page : "page=1"}`;
  } else if (list) {
    fetchLink = `https://truyentranhlh.net/danh-sach?${
    status ? statusLink + "=1&" : ""
  }${sort ? "sort=" + sortLink + "&" : ""}${page ? "page=" + page : "page=1"}`;
  }

  const response = await fetch(fetchLink);
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
