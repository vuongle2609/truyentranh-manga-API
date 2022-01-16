const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { map } = require("cheerio/lib/api/traversing");

app.use(cors());

app.get("/", async (req, res) => {
  result = "<h1>an api for get data from truyentranhlh</h1><h2>by vuongle</h2>";
  res.send(result);
});

app.get("/manga/:name", async (req, res) => {
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
    mangaObj.chaps.push(chapFormat);
  });

  res.send(mangaObj);
});

app.get("/manga/:name/:chap", async (req, res) => {
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
    console.log(el["attribs"]);
  });
  res.send(mangaObj);
});

app.get("/genres", async (req, res) => {
  const genre = req.query.genre;
  const status = req.query.status;
  const sort = req.query.sort;
  const page = req.query.page;
  const result = {};

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

  if (!genre) {
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

    res.send(genresList);
    return;
  }

  const fetchLink = `https://truyentranhlh.net/the-loai/${genre}?${
    status ? statusLink + "=1&" : ""
  }${sort ? "sort=" + sortLink + "&" : ""}${page ? "page=" + page : "page=1"}`;
  const response = await fetch(fetchLink);
  const $ = cheerio.load(await response.text());

  result.currentPage = Number(page ? page : 1);
  const lastPagesLink = $(".pagination_wrap").find("a:last-child").attr("href");
  result.totalPages = Number(
    lastPagesLink.slice(lastPagesLink.search("page=") + 5)
  );
  result.mangas = [];
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

    result.mangas.push(mangaObj);
  });
  res.send(result);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log("listening on port " + port));
