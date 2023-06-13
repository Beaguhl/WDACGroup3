const express = require("express");
const router = express.Router();
const { pool, authenticateAndAuthorize } = require("../context.js");

pool.on("error", function (error) {
	console.log("Error from pool", error);
});

module.exports = router;

const app = express();

//------------ all followers ----------------
router.get("/", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const getFollowerUsersQuery = `SELECT Users.* FROM Users JOIN Follows ON Users.userID = Follows.userID WHERE Follows.followingUserID = ?`;
		const followerUsers = await connection.query(getFollowerUsersQuery, [userID]);

		if (followerUsers.length == 0) {
			response.status(404).end();
		} else {
			response.status(200).json(followerUsers);
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

//-------------------- search followers ----------------
router.get("/search", async function (request, response) {
	const userID = request.get("UserID");
	const searchQuery = request.query.q;
	const connection = await pool.getConnection();

	try {
		const getSearchedFollowerQuery = 'SELECT * FROM Users WHERE username LIKE CONCAT("%", ?, "%")';
		const searchedFollower = await connection.query(getSearchedFollowerQuery, [searchQuery]);

		let followerSearchedUsers = [];

		for (let i = 0; i < searchedFollower.length; i += 1) {
			const getSearchedFollower = `SELECT * FROM Follows WHERE followingUserID = ? AND userID = ?`;
			const fetchedFollowing = await connection.query(getSearchedFollower, [userID, searchedFollower[i].userID]);

			if (fetchedFollowing.length != 0) {
				let arrLenght = followerSearchedUsers.length;
				followerSearchedUsers[arrLenght] = searchedFollower[i];
			}
		}

		if (followerSearchedUsers.length == 0) {
			response.status(404).end();
		} else {
			response.status(200).json(followerSearchedUsers);
		}
	} catch (error) {
		console.log(error);
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------- get all followers ----------------------
router.get("/followers", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const getAllFollowersQuery = `SELECT userID FROM Follows WHERE followingUserID = ?`;
		const followers = await connection.query(getAllFollowersQuery, [userID]);

		let followerUsers = [];

		for (let i = 0; i < followers.length; i += 1) {
			const getFollowerQuery = `SELECT * FROM Users WHERE userID = ?`;
			const fetchedFollower = await connection.query(getFollowerQuery, [followers[i].userID]);
			followerUsers[i] = fetchedFollower[0];
		}

		if (followerUsers.length != 0) {
			response.status(200).json(followerUsers);
		}
	} catch {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});
