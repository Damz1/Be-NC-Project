const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  createComment,
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

const getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;

  fetchCommentsByReviewId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const addComment = (req, res, next) => {
  const id = parseInt(req.params.review_id, 10);
  const { username, body } = req.body;

  createComment(username, body, id)
    .then((createdComment) => {
      res.status(201).send({ createdComment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  addComment,
};
