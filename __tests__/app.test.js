const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("/api/categories", () => {
  test("Get 200: should response with an array of category objects, with propertie: slug, description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("404: response with a message not found url", () => {
  test("404: response with a message 'not found' for a non-existen url", () => {
    return request(app)
      .get("/api/categores")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: url not found");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("Get 200: should respond with an object with all properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("created_at");
      });
  });
  test("Get 200: should respond with an object with comment_count", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        expect(review).toHaveProperty("comment_count");
      });
  });
  test("Get 200: should respond with the reivew that match the id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const review = body.review;
        expect(review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        });
      });
  });
  test("Get 404: should return not found when inserting a non existing id", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('Get 400: should return "Bad request" when inserted an id that is not a number ', () => {
    return request(app)
      .get("/api/reviews/string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/reviews", () => {
  test("Get 200: should respond with an array of objects reviews with all properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeInstanceOf(Array);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("Get 200: should respond with an array of objects defaults to sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Get 200: should respond with all the reviews sorted by a title and order by desc", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("Get 200: should respond with all the reviews in specified category", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("category", "social deduction");
        });
      });
  });
  test("Get 400: should responde with bad request when sort query is invalid", () => {
    return request(app)
      .get("/api/reviews?sort_by=Invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sort query not valid");
      });
  });
  test("Get 400: should responde with bad request when order query is invalid", () => {
    return request(app)
      .get("/api/reviews?sort_by=category&order=string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("Get 404: should responde with bad request when where query is invalid", () => {
    return request(app)
      .get("/api/reviews?category=invlaidInput")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("Get 200: should responde with empty array for valid category with no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children%27s%20games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([]);
      });
  });
});

describe("Get /api/reviews/:review_id/comments", () => {
  test("Get 200: comments should be served with the most recent comments first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(3);
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            review_id: expect.any(Number, 2),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("Get 200: should respond with an array of comments for given review_id with all properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(3);
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Get 400: should return bad request when id not valid", () => {
    return request(app)
      .get("/api/reviews/not-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Get 404: should return not found review id is number but doesnt exist", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("Get 200: should return empty array when review id exist but has no comments", () => {
    request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

describe("Post /api/reviews/:review_id/comments", () => {
  test("POST 201: should post 1 new object with 2 properties", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "my posted comment",
      })
      .expect(201)
      .then(({ body }) => {
        const comment = body.createdComment[0];
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: "my posted comment",
          review_id: expect.any(Number),
          author: "mallionaire",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST 400: should not post if missing comment", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({
        username: "mallionaire",
        body: "",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("POST 400: should not post if comment is more than 400 chars", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s w.",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("POST 400: should not post if review_id is invalid", () => {
    return request(app)
      .post("/api/reviews/string/comments")
      .send({
        username: "mallionaire",
        body: "some comment",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("POST 404: should not post if review_id is non existing", () => {
    return request(app)
      .post("/api/reviews/999/comments")
      .send({
        username: "mallionaire",
        body: "some comment",
      })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("POST 400: should not post if username doesnot exist in users table", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "random user",
        body: "some comment",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("200 Patch should update review votes by passed value", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const review = body.result;
        expect(review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 6,
        });
      });
  });
  test("200 Patch should update votes by passed value if it is negative", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        const review = body.result;
        expect(review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 4,
        });
      });
  });
  test("400 Patch should not update votes if review_id is invalid", () => {
    return request(app)
      .patch("/api/reviews/string")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("404 Patch should not update votes if review_id is not existing", () => {
    return request(app)
      .patch("/api/reviews/0")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("400 Patch should not update votes if missing value input", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400 Patch should not update votes if value input in not-a-num", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "String" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("Delete api/comments/:comment_id", () => {
  test("200: DELETE should delete comment with given id ", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: DELETE should not delete comment with invalid id", () => {
    return request(app)
      .delete("/api/comments/string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: DELETE should not delete comment with if that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/0")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("api/users", () => {
  test("Get 200: should response with an array of objects, with the properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("api", () => {
  test("should have relevant properties", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("GET /api");
        expect(body).toHaveProperty("GET /api/categories");
        expect(body).toHaveProperty("GET /api/reviews");
        expect(body).toHaveProperty("GET /api");
      });
  });
});

describe("/api/users/:username", () => {
  test("Get 200: respond with a user object with its properties", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "philippaclaire9",
          name: "philippa",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("Get 404: respond with not found when username is not found", () => {
    return request(app)
      .get("/api/users/randomUsername")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("not found");
      });
  });
});

// describe.only("Patch api/comments/:comment_id", () => {
//   test("200 Patch should update comment votes by passed value", () => {
//     return request(app)
//       .patch("/api/comments/4")
//       .send({ inc_votes: 1 })
//       .expect(200)
//       .then(({ body }) => {
//         console.log(body);
//         const comment = body.result;
//         expect(comment).toBeInstanceOf(Object);
//         expect(comment).toEqual({
//           body: "EPIC board game!",
//           votes: 17,
//           author: "bainesface",
//           review_id: 2,
//           created_at: new Date(1511354163389),
//         });
//       });
//   });
// });

/*
18. PATCH /api/comments/:comment_id

Edit
Request body accepts:

an object in the form { inc_votes: newVote }

newVote will indicate how much the votes property in the database should be updated by
e.g.

{ inc_votes : 1 } would increment the current comment's vote property by 1

{ inc_votes : -1 } would decrement the current comment's vote property by 1

Responds with:

the updated comment

*/
