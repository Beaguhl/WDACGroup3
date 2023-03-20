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

//----------- all users ----------------
router.get("/", async function(request, response){	

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")

	try{
		const connection = await pool.getConnection()
		
		const getAllUsersQuery = "SELECT * FROM Users WHERE userID != ?"
		const getAllUsersValues = [userID]
		const users = await connection.query(getAllUsersQuery, getAllUsersValues)

		response.status(200).json(users)
		
	} catch(error) {
		console.log(error)
		response.status(500).end()
	}
})

//----------- search users ----------------
router.get('/search', async function(request, response){
	const userID = request.get("UserID")

	try {
        const searchQuery = request.query.q

        const connection = await pool.getConnection()

        const getSearchedUsersQuery = `SELECT * FROM Users WHERE userID != ${userID} AND username LIKE '%${searchQuery}%'`
        const searchedUsers = await connection.query(getSearchedUsersQuery)

        if (searchedUsers.length == 0){
            response.status(404).end()
        } else {
            response.status(200).json(searchedUsers)
        }				

    } catch {
        // add catch
    }
		
})

//---------------------- users/id -------------------------
router.get("/:id", async function(request, response){

	const userID = request.get("UserID")

	try {
		const otherUsersID = parseInt(request.params.id)

		if (userID == otherUsersID){
			console.log("403 error - user tried to view them self")
			response.status(403).end()
		}
		
		const connection = await pool.getConnection()

		const userQuery = "SELECT * FROM Users WHERE userID = ?"
		const userValues = [otherUsersID]
		const userToSend = await connection.query(userQuery, userValues)

		const followQuery = `SELECT * FROM Follow WHERE userID = ${userID} AND followingUserID = ${otherUsersID}`
		
		const followToSend = await connection.query(followQuery)

		const model = {
			userToSend,
			followToSend
		}

		response.status(200).json(model)

	} catch(error) {
		console.log("500 error: " + error)
		response.status(500).end()
	}
		
})