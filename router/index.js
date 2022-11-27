const express = require("express");
const router = express.Router();
const chefs = require("./chefsRooter");
const recipes = require("./recipesRooter");
const ControllerLandingPage = require("../controllers/landingPage");

router.get("/", ControllerLandingPage.toLandingPage);
router.use("/chefs", chefs);
router.use("/recipes", recipes);

module.exports = router;
