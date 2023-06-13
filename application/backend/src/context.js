const { createPool } = require("mariadb")
const jwt = require("jsonwebtoken");
const { response } = require("express");

const pool = createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "abc123",
    database: "abc",
});

const ACCESS_TOKEN_SECRET = "PN#/(dh6-.E.x-'P2";

function authenticateAndAuthorize(accessToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, payload) => {
        if (error) {
          reject(error);
        } else {
          resolve(parseInt(payload.sub));
        }
      });
    });
  }

module.exports = {
    pool,
    authenticateAndAuthorize
}
