const express = require("express");
const { pool, authenticateAndAuthorize } = require("../context")
const router = express.Router();
const { validateUser } = require("../user-validations");

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



//----------------- all users ----------------
router.get("/", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
            .then(async userID => {
                const getAllUsersQuery = "SELECT * FROM Users WHERE userID != ?";
				const getAllUsersValues = [userID];
				const users = await connection.query(getAllUsersQuery, getAllUsersValues);
				response.status(200).json(users);
            })
            .catch(error => {
                console.error(error)
                response.send(401).end()
            });

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//------------------- create user ----------------
router.post("/", async function (request, response) {
	let connection

	try {
		connection = await pool.getConnection()

		const user = request.body;
		const validationArr = await validateUser(user)

		if (validationArr.length > 0) {
			response.status(400).json(validationArr);
			return;
		} else {
			
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
		}

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//------------------- search users ----------------
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
