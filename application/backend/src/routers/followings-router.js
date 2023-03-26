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

const app = express();

//---------------- search followings ------------------------
router.get("/search", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const searchQuery = request.query.q;
		//gets all users that matches search string
		const getSearchedFollowingQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`;
		const searchedFollowing = await connection.query(getSearchedFollowingQuery);

		let followingSearchedUsers = [];

		//checking if a user is a following
		for (let i = 0; i < searchedFollowing.length; i += 1) {
			const getSearchedFollowingQuery =
				"SELECT * FROM Follows WHERE userID = ? AND followingUserID = ?";
			const getSearchedFollowingValues = [userID, searchedFollowing[i].userID];
			const fetchedFollowing = await connection.query(
				getSearchedFollowingQuery,
				getSearchedFollowingValues
			);

			if (fetchedFollowing.length != 0) {
				let arrLenght = followingSearchedUsers.length;
				followingSearchedUsers[arrLenght] = searchedFollowing[i];
			}
		}

		if (followingSearchedUsers.length == 0) {
			response.status(404).end();
		} else {
			response.status(200).json(followingSearchedUsers);
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
//-------------------- all followings ----------------------------
router.get("/", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const getAllFollowingQuery = `SELECT followingUserID FROM Follows WHERE userID = ${userID}`;
		const followingsID = await connection.query(getAllFollowingQuery);

		let followingUsers = [];

		for (let i = 0; i < followingsID.length; i += 1) {
			const getUserQuery = `SELECT * FROM Users WHERE userID = ${followingsID[i].followingUserID}`;
			const fetchedUser = await connection.query(getUserQuery);
			followingUsers[i] = fetchedUser[0];
		}

		if (followingUsers.length == 0) {
			response.status(404).end();
		} else {
			response.status(200).json(followingUsers);
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

//---------------------- follow --------------------
router.post("/", async function (request, response) {
	const connection = await pool.getConnection();
	try {
		const userID = request.get("UserID");
		const userToFollow = request.body.id;
		const followQuery = "INSERT INTO Follows (userID, followingUserID) VALUES (?, ?)";
		const followValues = [userID, userToFollow];

		await connection.query(followQuery, followValues);

		response.status(201).end();
	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//------------------- unfollow ---------------------
router.delete("/", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const userToUnfollow = request.body.id;
		const unfollowQuery = "DELETE FROM Follows WHERE userID = ? AND followingUserID = ?";
		const unfollowValues = [userID, userToUnfollow];

		await connection.query(unfollowQuery, unfollowValues);

		response.status(204).end();
	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});
