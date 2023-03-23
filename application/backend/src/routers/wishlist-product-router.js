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

router.patch("/:id/purchase", async function(request, response){
    console.log("entering update purchased")
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")
    console.log("id to update is: " + id)
    console.log("my userID is: " + userID)

    try {
        const connection = await pool.getConnection()

        console.log("got connection")

        const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
        console.log("1")
        const updatePurchasedValues = [true, userID, id]
        console.log("2")

        await connection.query(updatePurchasedQuery, updatePurchasedValues)

        console.log("updated!")
        response.status(200).end()

    } catch(error) {

    }

})

router.patch("/:id/undo-purchase", async function(request, response){
    console.log("entering update purchased")
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")
    console.log("id to update is: " + id)
    console.log("my userID is: " + userID)

    try {
        const connection = await pool.getConnection()

        console.log("got connection")

        const getUserPurchasedQuery = "SELECT userPurchased FROM WishListProduct WHERE wishListProductID = ?"
        const getUserPurchasedValues = [id]

        const userPurchasedID = await connection.query(getUserPurchasedQuery, getUserPurchasedValues)
        console.log(userPurchasedID[0].userPurchased + "bought this product")
        console.log("logged in as userID: " + userID)

        if (userPurchasedID[0].userPurchased == userID){
            const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
            const updatePurchasedValues = [false, null, id]

            await connection.query(updatePurchasedQuery, updatePurchasedValues)

            console.log("updated!")
            response.status(200).end()

        } else {
            response.status(403).end()
        }

        
    } catch(error) {

    }

})