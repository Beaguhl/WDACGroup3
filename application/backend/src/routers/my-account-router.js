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

const { validateUsername, validatePassword } = require('../user-validations')

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
router.put("/update-password", async function(request, response){
	const userID = request.get("UserID")
    const newPassword = request.get("NewPassword")

	try {
        const passwordErrors = validatePassword(newPassword)

        if (passwordErrors.length > 0){
            response.status(400).json(passwordErrors)
        } else {
            const connection = await pool.getConnection()
            const hashedNewPassword = await hashPassword(newPassword)

            const updatePasswordQuery = "UPDATE Users SET password = ? WHERE userID = ?"
            const updatePasswordValues = [hashedNewPassword, userID]

            await connection.query(updatePasswordQuery, updatePasswordValues)

            response.status(200).end()
        }

	} catch (error){
        console.log("500 error: " + error)
        response.status(500).end()
	}
})

router.put("/update-username", async function(request, response){
    const userID = request.get("UserID")
    const newUsername = request.get("NewUsername")

    try {
        const usernameErrors = await validateUsername(newUsername)

        if (usernameErrors.length > 0){
            response.status(400).json(usernameErrors)
        } else {
            const connection = await pool.getConnection()

            const updateUsernameQuery = "UPDATE Users SET Username = ? WHERE userID = ?"
            const updateUsernameValues = [newUsername, userID]

            await connection.query(updateUsernameQuery, updateUsernameValues)
            console.log("username updated")

            response.status(200).end()
        }
    } catch(error){
        console.log("500 error: " + error)
        response.status(500).end()
    }
})