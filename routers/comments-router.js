const express = require("express");
const commentsRouter = express.Router();
const {
  deleteComment,
  updateCommentVote,
} = require("../controllers/games.controllers");

commentsRouter.delete("/:comment_id", deleteComment);
commentsRouter.patch("/:comment_id", updateCommentVote);

module.exports = commentsRouter;
