const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.use(cors());

app.get("/manga/:name", async (req, res) => {
  const name = req.params.name;
  const mangaObj = {};

  const respond = await fetch(`https://truyentranhlh.net/truyen-tranh/${name}`);
  const $ = cheerio.load(await respond.text());
  mangaObj.name = $(".series-name a").text();
  $(".info-item").each((i, el) => {
    const item = $(el).find(":not(span:first-child) a").text();
    switch (i) {
      case 0:
        mangaObj.otherName = $(el).find(":not(span:first-child)").text();
        break;
      case 1:
        mangaObj.genres = item;
        break;
      case 2:
        mangaObj.author = item;
        break;
      case 3:
        mangaObj.status = item;
    }
  });
  mangaObj.lastUpdate = $(".timeago").text();
  mangaObj.rating = $(".statistic-item:nth-child(2) .statistic-value")
    .clone()
    .children()
    .remove()
    .end()
    .text();
  mangaObj.view = $(".statistic-item:nth-child(3) .statistic-value")
    .clone()
    .children()
    .remove()
    .end()
    .text();
  mangaObj.description = $(".summary-content p").text();
  const chaps = $(".list-chapters.at-series");
  console.log(chaps["children"]['children'])
  console.log(chaps[0]["children"]);
  mangaObj.chapsTotal = chaps[0]["children"].length;
  mangaObj.chaps = [];
  for (var i = 0; i < mangaObj.chapsTotal; i++) {
      const chapsLink = chaps[0]["children"][i]["attribs"]["href"];
      const chapTitle = chaps[0]["children"][i]["attribs"]["title"]
      
      const chapEP = (chapsLink.slice(-(chapsLink.length - name.length - 40)));
      const chapFormat = {
        chapTitle,
        chapEP
      }
    mangaObj.chaps.push(chapFormat)
  }
  res.send(mangaObj);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log("listening on port " + port));
