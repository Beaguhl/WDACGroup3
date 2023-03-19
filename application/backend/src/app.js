const express = require('express')
const { createPool } = require ('mariadb')
const { validateUser } = require('./validation')
const jwt = require ('jsonwebtoken')

const bcrypt = require('bcrypt');
const { json } = require('express');

const ACCESS_TOKEN_SECRET = "PN#/(dh6-.E.x-'P2"

function hashPassword(password){
	return new Promise ((resolve, reject) => {
		bcrypt.genSalt(12, (error, salt) => {
			if (error){
				reject(error)
			}

			bcrypt.hash(password, salt, (error, hashedPassword) => {
				if (error){
					reject(error)
				} else {
					resolve(hashedPassword)
				}
			})
		})
	})
}

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


const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(function(request, response, next){
	response.set("Access-Control-Allow-Origin", "http://localhost:5173")
	response.set("Access-Control-Allow-Methods", "*")
	response.set("Access-Control-Allow-Headers", "*")
	response.set("Access-Control-Expose-Headers", "*")

	next()
})

app.get("/", function(request, response){
	response.send("It works")
})

//-------------------- users ---------------------------
app.get("/users", async function(request, response){	

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		
		if (error){
			console.log(error)
			response.status(401).end()
		} else {
			try{
				const connection = await pool.getConnection()
				
				const query = "SELECT * FROM Users"
				const users = await connection.query(query)
		
				console.log("found these users: " + users)
				response.status(200).json(users)
				
			} catch(error) {
				console.log(error)
				response.status(500).end() // 500 = server error
			}
		}
	})
})

app.post("/users", async function(request, response){

	const user = request.body

	const validationArr = await validateUser(user)

	if (validationArr.length > 0){
		response.status(400).json(validationArr)
		return

	} else {

		try{
			const connection = await pool.getConnection()
					
			const createUserQuery = "INSERT INTO Users (username, password, admin) VALUES (?, ?, ?)";
			const hashedPassword = await hashPassword(user.password)
			const createUserValues = [user.username, hashedPassword, false]
					
			const test = await connection.query(createUserQuery, createUserValues)

			const getUserIDQUery = "SELECT userID FROM Users WHERE username = ?"
			const getUserIDValues = [user.username]

			const userID = await connection.query(getUserIDQUery, getUserIDValues)
			
			response.set('Location', '/users/${userID}')
			response.status(201).end()
					
		} catch(error) { 
			console.log(error)
			response.status(500).end() // 500 = server error
		}
	}
	
})

//---------------------- user -------------------------
app.get("/user/:id", async function(request, response){

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

				console.log("userID: " + payload.sub + " otherUsersID: " + otherUsersID)
				const followQuery = "SELECT * FROM Follow WHERE userID = ? AND followingUserID = ?"
				const followValues = [parseInt(payload.sub), otherUsersID]
				
				const followToSend = await connection.query(followQuery, followValues)

				const model = {
					userToSend,
					followToSend
				}

				console.log("returning this: " + model)
				response.status(200).json(model)

			} catch(error) {
				console.log("500 error: " + error)
				response.status(500).end()
			}
		}
	})

	

})

app.post('/follow', function(request, response){

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if (error){
			response.send(401).end()
		} else {
			const connection = await pool.getConnection()

			const userToFollow = request.get("UserToFollow")
			const userID = parseInt(payload.sub)
					
			const followQuery = "INSERT INTO Follow (userID, followingUserID) VALUES (?, ?)";
			const followValues = [userID, userToFollow]
					
			await connection.query(followQuery, followValues)
			console.log("done following")

			response.status(201).end()
		}
	})

})

app.delete('/unfollow', function(request, response){
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
			console.log("deleted follow")

			response.status(204).end()


		}
	})
})


//----------------------- tokens ----------------------
app.post('/tokens', async function(request, response){

	const grantType = request.body.grant_type
	const username = request.body.username
	const password = request.body.password

	if (grantType != "password"){
		response.status(400).json({error: "unsupported_grant_type"})
		return
	}

	if (username == "" || password == ""){
		response.status(400).json({error: "invalid_request"}) //
		return
	}

	const connection = await pool.getConnection()
	const compareUserQuery = "SELECT * FROM Users WHERE username = ?"
	const compareUserValue = [username]

	const result = await connection.query(compareUserQuery, compareUserValue)
	
	if (result.length != 0){

		console.log("i tokens: " + result[0].userID)
		bcrypt.compare(password, result[0].password, (err, res) => {
			if (err) {
			  throw err;
			}
			if (res === true) {
				//passwords matched
				const payload = {
					sub: `${result[0].userID}`
				}

				jwt.sign(payload, ACCESS_TOKEN_SECRET, function(error, accesToken){
					if (error){
						response.status(500).end()
					} else {
						response.status(200).json({
							access_token: accesToken,
							type: "bearer"
						})
					}
				})
			  
			} else {
			  console.log('The passwords do not match!');
			}
		  })

		

	} else {
		response.status(400).json({error: "invalid_grant"})
		return
	}

})

//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
  })