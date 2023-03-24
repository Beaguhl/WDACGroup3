const express = require('express')

const router = express.Router()
const { createPool } = require('mariadb')

const pool = createPool({
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
})

pool.on('error', function (error) {
	console.log("Error from pool", error)
})

module.exports = router

//------------ all followers ----------------
router.get('/followers', async function (request, response) {
	const userID = request.get("UserID")

	try {
		const connection = await pool.getConnection()

		const getAllFollowersQuery = `SELECT userID FROM Follow WHERE followingUserID = ${userID}`
		const followerID = await connection.query(getAllFollowersQuery)

		let followerUsers = []

		for (let i = 0; i < followerID.length; i += 1) {
			const getFollowerQuery = `SELECT * FROM Users WHERE userID = ${followerID[i].userID}`
			const fetchedFollower = await connection.query(getFollowerQuery)
			followerUsers[i] = fetchedFollower[0]
		}

		if (followerUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(followerUsers)
		}

	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//-------------------- search followers ----------------
router.get('/followers/search', async function (request, response) {
	const userID = request.get("UserID")
	const searchQuery = request.query.q

	try {
		const connection = await pool.getConnection()

		const getSearchedFollowerQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
		const searchedFollower = await connection.query(getSearchedFollowerQuery)

		let followerSearchedUsers = []

		for (let i = 0; i < searchedFollower.length; i += 1) {
			console.log("folowing id är: " + searchedFollower[i].userID)
			const getSearchedFollower = `SELECT * FROM Follow WHERE followingUserID = ${userID} AND userID = ${searchedFollower[i].userID}`
			const fetchedFollowing = await connection.query(getSearchedFollower)
			console.log(fetchedFollowing)
			if (fetchedFollowing.length != 0) {
				console.log("fetched user is: " + searchedFollower[i])
				let arrLenght = followerSearchedUsers.length
				followerSearchedUsers[arrLenght] = searchedFollower[i]

			}
		}

		console.log("detta fångade vi: " + followerSearchedUsers)
		console.log("längden är: " + followerSearchedUsers.length)
		if (followerSearchedUsers.length == 0) {
			console.log("404")
			response.status(404).end()
		} else {
			console.log("200")
			response.status(200).json(followerSearchedUsers)
		}
	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//---------------------- follow --------------------
router.post('/follow', async function (request, response) {
	const userID = request.get("UserID")
	const userToFollow = request.get("UserToFollow")

	try {
		const connection = await pool.getConnection()
		
		const followQuery = "INSERT INTO Follow (userID, followingUserID) VALUES (?, ?)";
		const followValues = [userID, userToFollow]
						
		await connection.query(followQuery, followValues)

		response.status(201).end()
	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//------------------- unfollow ---------------------
router.delete('/unfollow', async function(request, response){
	const userID = request.get("UserID")
	const userToUnfollow = request.get("UserToUnfollow")

	try {
		const connection = await pool.getConnection()

		const unfollowQuery = "DELETE FROM Follow WHERE userID = ? AND followingUserID = ?"
		const unfollowValues = [userID, userToUnfollow]

		await connection.query(unfollowQuery, unfollowValues)

		response.status(204).end()

	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//---------------- search followings ------------------------
router.get('/followings/search', async function (request, response) {
	const userID = request.get("UserID")
	const searchQuery = request.query.q

	try {
		const connection = await pool.getConnection()

		const getSearchedFollowingQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
		const searchedFollowing = await connection.query(getSearchedFollowingQuery)

		let followingSearchedUsers = []

		for (let i = 0; i < searchedFollowing.length; i += 1) {
			console.log("kraka userid is: " + userID)
			const getSearchedFollowingQuery = "SELECT * FROM Follow WHERE userID = ? AND followingUserID = ?"
			const getSearchedFollowingValues = [userID, searchedFollowing[i].userID]
			const fetchedFollowing = await connection.query(getSearchedFollowingQuery, getSearchedFollowingValues)
			if (fetchedFollowing.length != 0) {
				let arrLenght = followingSearchedUsers.length
				followingSearchedUsers[arrLenght] = searchedFollowing[i]
			}
		}

		if (followingSearchedUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(followingSearchedUsers)
		}

	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//-------------------- all followings ----------------------------
router.get('/followings', async function (request, response) {
	const userID = request.get("UserID")

	try {
		const connection = await pool.getConnection()

		const getAllFollowingQuery = `SELECT followingUserID FROM Follow WHERE userID = ${userID}`
		const followingsID = await connection.query(getAllFollowingQuery)

		let followingUsers = []

		for (let i = 0; i < followingsID.length; i += 1) {
			console.log(followingsID[i].followingUserID)
			const getUserQuery = `SELECT * FROM Users WHERE userID = ${followingsID[i].followingUserID}`
			const fetchedUser = await connection.query(getUserQuery)
			followingUsers[i] = fetchedUser[0]
		}

		if (followingUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(followingUsers)
		}

	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//-------------------- all followers ----------------------------
router.get('/followers', async function (request, response) {
	const userID = request.get("UserID")

	try {
		const connection = await pool.getConnection()

		const getAllFollowersQuery = `SELECT userID FROM Follow WHERE followingUserID = ${userID}`
		const followerID = await connection.query(getAllFollowersQuery)

		let followerUsers = []

		for (let i = 0; i < followerID.length; i += 1) {
			const getFollowerQuery = `SELECT * FROM Users WHERE userID = ${followerID[i].userID}`
			const fetchedFollower = await connection.query(getFollowerQuery)
			followerUsers[i] = fetchedFollower[0]
		}

		if (followerUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(followerUsers)
		}

	} catch {
		console.log( error)
		response.status(500).end()
	}
})