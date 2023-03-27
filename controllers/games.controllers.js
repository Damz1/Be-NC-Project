const fetchCategories = require("../models/games.models");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories, msg: "server is up and running" });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getCategories;
