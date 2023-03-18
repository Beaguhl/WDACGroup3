const { createPool } = require ('mariadb')

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

async function validateUser(user) {
    const MIN_USERNAME_LENGTH = 2
    const MAX_USERNAME_LENGTH = 12

    const MIN_PASSWORD_LENGTH = 2
    const MAX_PASSWORD_LENGTH = 20

    var errorArr = []

    if ((user.username).length < MIN_USERNAME_LENGTH){
        errorArr.push("Username must be at least 2 characters long")
    } else if ((user.username).lentgh > MAX_USERNAME_LENGTH){
        errorArr.push("Username can have a maximum of 12 characters")
    } else {
        const connection = await pool.getConnection()
			
		const usernameQuery = "SELECT * FROM Users WHERE username = ?";
        const usernameValues = [user.username]
			
		const result = await connection.query(usernameQuery, usernameValues)
		
        if (result.length != 0){
            errorArr.push("That username is already taken")
        }
    
    }


    //that username is already taken

    if ((user.password).length < MIN_PASSWORD_LENGTH){
        errorArr.push("Password must be at least 2 characters long")
    } else if ((user.password).lentgh > MAX_PASSWORD_LENGTH){
        errorArr.push("Password can have a maximum of 20 characters")
    }

    return errorArr
}

module.exports = {
    validateUser
  }