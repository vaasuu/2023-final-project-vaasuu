const { describe, expect, it } = require("@jest/globals");
const app = require("../app");
const request = require("supertest");

describe("GET roles", () => {
  it("should need auth", async () => {
    const res = await request(app).get("/api/v1/roles");
    expect(res.statusCode).toEqual(401);
  });

  it("should return roles", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "john.smith@example.com",
      password: "john.smith",
    });
    const token = res.body.token;

    const rolesRes = await request(app)
      .get("/api/v1/roles")
      .auth(token, { type: "bearer" });

    expect(rolesRes.statusCode).toEqual(200);
    expect(rolesRes.body).toHaveProperty(
      "roles",
      expect.arrayContaining(["normal", "admin"])
    );
  });
});
