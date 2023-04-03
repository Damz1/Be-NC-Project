const express = require("express");
const usersRouter = express.Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/games.controllers");

usersRouter.get("/:username", getUserByUsername);
usersRouter.get("/", getUsers);

module.exports = usersRouter;
