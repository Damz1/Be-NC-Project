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
        const review = body.review[0];
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
  test("Get 200: should respond with the reivew that match the id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const review = body.review;
        expect(review[0]).toMatchObject({
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
  test("Get 200: should respond with an array of objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
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
      .get("/api/reviews/1/comments")
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
      .post("/api/reviews/1/comments")
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
