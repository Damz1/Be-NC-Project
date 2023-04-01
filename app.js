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
  getApi,
} = require("./controllers/games.controllers");
const { handle400Errors, handleOtherErrors } = require("./errorsHandler");

app.use(express.json());
app.get("/api", getApi);
app.get("/api/users", getUsers);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.route("/api/reviews/:review_id").get(getReviewById).patch(updateVotes);

app
  .route("/api/reviews/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(addComment);

app.delete("/api/comments/:comment_id", deleteComment);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: url not found" });
});

// ----Error Handling---//
app.use(handle400Errors);
app.use(handleOtherErrors);

module.exports = app;
