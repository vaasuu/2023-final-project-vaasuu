const { describe, it, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");

describe("backend", () => {
  it("health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
  });
});
