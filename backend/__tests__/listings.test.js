const {
  describe,
  it,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { generateLoginToken } = require("../utils/test_utils/token");
const { promisePool } = require("../db/pool");
const listings = require("../models/listings");

describe("Listings", () => {
  afterAll(async () => {
    // Close the database connection
    await promisePool.end();
  });

  describe("Add new listing", () => {
    let token;
    beforeAll(() => {
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
          image_urls: ["https://httpbin.org/status/404"],
        })
        .auth(token, { type: "bearer" });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty(
        "error",
        "Failed to download and encode image"
      );
    }, 10000);

    it("should work with empty image_urls array", async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .send({
          title: "Test Listing",
          description: "Test Description",
          category: "Test Category",
          price: 100,
          currency: "USD",
          location: "Test Location",
          image_urls: [],
        })
        .auth(token, { type: "bearer" });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.id).toEqual(expect.any(Number));
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

  describe("Get all listings", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should get all listings", async () => {
      const res = await request(app)
        .get("/api/v1/listings")
        .auth(token, { type: "bearer" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listings");
      expect(res.body.listings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            listing_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            asking_price: expect.any(String),
            currency: expect.any(String),
            owner: expect.any(String),
            owner_name: expect.any(String),
            category: expect.any(String),
            location: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            picture_url: expect.any(String),
            blurhash: expect.any(String),
          }),
        ])
      );
    });

    it("should require login", async () => {
      const res = await request(app).get("/api/v1/listings");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });

  describe("Get listing by ID", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should get a listing by ID", async () => {
      const res = await request(app).get("/api/v1/listings/1").auth(token, {
        type: "bearer",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listing");
      expect(res.body.listing).toEqual(
        expect.objectContaining({
          listing_id: 1,
          title: "MacBook Pro",
          description:
            '2019 MacBook Pro with 13" Retina display, 2.4GHz quad-core Intel Core i5, 8GB RAM, and 256GB SSD storage.',
          asking_price: "1500.00",
          currency: "USD",
          owner: "aaaaaaaa-0615-4d04-a795-9c5756ef5f4c",
          owner_name: "John Smith",
          category: "electronics",
          location: "San Francisco, CA",
          created_at: "2023-04-02T08:00:00.000Z",
          updated_at: "2023-04-15T11:24:52.000Z",
          image_data: [
            {
              id: 1,
              url: "https://placehold.co/400x300?text=MacBook+Pro+picture+1",
              blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
            },
          ],
        })
      );
    });

    it("should get a listing by ID (no images)", async () => {
      const res = await request(app).get("/api/v1/listings/3").auth(token, {
        type: "bearer",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listing");
      expect(res.body.listing).toEqual(
        expect.objectContaining({
          listing_id: 3,
          title: "Peloton Bike",
          description:
            "Peloton Bike in great condition, comes with weights and shoes.",
          asking_price: "2000.00",
          currency: "EUR",
          owner: "cccccccc-681d-4475-84a2-fdd1d0dcd057",
          owner_name: "Bob Johnson",
          location: "Paris, France",
          created_at: "2023-04-02T10:00:00.000Z",
          updated_at: "2023-04-15T11:25:07.000Z",
          image_data: [],
        })
      );
    });

    it("should require login", async () => {
      const res = await request(app).get("/api/v1/listings");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    it("should 404 on non-existent listing", async () => {
      const res = await request(app).get("/api/v1/listings/-1").auth(token, {
        type: "bearer",
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Listing not found");
    });
  });

  describe("Get listings by user", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should get listings by user", async () => {
      const res = await request(app)
        .get("/api/v1/listings/user/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c")
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listings");
      expect(res.body.listings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            listing_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            asking_price: expect.any(String),
            currency: expect.any(String),
            owner: expect.any(String),
            owner_name: expect.any(String),
            location: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            picture_url: expect.any(String),
            blurhash: expect.any(String),
          }),
        ])
      );
    });

    it("should require login", async () => {
      const res = await request(app).get(
        "/api/v1/listings/user/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c"
      );

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    it("should 404 on non-existent user", async () => {
      const res = await request(app)
        .get("/api/v1/listings/user/user-does-not-exist")
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });
  });

  describe("Get categories", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should get categories", async () => {
      const res = await request(app)
        .get("/api/v1/listings/categories")
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("categories");
      expect(res.body.categories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("Delete listing", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    let listingId;
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .auth(token, {
          type: "bearer",
        })
        .send({
          title: "Test listing",
          description: "Test description",
          price: "100.00",
          currency: "USD",
          location: "San Francisco, CA",
          category: "electronics",
          image_urls: [],
        });

      listingId = res.body.id;
    });

    it("should delete listing", async () => {
      expect(listingId).toBeDefined();

      const res = await request(app)
        .delete(`/api/v1/listings/${listingId}`)
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Listing deleted");
    });

    it("should require login", async () => {
      const res = await request(app).delete(`/api/v1/listings/${listingId}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    it("should 404 on non-existent listing", async () => {
      const res = await request(app).delete("/api/v1/listings/-1").auth(token, {
        type: "bearer",
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Listing not found");
    });

    it("should 403 on unauthorized listing", async () => {
      token = generateLoginToken("bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89"); // login as a different user
      const res = await request(app)
        .delete(`/api/v1/listings/${listingId}`) // Listing owned by a different user (aaaaaaaa-0615-4d04-a795-9c5756ef5f4c)
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty("error", "Forbidden");
    });

    it("should work with admin", async () => {
      const adminToken = generateLoginToken(
        "cccccccc-681d-4475-84a2-fdd1d0dcd057"
      ); // Admin user
      const res = await request(app)
        .delete(`/api/v1/listings/${listingId}`)
        .auth(adminToken, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Listing deleted");
    });
  });

  describe("Update listing", () => {
    let token;
    beforeAll(() => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    let listingId;
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/listings")
        .auth(token, {
          type: "bearer",
        })
        .send({
          title: "Blender",
          description: "Old blender that still works. Barely used.",
          price: "99.99",
          currency: "USD",
          location: "San Francisco, CA",
          category: "electronics",
          image_urls: [],
        });

      listingId = res.body.id;
    });

    it("should update listing", async () => {
      expect(listingId).toBeDefined();

      const res = await request(app)
        .put(`/api/v1/listings/${listingId}`)
        .auth(token, {
          type: "bearer",
        })
        .send({
          title: "Amazing blender",
          description:
            "Old blender that still works. Barely used. Comes with instructions and original box!",
          price: "85.00",
          currency: "CAD",
          location: "Ottawa, ON, Canada",
          category: "Kitchen Appliances",
          image_urls: ["https://placehold.co/200x300/jpg?text=Amazing+blender"],
        });

      expect(res.statusCode).toEqual(201);

      const [listing] = await listings.getById(listingId);
      expect(listing).toHaveProperty("listing_id", listingId);
      expect(listing).toHaveProperty("title", "Amazing blender");
      expect(listing).toHaveProperty(
        "description",
        "Old blender that still works. Barely used. Comes with instructions and original box!"
      );
      expect(listing).toHaveProperty("asking_price", "85.00");
      expect(listing).toHaveProperty("currency", "CAD");
      expect(listing).toHaveProperty("location", "Ottawa, ON, Canada");
      expect(listing).toHaveProperty("category", "Kitchen Appliances");
    });

    it("should require login", async () => {
      const res = await request(app).put(`/api/v1/listings/${listingId}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    it("should 404 on non-existent listing", async () => {
      const res = await request(app)
        .put("/api/v1/listings/-1")
        .auth(token, {
          type: "bearer",
        })
        .send({
          title: "Blender",
          description: "Old blender that still works. Barely used.",
          price: "99.99",
          currency: "USD",
          location: "San Francisco, CA",
          category: "electronics",
          image_urls: [],
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Listing not found");
    });

    it("should 403 on unauthorized listing", async () => {
      token = generateLoginToken("bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89"); // login as a different user

      const res = await request(app)
        .put(`/api/v1/listings/${listingId}`)
        .auth(token, {
          type: "bearer",
        })
        .send({
          title: "Blender",
          description: "Old blender that still works. Barely used.",
          price: "99.99",
          currency: "USD",
          location: "San Francisco, CA",
          category: "electronics",
          image_urls: [],
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty("error", "Forbidden");
    });

    it("should work with admin", async () => {
      const adminToken = generateLoginToken(
        "cccccccc-681d-4475-84a2-fdd1d0dcd057"
      ); // Admin user

      const res = await request(app)
        .put(`/api/v1/listings/${listingId}`)
        .auth(adminToken, {
          type: "bearer",
        })

        .send({
          title: "Blender",
          description: "Old blender that still works. Barely used.",
          price: "99.99",
          currency: "USD",
          location: "San Francisco, CA",
          category: "electronics",
          image_urls: [],
        });

      expect(res.statusCode).toEqual(201);
    });
  });

  describe("Search listings", () => {
    let token;
    beforeAll(async () => {
      token = generateLoginToken("aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    });

    it("should return relevant listings (category search)", async () => {
      const res = await request(app)
        .get("/api/v1/listings/search?query=electronics")
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listings");
      expect(res.body.listings.length).toBeGreaterThan(1);
    });

    it("should return listings (listing title + description)", async () => {
      const res = await request(app)
        .get("/api/v1/listings/search?query=macbook+intel+ssd")
        .auth(token, {
          type: "bearer",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("listings");
      expect(res.body.listings).toMatchObject([
        {
          title: "MacBook Pro",
        },
      ]);
    });
  });
});
