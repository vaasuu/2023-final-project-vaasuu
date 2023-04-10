const { describe, expect, it, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const db = require("../db/pool");
const request = require("supertest");

beforeAll(async () => {
  // Remove all test users from db
  db.query("DELETE FROM users WHERE email LIKE '%@test.example.com'");
});

afterAll(async () => {
  // Remove all test users from db
  db.query("DELETE FROM users WHERE email LIKE '%@test.example.com'");
});

describe("POST signup", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "Success User",
      email: "success.user@test.example.com",
      password: "success.user",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("roles");
  });

  it("should not let a user sign up with an existing email", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      // user already exists in db sample data
      name: "John Smith",
      email: "john.smith@example.com",
      password: "john.smith",
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty(
      "error",
      "User with that email already exists"
    );
  });

  it("should not let a user sign up with a missing email", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "John Doe",
      password: "john.doe",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"email" is required');
  });

  it("should not let a user sign up with a malformed email", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "John Doe",
      email: "john.doeexample.com",
      password: "john.doe",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"email" must be a valid email');
  });

  it("should not let a user sign up with a missing password", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "John Doe",
      email: "john.doe@test.example.com",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"password" is required');
  });

  it("should not let a user sign up with an empty password", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "John Doe",
      email: "john.doe@test.example.com",
      password: "",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" is not allowed to be empty'
    );
  });

  it("should not let a user sign up with a too short password", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "John Doe",
      email: "john.doe@test.example.com",
      password: "pass",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" length must be at least 8 characters long'
    );
  });

  it("should not let a user sign up with a too long password", async () => {
    const res = await request(app)
      .post("/api/v1/users/signup")
      .send({
        name: "John Doe",
        email: "john.doe@test.example.com",
        password: "a".repeat(73), // 72 max
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" length must be less than or equal to 72 characters long'
    );
  });

  it("should not let a user sign up with a missing name", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      email: "john.doe@test.example.com",
      password: "john.doe",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"name" is required');
  });

  it("should not let a user sign up with an empty name", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      name: "",
      email: "john.doe@test.example.com",
      password: "john.doe",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"name" is not allowed to be empty'
    );
  });

  it("should not let a user sign up with a too long name", async () => {
    const res = await request(app)
      .post("/api/v1/users/signup")
      .send({
        name: "a".repeat(256), // 255 max length in db
        email: "john.doe@test.example.com",
        password: "john.doe",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"name" length must be less than or equal to 255 characters long'
    );
  });
});

describe("POST login", () => {
  it("should login a user", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "john.smith",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("roles");
  });

  it("should not let user post extra fields", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "wrong.password",
      extra: "field",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"extra" is not allowed');
  });

  it("should not let a user login with a missing email and password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({});
    expect(res.statusCode).toEqual(400);

    expect(res.body).toHaveProperty("error", '"email" is required');
  });

  it("should not let a user login with a wrong password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "wrong.password",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should not let a user login with a wrong email", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "non.existing@example.com",
      password: "wrong.password",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should not let a user login with a missing email", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      password: "john.smith",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"email" is required');
  });

  it("should not let a user login with a malformed email", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smithexample.com",
      password: "john.smith",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"email" must be a valid email');
  });

  it("should not let a user login with a missing password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", '"password" is required');
  });

  it("should not let a user login with an empty password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" is not allowed to be empty'
    );
  });

  it("should not let a user login with a too short password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "pass",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" length must be at least 8 characters long'
    );
  });

  it("should not let a user login with a too long password", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: "john.smith@example.com",
        password: "a".repeat(73), // 72 max
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      '"password" length must be less than or equal to 72 characters long'
    );
  });
});

describe("GET all users", () => {
  it("should return all users", async () => {
    // get a token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "john.smith",
    });

    // use the token from the login response
    const token = loginRes.body.token;

    const res = await request(app).get("/api/v1/users").auth(token, {
      type: "bearer",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body.users.length).toBeGreaterThan(2);
    expect(res.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String),
        }),
      ]),
    });
  });

  it("should not let a user get all users without a token", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("should not let a user get all users with an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .auth("invalid-token-here", {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should not let a user get all users with an expired token", async () => {
    const res = await request(app).get("/api/v1/users").auth(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjMzE2MjExLWM5ZjQtNDM3Yy04MDQyLTllNWRjMGVlMWQxZSIsImlhdCI6MCwiZXhwIjozNjAwfQ.ooD-9hioy7bLKn-V6ErMfZn1MuBlFkxoV4erebTDvI8", // expect JWT secret to be "secret"
      {
        type: "bearer",
      }
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });
});
