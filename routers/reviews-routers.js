const express = require("express");
const reviewsRouter = express.Router();
const {
  getReviewById,
  getCommentsByReviewId,
  addComment,
  updateReviewVotes,
  getReviews,
} = require("../controllers/games.controllers");

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(addComment);
reviewsRouter.route("/:review_id").get(getReviewById).patch(updateReviewVotes);
reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter;
