const { pool } = require("../db/pool");

const roles = {
  getAll: async () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query("SELECT role_name FROM roles", (err, result) => {
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
};

module.exports = roles;
