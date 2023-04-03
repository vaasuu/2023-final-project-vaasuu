const db = require("../db/pool");

const users = {
  create: (user) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query("INSERT INTO users SET ?", user, (err, result) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    }),

  findById: (id) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "SELECT * FROM users WHERE id = ?",
            id,
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    }),

  findByEmail: (email) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "SELECT * FROM users WHERE email = ?",
            email,
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    }),

  update: (id, user) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "UPDATE users SET ? WHERE id = ?",
            [user, id],
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    }),

  delete: (id) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "DELETE FROM users WHERE id = ?",
            id,
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    }),

  getAll: () =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "SELECT id, name, created_at FROM users",
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    }),
};

module.exports = users;
