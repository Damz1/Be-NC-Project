const express = require("express");
const reviewsRouter = express.Router();
const {
  getReviewById,
  getCommentsByReviewId,
  addComment,
  updateVotes,
  getReviews,
} = require("../controllers/games.controllers");

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(addComment);
reviewsRouter.route("/:review_id").get(getReviewById).patch(updateVotes);
reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter;
