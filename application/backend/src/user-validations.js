const { createPool } = require('mariadb')

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

async function validateUser(user) {
    var errorArr = []

    const validateUsernameErrors = await validateUsername(user.username)

    for (let i = 0; i < validateUsernameErrors.length; i += 1){
        errorArr.push(validateUsernameErrors[i])
    }

    const validatePasswordErrors = validatePassword(user.password)

    for (let i = 0; i < validatePasswordErrors.length; i += 1){
        errorArr.push(validatePasswordErrors[i])
    }

    return errorArr
}

async function validateUsername(username){
    const MIN_USERNAME_LENGTH = 2
    const MAX_USERNAME_LENGTH = 12
    
    var errorArr = []
    console.log("new username is: " + username)

    if (username.length == 0) {
        errorArr.push("Can not leave username field empty")
    } else if (username.length < MIN_USERNAME_LENGTH) {
        errorArr.push("Username must be at least 2 characters long")
    } else if (username.length > MAX_USERNAME_LENGTH) {
        errorArr.push("Username can have a maximum of 12 characters")
    } else {
        const connection = await pool.getConnection()

        const usernameQuery = "SELECT * FROM Users WHERE username = ?";
        const usernameValues = [username]

        const result = await connection.query(usernameQuery, usernameValues)

        if (result.length != 0) {
            errorArr.push("That username is already taken")
        }

    }

    console.log("validate user: " + errorArr)

    return errorArr
}

function validatePassword(password){
    const MIN_PASSWORD_LENGTH = 2
    const MAX_PASSWORD_LENGTH = 20

    var errorArr = []

    if (password.length == 0) {
        errorArr.push("Can not leave password field empty")
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        errorArr.push("Password must be at least 2 characters long")
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        errorArr.push("Password can have a maximum of 20 characters")
    }

    return errorArr
}



module.exports = {
    validateUser,
    validateUsername,
    validatePassword
}