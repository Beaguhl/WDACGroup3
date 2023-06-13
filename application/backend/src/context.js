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

const authenticateAndAuthorizeAdmin = (request, response, connection) => {
    const accessToken = request.headers.authorization

    try {
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            response.status(401).json({ error: 'Unauthorized' })
            return false;
        }

        if (!decodedToken.isAdmin) {
            response.status(403).json({ error: 'Forbidden' })
            return false;
        }

        return true;
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' })
        return false
    } finally {
        if (connection) {
            connection.release()
        }
    }
}

const authenticateAndAuthorize = (request, response, connection, userID) => {
    const accessToken = request.headers.authorization

    try {
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            response.status(401).json({ error: 'Unauthorized' })
            return false;
        }

        if (decodedToken.userID !== userID && !decodedToken.isAdmin) {
            response.status(403).json({ error: 'Forbidden' })
            return false
        }

        return true;
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' })
        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    pool,
    authenticateAndAuthorize,
    authenticateAndAuthorizeAdmin
}
