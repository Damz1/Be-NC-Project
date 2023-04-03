const express = require("express");
const router = express.Router();
const { getCategories, getApi } = require("../controllers/games.controllers");

router.get("/categories", getCategories);

router.get("/", getApi);

module.exports = router;
