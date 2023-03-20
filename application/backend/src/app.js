const express = require('express')
const { createPool } = require('mariadb')
const { validateUser } = require('./validation')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const { json } = require('express');

const ACCESS_TOKEN_SECRET = "PN#/(dh6-.E.x-'P2"



function hashPassword(password) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (error, salt) => {
			if (error) {
				reject(error)
			}

			bcrypt.hash(password, salt, (error, hashedPassword) => {
				if (error) {
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

pool.on('error', function (error) {
	console.log("Error from pool", error)
})


const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(function (request, response, next) {
	response.set("Access-Control-Allow-Origin", "http://localhost:5173")
	response.set("Access-Control-Allow-Methods", "*")
	response.set("Access-Control-Allow-Headers", "*")
	response.set("Access-Control-Expose-Headers", "*")

	next()
})

app.get("/", function (request, response) {
	response.send("It works")
})

//-------------------- users ---------------------------
app.get("/users", async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {

		if (error) {
			console.log(error)
			response.status(401).end()
		} else {*/
	try {
		const connection = await pool.getConnection()

		const getAllUsersQuery = "SELECT * FROM Users WHERE userID != ?"
		const getAllUsersValues = [parseInt(payload.sub)]
		const users = await connection.query(getAllUsersQuery, getAllUsersValues)

		console.log("users are-__ " + users)
		response.status(200).json(users)

	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
}
)



app.post("/users", async function (request, response) {

	const user = request.body

	const validationArr = await validateUser(user)

	if (validationArr.length > 0) {
		response.status(400).json(validationArr)
		return

	} else {

		try {
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

		} catch (error) {
			console.log(error)
			response.status(500).end()
		}
	}
})

app.get('/users/search', async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			console.log(error)
			response.status(401).end()
		} else {*/
	try {
		const searchQuery = request.query.q

		const connection = await pool.getConnection()

		const getSearchedUsersQuery = `SELECT * FROM Users WHERE userID != ${parseInt(payload.sub)} AND username LIKE '%${searchQuery}%'`
		const searchedUsers = await connection.query(getSearchedUsersQuery)
		console.log("search useds inside: " + searchedUsers)

		if (searchedUsers.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(searchedUsers)
		}

	} catch {
		// add catch
	}
}
)

//---------------------- user -------------------------
app.get("/user/:id", async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			console.log("401 error - could not verify user with token")
			response.status(401).end()
		} else {*/
	try {
		const otherUsersID = parseInt(request.params.id)

		if (payload.sub == otherUsersID) {
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

	} catch (error) {
		console.log("500 error: " + error)
		response.status(500).end()
	}
}
)

//-------------------- follow ----------------------------
app.get('/followings', async function (request, response) {
	console.log("inside following")
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.status(401).end()
		} else {*/
	try {
		const connection = await pool.getConnection()

		const getAllFollowingQuery = `SELECT followingUserID FROM Follow WHERE userID = ${parseInt(payload.sub)}`
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
	} catch {
		console.log("error is: " + error)
		response.status(500).end()
	}
}
)

app.get('/followings/search', async function (request, response) {
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.status(401).end()
		} else {*/
	const searchQuery = request.query.q

	const connection = await pool.getConnection()

	//gets all users that matches search string
	const getSearchedFollowingQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
	const searchedFollowing = await connection.query(getSearchedFollowingQuery)

	let followingSearchedUsers = []

	//checking if a user is a following
	for (let i = 0; i < searchedFollowing.length; i += 1) {
		const getSearchedFollowing = `SELECT * FROM Follow WHERE userID = ${payload.sub} AND followingUserID = ${searchedFollowing[i].userID}`
		const fetchedFollowing = await connection.query(getSearchedFollowing)
		if (fetchedFollowing.length != 0) {
			let arrLenght = followingSearchedUsers.length
			followingSearchedUsers[arrLenght] = searchedFollowing[i]
		}
	}

	console.log(followingSearchedUsers)
	if (followingSearchedUsers.length == 0) {
		response.status(404).end()
	} else {
		response.status(200).json(followingSearchedUsers)
	}
})


app.post('/follow', async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.status(401).end()
		} else {*/
	const connection = await pool.getConnection()

	const userToFollow = request.get("UserToFollow")
	const userID = parseInt(payload.sub)

	const followQuery = "INSERT INTO Follow (userID, followingUserID) VALUES (?, ?)";
	const followValues = [userID, userToFollow]

	await connection.query(followQuery, followValues)
	console.log("done following")

	response.status(201).end()
})


app.delete('/unfollow', async function (request, response) {
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.send(401).end()
		} else {*/
	const connection = await pool.getConnection()

	const userToUnfollow = request.get("UserToUnfollow")
	const userID = parseInt(payload.sub)

	const unfollowQuery = "DELETE FROM Follow WHERE userID = ? AND followingUserID = ?"
	const unfollowValues = [userID, userToUnfollow]

	await connection.query(unfollowQuery, unfollowValues)
	console.log("deleted follow")

	response.status(204).end()


}
)


app.get('/followers', async function (request, response) {
	console.log("inside following")
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.status(401).end()
		} else {*/
	try {
		const connection = await pool.getConnection()

		const getAllFollowersQuery = `SELECT userID FROM Follow WHERE followingUserID = ${parseInt(payload.sub)}`
		const followerID = await connection.query(getAllFollowersQuery)
		console.log("followerID are: " + followerID)

		let followerUsers = []

		for (let i = 0; i < followerID.length; i += 1) {
			console.log("follower ID: " + followerID[i])
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
		console.log("error is: " + error)
		response.status(500).end()
	}
}
)


app.get('/followers/search', async function (request, response) {
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	/*jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function (error, payload) {
		if (error) {
			response.status(401).end()
		} else {*/
	const searchQuery = request.query.q

	const connection = await pool.getConnection()

	const getSearchedFollowerQuery = `SELECT * FROM Users WHERE username LIKE '%${searchQuery}%'`
	const searchedFollower = await connection.query(getSearchedFollowerQuery)
	console.log("searched id är: " + searchedFollower)

	let followerSearchedUsers = []

	for (let i = 0; i < searchedFollower.length; i += 1) {
		console.log("folowing id är: " + searchedFollower[i].userID)
		const getSearchedFollower = `SELECT * FROM Follow WHERE followingUserID = ${payload.sub} AND userID = ${searchedFollower[i].userID}`
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
})


//----------------------- tokens ----------------------
app.post('/tokens', async function (request, response) {

	const grantType = request.body.grant_type
	const username = request.body.username
	const password = request.body.password

	if (grantType != "password") {
		response.status(400).json({ error: "unsupported_grant_type" })
		return
	}

	if (username == "" || password == "") {
		response.status(400).json({ error: "invalid_request" }) //
		return
	}

	const connection = await pool.getConnection()
	const compareUserQuery = "SELECT * FROM Users WHERE username = ?"
	const compareUserValue = [username]

	const result = await connection.query(compareUserQuery, compareUserValue)

	if (result.length != 0) {

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

				jwt.sign(payload, ACCESS_TOKEN_SECRET, function (error, accesToken) {
					if (error) {
						response.status(500).end()
					} else {
						response.status(200).json({
							access_token: accesToken,
							type: "bearer",
							userID: result[0].userID
						})
					}
				})

			} else {
				console.log('The passwords do not match!');
			}
		})



	} else {
		response.status(400).json({ error: "invalid_grant" })
		return
	}

})

//----------------------- products ----------------------

app.get("/products", async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")


	try {
		const connection = await pool.getConnection()

		const getAllProductsQuery = "SELECT * FROM Products"
		const getAllProductsValues = [userID]
		const products = await connection.query(getAllProductsQuery, getAllProductsValues)

		console.log("products are-__ " + products[1])
		response.status(200).json(products)

	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
}
)


app.get('/products/search', async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")


	try {
		const searchQuery = request.query.q

		const connection = await pool.getConnection()

		const getSearchedProductsQuery = `SELECT * FROM Products WHERE productID != ${userID} AND productName LIKE '%${searchQuery}%'`
		const searchedProducts = await connection.query(getSearchedProductsQuery)
		console.log("search useds inside: " + searchedProducts)

		if (searchedProducts.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(searchedProducts)
		}

	} catch {
		// add catch
	}
})

//----------------------- products ----------------------

app.get("/products/:id", async function (request, response) {
	console.log("går in i products id")


	try {
		const otherProductID = parseInt(request.params.id)
		console.log("other procut är: " + otherProductID)

		const connection = await pool.getConnection()
		console.log("har connectat")

		const productQuery = `SELECT * FROM Products WHERE productID = ${parseInt(otherProductID)}`
		console.log("har 1")

		const productToSend = await connection.query(productQuery)
		console.log("procudt to send is: " + productToSend)

		console.log("HÄR ÄR PRODUCTTOSEND!!!!! " + productToSend)
		console.log("HÄR ÄR PRODUCTTOSEND!!!!! ")

		const procuct = productToSend[0]

		console.log("HAUHDFJHWJLAHLJF " + procuct)

		const model = {
			procuct
		}

		response.status(200).json(model)
	} catch (error) {
		response.status(500).end()
	}
})


//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
})