const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  getCategories,
  deleteComment,
  getUsers,
  getApi,
  updateCommentVote,
} = require("../controllers/games.controllers");

router.get("/users", getUsers);
router.get("/users/:username", getUserByUsername);
router.get("/categories", getCategories);
router.delete("/comments/:comment_id", deleteComment);
router.patch("/comments/:comment_id", updateCommentVote);
router.get("/", getApi);

module.exports = router;
