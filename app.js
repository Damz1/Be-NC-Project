const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  addComment,
  updateVotes,
  deleteComment,
  getUsers,
} = require("./controllers/games.controllers");
const { handle400Errors, handleOtherErrors } = require("./errorsHandler");

app.use(express.json());
app.get("/api/users", getUsers);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", addComment);
app.patch("/api/reviews/:review_id", updateVotes);
app.delete("/api/comments/:comment_id", deleteComment);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: url not found" });
});

// ----Error Handling---//
app.use(handle400Errors);
app.use(handleOtherErrors);

module.exports = app;
