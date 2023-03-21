const express = require('express')

const router = express.Router()
const { createPool } = require ('mariadb')

const pool = createPool({
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
})

pool.on('error', function(error){
	console.log("Error from pool", error)
})

module.exports = router


const app = express()

//------------ all followers ----------------
router.get('/followers', async function(request, response){
	const userID = request.get("UserID")

	try {
		const connection = await pool.getConnection()

		const getAllFollowersQuery = `SELECT userID FROM Follow WHERE followingUserID = ${userID}`
		const followerID = await connection.query(getAllFollowersQuery)
		console.log("followerID are: " + followerID)

		let followerUsers = []

		for (let i = 0; i < followerID.length; i+=1){
			console.log("follower ID: " + followerID[i])
			const getFollowerQuery = `SELECT * FROM Users WHERE userID = ${followerID[i].userID}`
			const fetchedFollower = await connection.query(getFollowerQuery)
			followerUsers[i] = fetchedFollower[0]
		}

		if (followerUsers.length == 0){
			response.status(404).end()
		} else {
			response.status(200).json(followerUsers)
		}
	} catch {
		console.log("error is: " + error)
		response.status(500).end()
	}
		
	
})

//-------------------- search followers ----------------
router.get('/followers/search', async function(request, response){
	const userID = request.get("UserID")
	
	const searchQuery = request.query.q

	const connection = await pool.getConnection()

	const getSearchedFollowerQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
	const searchedFollower = await connection.query(getSearchedFollowerQuery)
	console.log("searched id är: " + searchedFollower)

	let followerSearchedUsers = []

	for (let i = 0; i < searchedFollower.length; i+=1){
		console.log("folowing id är: " + searchedFollower[i].userID)
		const getSearchedFollower = `SELECT * FROM Follow WHERE followingUserID = ${userID} AND userID = ${searchedFollower[i].userID}`
		const fetchedFollowing = await connection.query(getSearchedFollower)
		console.log(fetchedFollowing)
		if (fetchedFollowing.length != 0){
			console.log("fetched user is: " + searchedFollower[i])
			let arrLenght = followerSearchedUsers.length
			followerSearchedUsers[arrLenght] = searchedFollower[i]
		}
				
	}

	console.log("detta fångade vi: " + followerSearchedUsers)
	console.log("längden är: " + followerSearchedUsers.length)
	if (followerSearchedUsers.length == 0){
		console.log("404")
		response.status(404).end()
	} else {
		console.log("200")
		response.status(200).json(followerSearchedUsers)
	}
})

//---------------------- follow --------------------
router.post('/follow', async function(request, response){
	console.log("follow")

	// add error handling and status codes

	const userID = request.get("UserID")

	const connection = await pool.getConnection()

	const userToFollow = request.get("UserToFollow")
					
	const followQuery = "INSERT INTO Follow (userID, followingUserID) VALUES (?, ?)";
	const followValues = [userID, userToFollow]
					
	await connection.query(followQuery, followValues)
	console.log("done following")

	response.status(201).end()
			
})

//------------------- unfollow ---------------------
router.delete('/unfollow', async function(request, response){

	// add error handling and status codes
	const userID = request.get("UserID")
	const accessToken = authorizationHeaderValue.substring(7)
	
			const connection = await pool.getConnection()

			const userToUnfollow = request.get("UserToUnfollow")

			const unfollowQuery = "DELETE FROM Follow WHERE userID = ? AND followingUserID = ?"
			const unfollowValues = [userID, userToUnfollow]

			await connection.query(unfollowQuery, unfollowValues)
			console.log("deleted follow")

			response.status(204).end()

})

//---------------- search followings ------------------------
router.get('/followings/search', async function(request, response){
	console.log("inside followings search")
	const userID = request.get("UserID")

	const searchQuery = request.query.q

	const connection = await pool.getConnection()

	//gets all users that matches search string
	const getSearchedFollowingQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
	const searchedFollowing = await connection.query(getSearchedFollowingQuery)

	let followingSearchedUsers = []

	//checking if a user is a following
	for (let i = 0; i < searchedFollowing.length; i+=1){
		const getSearchedFollowing = `SELECT * FROM Follow WHERE userID = ${userID} AND followingUserID = ${searchedFollowing[i].userID}`
		const fetchedFollowing = await connection.query(getSearchedFollowing)
		if (fetchedFollowing.length != 0){
			let arrLenght = followingSearchedUsers.length
			followingSearchedUsers[arrLenght] = searchedFollowing[i]
		}
	}

	console.log(followingSearchedUsers)
	if (followingSearchedUsers.length == 0){
		response.status(404).end()
	} else {
		response.status(200).json(followingSearchedUsers)
	}

})
console.log("following")
//-------------------- all followings ----------------------------
router.get('/followings', async function(request, response){
	console.log("inside following")
	const userID = request.get("UserID")

		const connection = await pool.getConnection()

		const getAllFollowingQuery = `SELECT followingUserID FROM Follow WHERE userID = ${userID}`
		const followingsID = await connection.query(getAllFollowingQuery)

		let followingUsers = []

		for (let i = 0; i < followingsID.length; i+=1){
			console.log(followingsID[i].followingUserID)
			const getUserQuery = `SELECT * FROM Users WHERE userID = ${followingsID[i].followingUserID}`
			const fetchedUser = await connection.query(getUserQuery)
			followingUsers[i] = fetchedUser[0]
		}

		if (followingUsers.length == 0){
			response.status(404).end()
		} else {
			response.status(200).json(followingUsers)
		}


})
router.get('/followers', async function(request, response){
	const userID = request.get("UserID")

	try {
		const connection = await pool.getConnection()

		const getAllFollowersQuery = `SELECT userID FROM Follow WHERE followingUserID = ${userID}`
		const followerID = await connection.query(getAllFollowersQuery)
		console.log("followerID are: " + followerID)

		let followerUsers = []

		for (let i = 0; i < followerID.length; i+=1){
			console.log("follower ID: " + followerID[i])
			const getFollowerQuery = `SELECT * FROM Users WHERE userID = ${followerID[i].userID}`
			const fetchedFollower = await connection.query(getFollowerQuery)
			followerUsers[i] = fetchedFollower[0]
		}

		if (followerUsers.length == 0){
			response.status(404).end()
		} else {
			response.status(200).json(followerUsers)
		}
	} catch {
		console.log("error is: " + error)
		response.status(500).end()
	}
		
	
})