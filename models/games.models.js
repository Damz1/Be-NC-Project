const db = require("../db/connection");

const fetchCategories = () => {
  return db
    .query(`SELECT * FROM categories`)
    .then((categories) => {
      return categories.rows;
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = fetchCategories;
