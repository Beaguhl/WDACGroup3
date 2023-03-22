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
							userID: result[0].userID,
							admin: result[0].admin
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

app.use('/follows', followRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)


//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
})