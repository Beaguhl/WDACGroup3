const { pool } = require("./context");

pool.on("error", function (error) {
    console.log("Error from pool", error);
});

async function validateNewProduct(productName, productDescription) {
    let newProductErrors = []

    const nameErrors = await validateNewProductName(productName)
    const productErrors = await validateProductErrors(productName, productDescription)

    console.log(nameErrors)
    if (nameErrors.length != 0){
        newProductErrors.push(nameErrors)
    }

    if (productErrors.length != 0){
        newProductErrors.push(productErrors)
    }
    
    console.log(newProductErrors)
    return newProductErrors
}

async function validateProductErrors(productName, productDescription) {
    let productErrors = []
    const nameError = await validateProductName(productName)
    const descriptionError = await validateProductDescription(productDescription)
    if (nameError.length != 0) {
        productErrors.push(nameError)
    }
    if (descriptionError.length != 0) {
        productErrors.push(descriptionError)
    }
    return productErrors
}

async function validateNewProductName(productName){
    let connection
    
        try {
            connection = await pool.getConnection()

            var errorStr = []
            const productNameQuery = "SELECT * FROM Products WHERE productName = ?"
            const productNameValues = [productName];

            const productAlreadyExists = await connection.query(productNameQuery, productNameValues)
            if (productAlreadyExists.length != 0) {
                errorStr += "That product already exists"
            }
            return errorStr

        } catch (error) {
            console.log(error)
        } finally {
            if (connection) {
                connection.release()
            }
        }
}

async function validateProductName(productName) {
    const MIN_PRODUCT_NAME_LENGTH = 3;
    const MAX_PRODUCT_NAME_LENGTH = 20;
    const regexForAcceptableProductName = /\S/

    var errorStr = []

    if (productName.length < MIN_PRODUCT_NAME_LENGTH || productName.length > MAX_PRODUCT_NAME_LENGTH) {
        errorStr += "Products name must be at least " + MIN_PRODUCT_NAME_LENGTH + " but no longer than " + MAX_PRODUCT_NAME_LENGTH + " characters long"
    }
    
    if (!regexForAcceptableProductName.test(productName)) {
        errorStr += "Products name must contain actuall leters"
    } 

    return errorStr
}

async function validateProductDescription(description) {
    const MIN_PRODUCT_DESCRIPTION_LENGTH = 5;
    const MAX_PRODUCT_DESCRIPTION_LENGTH = 50;
    const regexForAcceptableProductDescription = /\S/

    var errorStr = []

    if (description.length < MIN_PRODUCT_DESCRIPTION_LENGTH || description.length > MAX_PRODUCT_DESCRIPTION_LENGTH) {
        errorStr += "Products description must be at least " + MIN_PRODUCT_DESCRIPTION_LENGTH + " but no longer than " + MAX_PRODUCT_DESCRIPTION_LENGTH + " characters long"
    }

    if (!regexForAcceptableProductDescription.test(description)) {
        errorStr += "Products description must contain actuall leters"
    }
    
    return errorStr
}

module.exports = {
    validateProductErrors,
    validateNewProduct
}


