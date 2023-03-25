const express = require('express')

const router = express.Router()
const { createPool } = require('mariadb')

//import * as hash from "../app.js"

const bcrypt = require('bcrypt');

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
    const enteredPassword = request.get("Password")
    const connection = await pool.getConnection()
    try {

        const getUsernameQuery = 'SELECT username FROM Users WHERE userID = ?'
        const getUsernameValue = [userID]
        const username = await connection.query(getUsernameQuery, getUsernameValue)

        if (username.length == 0) {
            response.status(404).end()
        } else {
            response.status(200).json(username[0].username)
        }

    } catch (err) {
        console.error(err)
        response.status(500).end()
    } finally {
        if (connection) {
            connection.release()
        }
    }
})

//---------------- update password -------------------------
router.put("/update-password", async function (request, response) {
    const userID = request.get("UserID")
    const newPassword = request.get("NewPassword")
    const connection = await pool.getConnection()
    try {
        const passwordErrors = validatePassword(newPassword)

        if (passwordErrors.length > 0) {
            response.status(400).json(passwordErrors)
        } else {

            const hashedNewPassword = await hashPassword(newPassword)

            const updatePasswordQuery = "UPDATE Users SET password = ? WHERE userID = ?"
            const updatePasswordValues = [hashedNewPassword, userID]

            await connection.query(updatePasswordQuery, updatePasswordValues)

            response.status(200).end()
        }

    } catch (error) {
        response.status(500).end()
    } finally {
        if (connection) {
            connection.release()
        }
    }
})

router.patch("/update-username", async function (request, response) {
    const userID = request.get("UserID")
    const newUsername = request.get("NewUsername")
    const connection = await pool.getConnection()
    try {
        const usernameErrors = await validateUsername(newUsername)

        if (usernameErrors.length > 0) {
            response.status(400).json(usernameErrors)
        } else {


            const updateUsernameQuery = "UPDATE Users SET Username = ? WHERE userID = ?"
            const updateUsernameValues = [newUsername, userID]

            await connection.query(updateUsernameQuery, updateUsernameValues)

            response.status(200).end()
        }
    } catch (error) {
        response.status(500).end()
    } finally {
        if (connection) {
            connection.release()
        }
    }
})

router.delete("/delete-account", async function (request, response) {
    const userID = request.get("UserID")
    const connection = await pool.getConnection()
    try {
        const deleteUserQuery = "DELETE FROM Users WHERE userID = ?"
        const deleteUserValues = [userID]
        await connection.query(deleteUserQuery, deleteUserValues)
        response.status(204).end()
    } catch (error) {
        response.status(500).end()
        console.log(error)
    } finally {
        if (connection) {
            connection.release()
        }
    }
})