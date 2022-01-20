const express = require("express");
const app = express();
const cors = require("cors");
const list = require("./router/list");
const mangaDetail = require("./router/mangaDetail");
const mangaRead = require("./router/mangaRead");
const home = require("./router/home");
const search = require("./router/search");

app.use(cors());

app.get("/", async (req, res) => {
  result = "<h1>an api for get data from truyentranhlh</h1><h2>by vuongle</h2>";
  res.send(result);
});

app.use("/home", home);

app.use("/list", list);

app.use("/manga", mangaDetail);

app.use("/manga", mangaRead);

app.use("/search", search);

const port = process.env.port || 3000;
app.listen(port, () => console.log("listening on port " + port));
