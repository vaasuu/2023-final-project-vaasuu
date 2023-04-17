const { pool } = require("../db/pool");

const roles = {
  getAll: async () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            "SELECT JSON_OBJECTAGG(role_name, role_id) AS roles FROM roles",
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
  setRole: async (userId, roleName) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            `
              INSERT INTO user_roles (user_id, role_id)
              VALUES (
                  ?,
                  (
                    SELECT role_id
                    FROM roles
                    WHERE role_name = ?
                  )
                ) ON DUPLICATE KEY
              UPDATE role_id = (
                  SELECT role_id
                  FROM roles
                  WHERE role_name = ?
                )`,
            [userId, roleName, roleName],
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

module.exports = roles;
