const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");

app.use(cors());

app.get("/", async (req, res) => {
    const respond = await fetch('https://truyentranhlh.net/truyen-tranh/tensai-ouji-no-akaji-kokka-saisei-jutsu-souda-baikoku-shiyou/24-9')
    res.send(await respond.text())
});

const port = process.env.port || 3000
app.listen(port, () => console.log('listening on port ' + port))