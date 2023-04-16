const { describe, it, expect, beforeEach, afterAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { generateLoginToken } = require("../utils/test_utils/token");
const { promisePool } = require("../db/pool");

describe("Listings", () => {
  afterAll(async () => {
    // Close the database connection
    await promisePool.end();
  });

  describe("Add new listing", () => {
    let token;
    beforeEach(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should add a new listing", async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .send({
          title: "Test Listing",
          description: "Test Description",
          category: "Test Category",
          price: 100,
          currency: "USD",
          location: "Test Location",
          image_urls: [
            "https://placekitten.com/500/300",
            "https://placekitten.com/550/350",
          ],
        })
        .auth(token, { type: "bearer" });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.id).toEqual(expect.any(Number));
    });

    it("should error on 404ing images", async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .send({
          title: "Test Listing",
          description: "Test Description",
          category: "Test Category",
          price: 100,
          currency: "USD",
          location: "Test Location",
          image_urls: [
            "https://httpbin.org/status/404",
            "https://placekitten.com/550/350",
          ],
        })
        .auth(token, { type: "bearer" });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty(
        "error",
        "Failed to download and encode image"
      );
    });

    it("should require login", async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .send({
          title: "Test Listing",
          description: "Test Description",
          category: "Test Category",
          price: 100,
          currency: "USD",
          location: "Test Location",
          image_urls: [
            "https://httpbin.org/status/404",
            "https://placekitten.com/550/350",
          ],
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
