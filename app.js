const express = require("express");
const app = express();
const getCategories = require("./controllers/games.controllers");
const { handle400Errors, handleOtherErrors } = require("./errorsHandler");

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: Not Found" });
});

// ----Error Handling---//
app.use(handle400Errors);
app.use(handleOtherErrors);

module.exports = app;
