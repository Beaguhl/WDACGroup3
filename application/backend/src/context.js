const { createPool } = require("mariadb")

const pool = createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "abc123",
    database: "abc",
});

module.exports = pool