const express = require('express')
const { createPool } = require('mariadb')
const { validateUser } = require('./validation')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const { json } = require('express');

const followRouter = require('./routers/follow-router')
const productRouter = require('./routers/product-router')
const userRouter = require('./routers/user-router');

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

app.use('/follows', followRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)


//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
})