const express = require('express')

const router = express.Router()
const { createPool } = require ('mariadb')

//import * as hash from "../app.js"

const bcrypt = require('bcrypt');

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


//---------------- get my account -------------------------
router.get('/', async function (request, response) {
	const userID = request.get("UserID")
	console.log("userID is: "+ userID)
    const enteredPassword = request.get("Password")
    try {
        const connection = await pool.getConnection()
        const getUsernameQuery = 'SELECT username FROM Users WHERE userID = ?'
		const getUsernameValue = [userID]
        const username = await connection.query(getUsernameQuery, getUsernameValue)
		console.log("username length is: " + username.length)

		if (username.length == 0){
			response.status(404).end()
		} else {
			response.status(200).json(username[0].username)
		}
        
    } catch (err) {
        console.error(err)
        response.status(500).end()
    }
})

//---------------- update password -------------------------
router.put("/update-password", async function(request, responde){
	const userID = request.get("UserID")
    const newPassword = request.get("NewPassword")

	try {
		const connection = await pool.getConnection()

        const hashedNewPassword = await hashPassword(newPassword)
        console.log("pure password is: " + newPassword)
        console.log("hashed password is: " + hashedNewPassword)

		const updatePasswordQuery = "UPDATE Users SET password = ? WHERE userID = ?"
        const updatePasswordValues = [hashedNewPassword, userID]

        await connection.query(updatePasswordQuery, updatePasswordValues)

        responde.status(200).end()

	} catch (error){
        console.log("500 error: " + error)
        responde.status(500).end()
	}
})