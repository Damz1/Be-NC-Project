const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
} = require("../models/games.models");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

const getReviewById = (req, res, next) => {
  const id = req.params.review_id;

  fetchReviewById(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

const getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCategories, getReviewById, getReviews };
