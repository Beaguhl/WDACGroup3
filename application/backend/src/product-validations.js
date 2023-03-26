const { createPool } = require('mariadb');

const pool = createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "abc123",
    database: "abc",
});

pool.on("error", function (error) {
    console.log("Error from pool", error);
});

async function validateProductErrors(productName, description) {
    let productErrors = []
    const nameError = await validateProductName(productName)
    const descriptionError = await validateProductDescription(description)
    if (nameError != null) {
        productErrors.push(nameError)
    }
    if (descriptionError != null) {
        productErrors.push(descriptionError)
    }
    return productErrors
}

module.exports = {
    validateProductErrors
}

async function validateProductName(productName) {
    const MIN_PRODUCT_NAME_LENGTH = 3;
    const MAX_PRODUCT_NAME_LENGTH = 20;
    const regexForAcceptableProductName = /\S/

    var errorStr = "";

    if (productName.length < MIN_PRODUCT_NAME_LENGTH || productName.length > MAX_PRODUCT_NAME_LENGTH) {
        errorStr = "Products name must be at least " + MIN_PRODUCT_NAME_LENGTH + " but no longer than " + MAX_PRODUCT_NAME_LENGTH + " characters long"
    } else if (!regexForAcceptableProductName.test(productName)) {
        errorStr = "Products name must contain actuall leters"
    } else {
        const connection = await pool.getConnection();
        try {
            const productNameQuery = "SELECT * FROM Products WHERE productName = ?"
            const productNameValues = [productName];

            const result = await connection.query(productNameQuery, productNameValues)
            if (result.length != 0) {
                errorStr = "That product already exists"
            }

        } catch (error) {
            console.log(error)
        } finally {
            if (connection) {
                connection.release()
            }
        }

    }
    if (errorStr != "") {
        return errorStr
    }
}

async function validateProductDescription(description) {
    const MIN_PRODUCT_DESCRIPTION_LENGTH = 5;
    const MAX_PRODUCT_DESCRIPTION_LENGTH = 50;
    const regexForAcceptableProductDescription = /\S/

    var errorStr = "";

    if (description.length < MIN_PRODUCT_DESCRIPTION_LENGTH || description.length > MAX_PRODUCT_DESCRIPTION_LENGTH) {
        errorStr = "Products description must be at least " + MIN_PRODUCT_DESCRIPTION_LENGTH + " but no longer than " + MAX_PRODUCT_DESCRIPTION_LENGTH + " characters long"
    } else if (!regexForAcceptableProductDescription.test(description)) {
        errorStr = "Products description must contain actuall leters"
    } else {

    }
    if (errorStr != "") {
        return errorStr
    }
}




