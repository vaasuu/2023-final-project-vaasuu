const {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} = require("@jest/globals");
const app = require("../app");
const { promisePool } = require("../db/pool");
const request = require("supertest");
const users = require("../models/users");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  // Remove all test users from db
  await promisePool.query(
    "DELETE FROM users WHERE email LIKE '%@test.example.com'"
  );
});

afterAll(async () => {
  // Remove all test users from db
  await promisePool.query(
    "DELETE FROM users WHERE email LIKE '%@test.example.com'"
  );
  await promisePool.end(); // close the pool at the end of the test
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

describe("GET a user", () => {
  let token; // token to use for the tests

  beforeEach(async () => {
    // get a token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "john.smith",
    });

    // use the token from the login response
    token = loginRes.body.token;
  });

  it("should return a user", async () => {
    const res = await request(app)
      .get("/api/v1/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c")
      .auth(token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toEqual({
      id: "aaaaaaaa-0615-4d04-a795-9c5756ef5f4c",
      name: "John Smith",
      email: "john.smith@example.com",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("should not let a normal user get other user details", async () => {
    const res = await request(app)
      .get("/api/v1/users/bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89")
      .auth(token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      "error",
      "You are not authorized to access this resource"
    );
  });

  it("should let an admin user get other user details", async () => {
    // get a token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .get("/api/v1/users/bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89")
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toEqual({
      id: "bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("should 404 on not existing user", async () => {
    // get a admin token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .get("/api/v1/users/not-an-existing-user-id")
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      "error",
      "User with that ID does not exist"
    );
  });

  it("should not let a user get a user without a token", async () => {
    const res = await request(app).get("/api/v1/users/1");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("should not let a user get a user with an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/users/1")
      .auth("invalid-token-here", {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should not let a user get a user with an expired token", async () => {
    const res = await request(app).get("/api/v1/users/1").auth(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjMzE2MjExLWM5ZjQtNDM3Yy04MDQyLTllNWRjMGVlMWQxZSIsImlhdCI6MCwiZXhwIjozNjAwfQ.ooD-9hioy7bLKn-V6ErMfZn1MuBlFkxoV4erebTDvI8", // expect JWT secret to be "secret"
      {
        type: "bearer",
      }
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });
});

describe("DELETE a user", () => {
  let signupRes; // response from the signup request

  beforeEach(async () => {
    // First delete the user incase it already exists
    await promisePool.query(
      "DELETE FROM users WHERE email = 'tobe.deleted@test.example.com'"
    );

    // sign up a new user that can be deleted
    signupRes = await request(app).post("/api/v1/users/signup").send({
      name: "Tobe deleted",
      email: "tobe.deleted@test.example.com",
      password: "tobe.deleted",
    });
  });

  it("should allow to delete own user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${signupRes.body.id}`)
      .auth(signupRes.body.token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});
  });

  it("should not let a normal user get other user details", async () => {
    const res = await request(app)
      .delete("/api/v1/users/bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89")
      .auth(signupRes.body.token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      "error",
      "You are not authorized to access this resource"
    );
  });

  it("should let an admin user delete other user details", async () => {
    // get a token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .delete(`/api/v1/users/${signupRes.body.id}`)
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});
  });

  it("should 404 on not existing user", async () => {
    // get a admin token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .delete("/api/v1/users/not-an-existing-user-id")
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      "error",
      "User with that ID does not exist"
    );
  });

  it("should not let a user delete a user without a token", async () => {
    const res = await request(app).delete("/api/v1/users/1");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("should not let a user delete a user with an invalid token", async () => {
    const res = await request(app)
      .delete("/api/v1/users/1")
      .auth("invalid-token-here", {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should not let a user delete a user with an expired token", async () => {
    const res = await request(app).delete("/api/v1/users/1").auth(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjMzE2MjExLWM5ZjQtNDM3Yy04MDQyLTllNWRjMGVlMWQxZSIsImlhdCI6MCwiZXhwIjozNjAwfQ.ooD-9hioy7bLKn-V6ErMfZn1MuBlFkxoV4erebTDvI8", // expect JWT secret to be "secret"
      {
        type: "bearer",
      }
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });
});

describe("Update a user", () => {
  let signupRes; // response from the signup request

  beforeEach(async () => {
    // First delete the user incase it already exists
    await promisePool.query(
      "DELETE FROM users WHERE email = 'tobe.updated@test.example.com'"
    );

    // sign up a new user that can be updated
    signupRes = await request(app).post("/api/v1/users/signup").send({
      name: "Tobe Updated",
      email: "tobe.updated@test.example.com",
      password: "tobe.updated",
    });
  });

  it("should allow to update own user", async () => {
    // get state before update
    const userBefore = await users.findById(signupRes.body.id);
    expect(userBefore[0].name).toEqual("Tobe Updated");

    const res = await request(app)
      .patch(`/api/v1/users/${signupRes.body.id}`)
      .send({
        name: "Sir Tobe Updated",
        password: "sir.tobe.updated",
      })
      .auth(signupRes.body.token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(204);

    // check that the user was updated
    const user = await users.findById(signupRes.body.id);

    expect(user[0].name).toEqual("Sir Tobe Updated");
    expect(user[0].password_hash).not.toEqual(userBefore[0].password_hash); // password hash should be different
  });

  it("should not let a normal user update other user details", async () => {
    const res = await request(app)
      .patch("/api/v1/users/bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89")
      .send({
        name: "Name changed by normal user",
      })
      .auth(signupRes.body.token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      "error",
      "You are not authorized to update this resource"
    );
  });

  it("should let an admin user update other user details", async () => {
    // get a token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .patch(`/api/v1/users/${signupRes.body.id}`)
      .send({
        name: "Name changed by admin user",
        roles: ["admin"], // promote the user to admin
      })
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});
  });

  it("should 404 on not existing user", async () => {
    // get a admin token
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "bob.johnson@example.com",
      password: "bob.johnson",
    });

    // use the token from the login response
    const adminToken = loginRes.body.token;

    const res = await request(app)
      .patch("/api/v1/users/not-an-existing-user-id")
      .send({
        name: "Name changed by admin user",
      })
      .auth(adminToken, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      "error",
      "User with that ID does not exist"
    );
  });

  it("should not let a user update a user without a token", async () => {
    const res = await request(app).patch("/api/v1/users/1");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("should not let a user update a user with an invalid token", async () => {
    const res = await request(app)
      .patch("/api/v1/users/1")
      .auth("invalid-token-here", {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should not let a user update a user with an expired token", async () => {
    const res = await request(app).patch("/api/v1/users/1").auth(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjMzE2MjExLWM5ZjQtNDM3Yy04MDQyLTllNWRjMGVlMWQxZSIsImlhdCI6MCwiZXhwIjozNjAwfQ.ooD-9hioy7bLKn-V6ErMfZn1MuBlFkxoV4erebTDvI8", // expect JWT secret to be "secret"
      {
        type: "bearer",
      }
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });
});

describe("Search for users", () => {
  // generate a auth token
  const token = jwt.sign(
    {
      id: "some-id-here",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  it("user search should return array of users", async () => {
    const res = await request(app)
      .get("/api/v1/users/search?name=Jo")
      .auth(token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(200);
    // expect to include bob and john
    expect(res.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          name: "Bob Johnson",
        }),
        expect.objectContaining({
          name: "John Smith",
        }),
      ]),
    });
  });

  it("user search should return empty array if no users found", async () => {
    const res = await request(app)
      .get("/api/v1/users/search?name=NoUser")
      .auth(token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ users: [] });
  });

  it("user search should return 400 if no query param is provided", async () => {
    const res = await request(app).get("/api/v1/users/search").auth(token, {
      type: "bearer",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: '"name" is required',
    });
  });

  it("user search should return 400 if query param is empty", async () => {
    const res = await request(app)
      .get("/api/v1/users/search?name=")
      .auth(token, {
        type: "bearer",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: '"name" is not allowed to be empty',
    });
  });

  it("should require a token to search for users", async () => {
    const res = await request(app).get("/api/v1/users/search?name=Jo");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({
      error: "Unauthorized",
    });
  });
});
