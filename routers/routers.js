const express = require("express");
const router = express.Router();
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  addComment,
  updateVotes,
  deleteComment,
  getUsers,
  getApi,
} = require("../controllers/games.controllers");

router.get("/users", getUsers);
router.get("/categories", getCategories);
router.get("/reviews", getReviews);

router
  .route("/reviews/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(addComment);

router.route("/reviews/:review_id").get(getReviewById).patch(updateVotes);

router.delete("/comments/:comment_id", deleteComment);
router.get("/", getApi);

module.exports = router;
