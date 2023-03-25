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


const app = express()

//------------ all followers ----------------
router.get('/', async function (request, response) {

	const userID = request.get("UserID")

	const connection = await pool.getConnection()

	try {

		const getAllFollowersQuery = `SELECT userID FROM Follows WHERE followingUserID = ${userID}`
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
	} catch (error) {
		response.status(500).end()
	} finally {
		if (connection) {
			connection.release()
		}
	}


})

//-------------------- search followers ----------------
router.get('/search', async function (request, response) {
	const userID = request.get("UserID")

	const searchQuery = request.query.q

	const connection = await pool.getConnection()

	try {

		const getSearchedFollowerQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
		const searchedFollower = await connection.query(getSearchedFollowerQuery)

		let followerSearchedUsers = []

		for (let i = 0; i < searchedFollower.length; i += 1) {
			const getSearchedFollower = `SELECT * FROM Follows WHERE followingUserID = ${userID} AND userID = ${searchedFollower[i].userID}`
			const fetchedFollowing = await connection.query(getSearchedFollower)
			if (fetchedFollowing.length != 0) {
				let arrLenght = followerSearchedUsers.length
				followerSearchedUsers[arrLenght] = searchedFollower[i]

			}
		}

		if (followerSearchedUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(followerSearchedUsers)
		}
	} catch (error) {

	} finally {
		if (connection) {
			connection.release()
		}
	}
})


//----------------- get all followers ----------------------
router.get('/followers', async function (request, response) {
	const userID = request.get("UserID")
	const connection = await pool.getConnection()
	try {


		const getAllFollowersQuery = `SELECT userID FROM Follows WHERE followingUserID = ${userID}`
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
		response.status(500).end()
	} finally {
		if (connection) {
			connection.release()
		}
	}


})