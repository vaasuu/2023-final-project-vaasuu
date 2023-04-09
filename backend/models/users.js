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
            "SELECT id, password_hash, name, email, created_at, updated_at FROM users WHERE id = ?",
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

  getUsersRoles: (id) =>
    new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            `SELECT GROUP_CONCAT(r.role_name) AS roles
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.role_id
            WHERE ur.user_id = ?;`,
            id,
            (err, result) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                const roles = result[0]?.roles?.split(",") || [];
                resolve(roles);
              }
            }
          );
        }
      });
    }),
};

module.exports = users;
