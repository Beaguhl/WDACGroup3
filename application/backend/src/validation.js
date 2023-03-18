function validateUser(user) {
    const MIN_USERNAME_LENGTH = 2
    const MAX_USERNAME_LENGTH = 12

    const MIN_PASSWORD_LENGTH = 2
    const MAX_PASSWORD_LENGTH = 20

    var errorArr = []

    if ((user.username).length < MIN_USERNAME_LENGTH){
        errorArr.push("Username must be at least 2 characters long")
    } else if ((user.username).lentgh > MAX_USERNAME_LENGTH){
        errorArr.push("Username can have a maximum of 12 characters")
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