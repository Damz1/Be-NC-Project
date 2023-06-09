const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

const fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

const fetchReviewById = (id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [id]
    )
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return review.rows[0];
    });
};

const fetchReviews = (sort_by = "created_at", order = "desc", category) => {
  if (
    sort_by &&
    ![
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Sort query not valid" });
  }
  if (order && !["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  return db
    .query(
      `SELECT DISTINCT category
    FROM (
    SELECT category FROM reviews
    UNION
    SELECT slug AS category FROM categories
  ) AS all_categories;`
    )
    .then((result) => {
      const categories = result.rows.map((row) => {
        return row.category;
      });
      if (category && !categories.includes(category)) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      let queryParams = [];

      let queryStatement = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id`;

      if (category) {
        queryStatement += ` WHERE category = $1`;
        queryParams.push(category);
      }

      queryStatement += ` GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order}`;

      return db.query(queryStatement, queryParams).then((reviews) => {
        return reviews.rows;
      });
    });
};

const fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `SELECT comments.* FROM reviews JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 ORDER BY comments.created_at DESC;`,
      [id]
    )
    .then((comments) => {
      if (comments.rows.length) {
        return comments.rows;
      } else {
        return db
          .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
          .then((reviews) => {
            if (!reviews.rows.length) {
              return Promise.reject({ status: 404, msg: "not found" });
            }
          });
      }
    });
};

const createComment = (username, body, id) => {
  return db
    .query(`SELECT review_id FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *`,
            [body, id, username]
          )
          .then((result) => {
            if (
              !result.rows[0].body.length ||
              result.rows[0].body.length > 400
            ) {
              return Promise.reject({ status: 400, msg: "not found" });
            }
            return result.rows;
          });
      }
    });
};

const patchReviewVotes = (id, IncreaseVotesBy) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [IncreaseVotesBy, id]
    )
    .then((updatedReview) => {
      if (!updatedReview.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return updatedReview.rows[0];
    });
};

const removeComment = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      commentId,
    ])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
};

const fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((user) => {
      if (!user.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return user.rows[0];
    });
};

const patchCommentVote = (CommmentId, IncreaseVotesB) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [IncreaseVotesB, CommmentId]
    )
    .then((updatedComment) => {
      if (!updatedComment.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return updatedComment.rows[0];
    });
};

const postReview = (reviewData) => {
  const { title, owner, review_body, category, designer } = reviewData;

  if (!title || !category || !owner || !review_body) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`ALTER TABLE reviews ADD COLUMN comment_count INTEGER DEFAULT 0;`)
    .then(() => {
      return db.query(
        `INSERT INTO reviews (title, designer, owner, review_body, category, comment_count)
          VALUES ($1, $2, $3, $4, $5, 0)
          RETURNING *;`,
        [title, designer, owner, review_body, category]
      );
    })
    .then((createdComment) => {
      return createdComment.rows[0];
    });
};

module.exports = {
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
};
