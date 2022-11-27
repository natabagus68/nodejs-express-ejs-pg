const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const routers = require("./router");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", routers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
