const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

const fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

const fetchReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return review.rows;
    });
};

const fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

module.exports = { fetchCategories, fetchReviewById, fetchReviews };
