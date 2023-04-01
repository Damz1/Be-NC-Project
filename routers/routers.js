const express = require("express");
const router = express.Router();
const {
  getCategories,
  deleteComment,
  getUsers,
  getApi,
} = require("../controllers/games.controllers");

router.get("/users", getUsers);
router.get("/categories", getCategories);
router.delete("/comments/:comment_id", deleteComment);
router.get("/", getApi);

module.exports = router;
