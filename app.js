const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
} = require("./controllers/games.controllers");
const { handle400Errors, handleOtherErrors } = require("./errorsHandler");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: url not found" });
});

// ----Error Handling---//
app.use(handle400Errors);
app.use(handleOtherErrors);

module.exports = app;
