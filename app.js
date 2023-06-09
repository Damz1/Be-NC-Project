const cors = require("cors");
const express = require("express");
const app = express();
const routers = require("./routers/routers");
const reviewsRouter = require("./routers/reviews-routers");
const usersRouter = require("./routers/users-router");
const commentsRouter = require("./routers/comments-router");
const { handle400Errors, handleOtherErrors } = require("./errorsHandler");

app.use(cors());
app.use(express.json());

app.use("/api/comments", commentsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api", routers);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: url not found" });
});

// ----Error Handling---//
app.use(handle400Errors);
app.use(handleOtherErrors);

module.exports = app;
