const fs = require("fs/promises");

const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  createComment,
  patchReviewVotes,
  removeComment,
  fetchUsers,
  fetchUserByUsername,
  patchCommentVote,
  postReview,
} = require("../models/games.models");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

const getReviewById = (req, res, next) => {
  const id = req.params.review_id;

  fetchReviewById(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

const getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

const getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;

  fetchCommentsByReviewId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const id = parseInt(req.params.review_id, 10);
  const { username, body } = req.body;

  createComment(username, body, id)
    .then((createdComment) => {
      res.status(201).send({ createdComment });
    })
    .catch(next);
};

const updateReviewVotes = (req, res, next) => {
  const CommmentId = parseInt(req.params.review_id, 10);
  const IncreaseVotesBy = req.body.inc_votes;

  patchReviewVotes(CommmentId, IncreaseVotesBy)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  removeComment(commentId)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const getApi = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf-8")
    .then((content) => {
      const parsedContent = JSON.parse(content);
      res.status(200).json(parsedContent);
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const updateCommentVote = (req, res, next) => {
  const commentId = req.params.comment_id;
  const IncreaseVotesBy = req.body.inc_votes;
  patchCommentVote(commentId, IncreaseVotesBy)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

const addReview = (req, res, next) => {
  const reviewData = req.body;
  postReview(reviewData)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  addComment,
  updateReviewVotes,
  deleteComment,
  getApi,
  getUserByUsername,
  updateCommentVote,
  addReview,
};
