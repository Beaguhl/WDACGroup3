const express = require("express");
const router = express.Router();
const { createPool } = require("mariadb");
const jwt = require ('jsonwebtoken')

const pool = createPool({ //ska bort
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
});

const ACCESS_TOKEN_SECRET = "PN#/(dh6-.E.x-'P2"; //ska bort

pool.on("error", function (error) {
	console.log("Error from pool", error);
});

module.exports = router;
//const { ACCESS_TOKEN_SECRET } = require('../app');

const app = express();

//---------------- search followings ------------------------
router.get("/search", async function (request, response) {
	const userID = request.get("UserID");
	const connection = await pool.getConnection();

	try {
		const searchQuery = request.query.q;
		//gets all users that matches search string
		const getSearchedFollowingQuery = `SELECT * FROM Users WHERE username LIKE CONCAT("%", ?, "%")`;
		const searchedFollowing = await connection.query(getSearchedFollowingQuery, [searchQuery]);

		let followingSearchedUsers = [];

		//checking if a user is a following
		for (let i = 0; i < searchedFollowing.length; i += 1) {
			const getSearchedFollowingQuery = "SELECT * FROM Follows WHERE userID = ? AND followingUserID = ?";
			const getSearchedFollowingValues = [userID, searchedFollowing[i].userID];
			const fetchedFollowing = await connection.query(getSearchedFollowingQuery, getSearchedFollowingValues);

			if (fetchedFollowing.length != 0) {
				let arrLength = followingSearchedUsers.length;
				followingSearchedUsers[arrLength] = searchedFollowing[i];
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
		const getAllFollowingQuery = `SELECT followingUserID FROM Follows WHERE userID = ?`;
		const followingsID = await connection.query(getAllFollowingQuery, [userID]);

		let followingUsers = [];

		for (let i = 0; i < followingsID.length; i += 1) {
			const getUserQuery = `SELECT * FROM Users WHERE userID = ?`;
			const fetchedUser = await connection.query(getUserQuery, [followingsID[i].followingUserID]);
			followingUsers[i] = fetchedUser[0];
		}

		if (followingUsers.length != 0) {
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
	const connection = await pool.getConnection();
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	console.log("accestoken är: ", ACCESS_TOKEN_SECRET)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if (error){
			response.send(401).end()
		} else {
			try {
				const userToUnfollow = request.body.id;
				const unfollowQuery = "DELETE FROM Follows WHERE userID = ? AND followingUserID = ?";
				const userID = parseInt(payload.sub)
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

		}
	})

	
});

/*app.post('/unfollow', function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if (error){
			response.send(401).end()
		} else {
			const connection = await pool.getConnection()

			const userToUnfollow = request.get("UserToUnfollow")
			const userID = parseInt(payload.sub)

			const unfollowQuery = "DELETE FROM Follow WHERE userID = ? AND followingUserID = ?"
			const unfollowValues = [userID, userToUnfollow]

			await connection.query(unfollowQuery, unfollowValues)


		}
	})
})*/
