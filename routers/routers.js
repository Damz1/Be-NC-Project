const express = require("express");
const router = express.Router();
const {
  getCategories,
  deleteComment,
  getApi,
  updateCommentVote,
} = require("../controllers/games.controllers");

router.get("/categories", getCategories);
router.delete("/comments/:comment_id", deleteComment);
router.patch("/comments/:comment_id", updateCommentVote);
router.get("/", getApi);

module.exports = router;
