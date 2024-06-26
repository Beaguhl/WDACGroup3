const express = require("express");

const router = express.Router();
const { createPool } = require("mariadb");

const pool = createPool({
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
});

pool.on("error", function (error) {
	console.log("Error from pool", error);
});

module.exports = router;

const bcrypt = require("bcrypt");

function hashPassword(password) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (error, salt) => {
			if (error) {
				reject(error);
			}

			bcrypt.hash(password, salt, (error, hashedPassword) => {
				if (error) {
					reject(error);
				} else {
					resolve(hashedPassword);
				}
			});
		});
	});
}

const { validateUser } = require("../user-validations");

const app = express();

//----------- all users ----------------
router.get("/", async function (request, response) {
	const userID = request.get("UserID");

	const connection = await pool.getConnection();

	try {
		const getAllUsersQuery = "SELECT * FROM Users WHERE userID != ?";
		const getAllUsersValues = [userID];
		const users = await connection.query(getAllUsersQuery, getAllUsersValues);
		response.status(200).json(users);
	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

router.post("/", async function (request, response) {
	const user = request.body;

	const validationArr = await validateUser(user);

	const connection = await pool.getConnection();

	if (validationArr.length > 0) {
		response.status(400).json(validationArr);
		return;
	} else {
		try {
			const createUserQuery =
				"INSERT INTO Users (username, password, admin) VALUES (?, ?, ?)";
			const hashedPassword = await hashPassword(user.password);
			const createUserValues = [user.username, hashedPassword, false];

			await connection.query(createUserQuery, createUserValues);

			const getUserIDQUery = "SELECT userID FROM Users WHERE username = ?";
			const getUserIDValues = [user.username];

			const fetchedUserID = await connection.query(getUserIDQUery, getUserIDValues);
			const userID = fetchedUserID[0].userID;

			const createWishListQuery = "INSERT INTO WishLists (userID) VALUES (?)";
			const createWishListValue = [userID];

			await connection.query(createWishListQuery, createWishListValue);

			response.status(201).end();
		} catch (error) {
			console.log(error);
			response.status(500).end();
		} finally {
			if (connection) {
				connection.release();
			}
		}
	}
});

//----------- search users ----------------
router.get("/search", async function (request, response) {
	const userID = request.get("UserID");

	const connection = await pool.getConnection();

	try {
		const searchQuery = request.query.q;

		const getSearchedUsersQuery = `SELECT * FROM Users WHERE userID != ${userID} AND username LIKE '%${searchQuery}%'`;
		const searchedUsers = await connection.query(getSearchedUsersQuery);

		if (searchedUsers.length == 0) {
			response.status(404).end();
		} else {
			response.status(200).json(searchedUsers);
		}
	} catch (error) {
		console.log(error);
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//---------------------- users/id -------------------------
router.get("/:id", async function (request, response) {
	const userID = request.get("UserID");

	const connection = await pool.getConnection();

	try {
		const otherUsersID = parseInt(request.params.id);

		if (userID == otherUsersID) {
			response.status(403).end();
		}

		const userQuery = "SELECT userID, username FROM Users WHERE userID = ?";
		const userValues = [otherUsersID];
		const user = await connection.query(userQuery, userValues);
		const userToSend = user[0];

		const followQuery = "SELECT * FROM Follows WHERE userID = ? AND followingUserID = ?";
		const followValues = [userID, otherUsersID];

		const follow = await connection.query(followQuery, followValues);
		var followToSend = follow[0];

		if (!followToSend) {
			followToSend = null;
		}

		const model = {
			userToSend,
			followToSend,
		};

		response.status(200).json(model);
	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});
