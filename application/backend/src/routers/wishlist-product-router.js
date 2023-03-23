const express = require('express')

const router = express.Router()
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

module.exports = router
console.log("inside whish list product")
router.patch("/:id", async function(request, response){
    console.log("entering update purchased")
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")
    console.log("id to update is: " + id)
    console.log("my userID is: " + userID)

    try {
        const connection = await pool.getConnection()
        /*
            UPDATE table_name
            SET column1 = value1, column2 = value2, ...
            WHERE condition;
        */
       console.log("got connection")

        const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
        console.log("1")
        const updatePurchasedValues = [true, userID, id]
        console.log("2")

        await connection.query(updatePurchasedQuery, updatePurchasedValues)

        //---- remove later-------
        const test = "SELECT * FROM WishListProduct WHERE "

        console.log("updated!")
        response.status(200).end()

    } catch(error) {

    }

})