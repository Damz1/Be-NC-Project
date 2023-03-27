exports.handle400Errors = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "400: BAD REQUEST" });
  } else {
    next(err);
  }
};

exports.handleOtherErrors = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
