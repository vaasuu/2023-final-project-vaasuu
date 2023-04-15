const {
  describe,
  expect,
  beforeEach,
  afterEach,
  it,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const MailDev = require("maildev");
const app = require("../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

const waitMailDevShutdown = (maildev) => {
  return new Promise((resolve) => {
    maildev.close(() => resolve());
  });
};

describe("Password reset", () => {
  afterAll(() => {
    const { pool } = require("../db/pool");
    pool.end();
  });

  describe("password reset email", () => {
    let maildev;

    beforeEach((done) => {
      maildev = new MailDev({
        smtp: process.env.EMAIL_SMTP_PORT, // use the same port as the SMTP server
        silent: true,
        disableWeb: true, // no need to run web interface
      });

      maildev.listen(done);
    });

    afterEach(async () => {
      await waitMailDevShutdown(maildev);
      return new Promise((resolve) => {
        maildev.removeAllListeners();
        resolve();
      });
    });

    it("should send an email for existing users", async () => {
      const res = await request(app)
        .post("/api/v1/password-reset/send-reset-email")
        .send({
          email: "jane.doe@example.com",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Reset password email sent");

      return new Promise((resolve, reject) => {
        maildev.on("new", (email) => {
          try {
            expect(email.subject).toEqual("Password Reset");
            expect(email.to[0].address).toEqual("jane.doe@example.com"); // check receiver email address
            expect(email.text).toMatch(/\/reset-password#ey/); // check for token link in email
          } catch (error) {
            reject(error);
          }
          resolve();
        });
      });
    });

    it("should not send an email if the user does not exist", async () => {
      const res = await request(app)
        .post("/api/v1/password-reset/send-reset-email")
        .send({
          email: "does.not.exist@test.example.com",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty(
        "error",
        "User with that email does not exist"
      );

      return new Promise((resolve, reject) => {
        // wait for 1 second to see if an email is sent
        setTimeout(() => {
          resolve();
        }, 1000);

        maildev.on("new", (email) => {
          try {
            expect(email.subject).not.toEqual("Password Reset");
            expect(email.to[0].address).not.toEqual("jane.doe@example.com"); // check receiver email address
            expect(email.text).not.toMatch(/\/reset-password#ey/); // check for token link in email
          } catch (error) {
            reject(error);
          }
          resolve();
        });
      });
    });

    describe("POST set-new-password", () => {
      let user;
      let token;

      beforeAll(async () => {
        user = {
          id: "bbbbbbbb-f9e0-4047-99a5-6f0ed153ba89", // Jane Doe
        };

        token = jwt.sign(
          { id: user.id },
          process.env.JWT_PASSWORD_RESET_SECRET,
          { expiresIn: "30m" } // token expires in 30 minutes
        );
      });

      it("should let you set a new password with a valid password reset token", async () => {
        const passwordHashBefore = await users
          .findById(user.id)
          .then((users) => users[0].password_hash);

        const res = await request(app)
          .post("/api/v1/password-reset/set-new-password")
          .send({
            token: token,
            password: "jane.doe", // new password (same as old password for testing)
          });

        expect(res.statusCode).toEqual(204);
        expect(res.body).toEqual({});

        const passwordHashAfter = await users
          .findById(user.id)
          .then((users) => users[0].password_hash);

        expect(passwordHashBefore).not.toEqual(passwordHashAfter);
      });

      it("should not let you set a new password with an invalid password reset token", async () => {
        const res = await request(app)
          .post("/api/v1/password-reset/set-new-password")
          .send({
            token: "invalid-token",
            password: "jane.doe", // new password (same as old password for testing)
          });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("error", "Unauthorized");
      });

      it("should not let you set a new password with an expired password reset token", async () => {
        const res = await request(app)
          .post("/api/v1/password-reset/set-new-password")
          .send({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiYmJiYmJiLWY5ZTAtNDA0Ny05OWE1LTZmMGVkMTUzYmE4OSIsImlhdCI6MTY4MTMyOTU5MiwiZXhwIjoxNjgxMzMxMzkyfQ.AmYqIHxjChUcZY2eSSgrqjW8U88D2fMP2MkVH6csoyQ", // expired token
            password: "jane.doe", // new password (same as old password for testing)
          });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("error", "Token expired");
      });

      it("should not let you set a new password with an empty password", async () => {
        const res = await request(app)
          .post("/api/v1/password-reset/set-new-password")
          .send({
            token: token,
            password: "",
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty(
          "error",
          '"password" is not allowed to be empty'
        );
      });

      it("should not let you set a new password with a password that is too short", async () => {
        const res = await request(app)
          .post("/api/v1/password-reset/set-new-password")
          .send({
            token: token,
            password: "short", // minimum password length is 8 characters
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty(
          "error",
          '"password" length must be at least 8 characters long'
        );
      });
    });
  });
});
