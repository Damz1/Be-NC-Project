const app = require("./app");

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("listening on port 9090");
});
