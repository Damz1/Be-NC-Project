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
  const { sort_by, order, category } = req.query;
  fetchReviews(sort_by, order, category)
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

const getApi = (req, res, next) => {
  res.status(200).send({
    endpoints: [
      {
        name: "Get All Users",
        method: "GET",
        url: "/api/users",
        parameters: [],
        description: "Retrieves a list of all users.",
      },
      {
        name: "Get All Categories",
        method: "GET",
        url: "/api/categories",
        parameters: [],
        description: "Retrieves a list of all categories.",
      },
      {
        name: "Get Review by ID",
        method: "GET",
        url: "/api/reviews/:review_id",
        parameters: [
          {
            name: "review_id",
            type: "string",
            required: true,
            description: "The ID of the review to retrieve.",
          },
        ],
        description: "Retrieves a review by its ID.",
      },
      {
        name: "Get All Reviews",
        method: "GET",
        url: "/api/reviews",
        parameters: [],
        description: "Retrieves a list of all reviews.",
      },
      {
        name: "Get Comments by Review ID",
        method: "GET",
        url: "/api/reviews/:review_id/comments",
        parameters: [
          {
            name: "review_id",
            type: "string",
            required: true,
            description: "The ID of the review to retrieve comments for.",
          },
        ],
        description: "Retrieves all comments for a given review.",
      },
      {
        name: "Add Comment to Review",
        method: "POST",
        url: "/api/reviews/:review_id/comments",
        parameters: [
          {
            name: "review_id",
            type: "string",
            required: true,
            description: "The ID of the review to add the comment to.",
          },
          {
            name: "comment",
            type: "string",
            required: true,
            description: "The text content of the comment.",
          },
        ],
        description: "Adds a new comment to a review.",
      },
      {
        name: "Update Review Votes",
        method: "PATCH",
        url: "/api/reviews/:review_id",
        parameters: [
          {
            name: "review_id",
            type: "string",
            required: true,
            description: "The ID of the review to update.",
          },
          {
            name: "votes",
            type: "integer",
            required: true,
            description: "The new number of votes for the review.",
          },
        ],
        description: "Updates the number of votes for a review.",
      },
      {
        name: "Delete Comment by ID",
        method: "DELETE",
        url: "/api/comments/:comment_id",
        parameters: [
          {
            name: "comment_id",
            type: "string",
            required: true,
            description: "The ID of the comment to delete.",
          },
        ],
        description: "Deletes a comment by its ID.",
      },
    ],
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
  getApi,
};
