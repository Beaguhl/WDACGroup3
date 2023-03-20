const express = require('express')

const router = express.Router()

module.exports = router

const app = express()

//----------- all users ----------------
router.get("/", async function(request, response){	

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		
		if (error){
			console.log(error)
			response.status(401).end()
		} else {
			try{
				const connection = await pool.getConnection()
				
				const getAllUsersQuery = "SELECT * FROM Users WHERE userID != ?"
				const getAllUsersValues = [parseInt(payload.sub)]
				const users = await connection.query(getAllUsersQuery, getAllUsersValues)
	
				response.status(200).json(users)
				
			} catch(error) {
				console.log(error)
				response.status(500).end()
			}
		}
	})
})

//----------- search users ----------------
router.get('/search', async function(request, response){

	try {
        const searchQuery = request.query.q

        const connection = await pool.getConnection()

        const getSearchedUsersQuery = `SELECT * FROM Users WHERE userID != ${parseInt(payload.sub)} AND username LIKE '%${searchQuery}%'`
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

//---------------------- user/id -------------------------
router.get("/:id", async function(request, response){

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if (error){
			console.log("401 error - could not verify user with token")
			response.status(401).end()
		} else {
			try {
				const otherUsersID = parseInt(request.params.id)

				if (payload.sub == otherUsersID){
					console.log("403 error - user tried to view them self")
					response.status(403).end()
				}
				
				const connection = await pool.getConnection()

				const userQuery = "SELECT * FROM Users WHERE userID = ?"
				const userValues = [otherUsersID]
				const userToSend = await connection.query(userQuery, userValues)

				const followQuery = "SELECT * FROM Follow WHERE userID = ? AND followingUserID = ?"
				const followValues = [parseInt(payload.sub), otherUsersID]
				
				const followToSend = await connection.query(followQuery, followValues)

				const model = {
					userToSend,
					followToSend
				}

				response.status(200).json(model)

			} catch(error) {
				console.log("500 error: " + error)
				response.status(500).end()
			}
		}
	})
})