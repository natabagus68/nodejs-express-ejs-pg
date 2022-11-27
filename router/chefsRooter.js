const express = require("express");
const router = express.Router();
const ChefController = require("../controllers/chefs");

router.get("/", ChefController.toListChefs);
router.get("/detail", ChefController.toDetail);

module.exports = router;
