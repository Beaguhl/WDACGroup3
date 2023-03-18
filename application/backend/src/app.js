const express = require('express')
const { createPool } = require ('mariadb')
const { validateUser } = require('./validation')

const bcrypt = require('bcrypt');

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
	try{
		const connection = await pool.getConnection()
		
		const query = "SELECT * FROM Users"
		const users = await connection.query(query)

		response.status(200).json(users)
		
	} catch(error) {
		console.log(error)
		response.status(500).end() // 500 = server error
	}
	
})

app.post("/users", async function(request, response){

	const user = request.body
	console.log(user.username + user.password)

	const validationArr = validateUser(user)

	if (validationArr.length > 0){
		console.log("now we 400 ")
		console.log("arr is: " + validationArr.length)
		response.status(400).json(validationArr)
		return

	} else {

		try{
			const connection = await pool.getConnection()
			
			const createUserQuery = "INSERT INTO Users (username, password, admin) VALUES (?, ?, ?)";
        	const createUserValues = [user.username, user.password, false]
			
			
			const result = await connection.query(createUserQuery, createUserValues)
			console.log(result)
	
			response.status(201).json()
			
		} catch(error) {
			console.log(error)
			response.status(500).end() // 500 = server error
		}
	}
		
	//compute userID if needed

	const hashedPassword = await hashPassword(user.password)

	console.log(user.username + user.password + hashedPassword) 



	response.set('Location', '/users/${1}')
	response.status(201).end()

	

	

})

//---------------------- user -------------------------
app.get("/user/:id", async function(request, response){
	const userID = parseInt(request.params.id)

	try {
		const connection = await pool.getConnection()

		//---------------- gets user info -------------------
		const userQuery = "SELECT * FROM Users WHERE userID = ?"
		const userValues = [userID]
		const user = await connection.query(userQuery, userValues)

		/*
		//---------------- checks follow status -------------
		const followQuery = "SELECT * FROM Follow WHERE userID = ? AND followingUserID = ?"
		const followValues = [userID]*/

		/*userID INT,
	followingUserID INT,*/



		response.status(200).json(user)

	} catch(error) {
		console.log(error)
		response.status(404).end()
	}

})



//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
  })