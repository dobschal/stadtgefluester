const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const path = require("path");
const useragent = require("express-useragent");
const app = express();
const port = 8080;
const pathToApis = path.join(__dirname, "api");
const apis = [];

app.use(useragent.express());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.static(path.join(__dirname, "../client/build")));

fs.readdirSync(pathToApis).forEach(apiFile => {
    const pathToApi = path.join(pathToApis, apiFile);
    console.log(`Include api: ${pathToApi}...`);
    const ApiClass = require(pathToApi);
    apis.push(new ApiClass(app));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
