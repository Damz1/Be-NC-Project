const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  createComment,
  patchVotes,
  removeComment,
  fetchUsers,
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

const updateVotes = (req, res, next) => {
  const id = parseInt(req.params.review_id, 10);
  const IncreaseVotesBy = req.body.inc_votes;

  patchVotes(id, IncreaseVotesBy)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => next(err));
};

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  removeComment(commentId)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  addComment,
  updateVotes,
  deleteComment,
};
