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

//------------------ mark product as purchased ---------------
router.patch("/:id/purchase", async function(request, response){
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")

    try {
        const connection = await pool.getConnection()

        const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
        const updatePurchasedValues = [true, userID, id]

        await connection.query(updatePurchasedQuery, updatePurchasedValues)

        response.status(200).end()

    } catch(error) {
        console.log(error)
        response.status(500).end()
    }
})

//--------------- undo marked product as purchased ---------------
router.patch("/:id/undo-purchase", async function(request, response){
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")

    try {
        const connection = await pool.getConnection()

        const getUserPurchasedQuery = "SELECT userPurchased FROM WishListProduct WHERE wishListProductID = ?"
        const getUserPurchasedValues = [id]

        const userPurchasedID = await connection.query(getUserPurchasedQuery, getUserPurchasedValues)

        if (userPurchasedID[0].userPurchased == userID){
            const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
            const updatePurchasedValues = [false, null, id]

            await connection.query(updatePurchasedQuery, updatePurchasedValues)

            response.status(200).end()

        } else {
            response.status(403).end()
        }

    } catch(error) {
        console.log(error)
        response.status(500).end()
    }
})

//----------------- add wish to wishlist -------------------
router.post("/:id", async function(request, response){
    const productID = parseInt(request.params.id)
    const userID = request.get("UserID")
    
    try {
        const connection = await pool.getConnection()

        const getWishListIDQuery = "SELECT wishListID FROM WishList WHERE userID = ?"
        const getWishListIDValue = [userID]

        const fetchedWishListID = await connection.query(getWishListIDQuery, getWishListIDValue)
        
        if (fetchedWishListID != null){
            const wishListID = fetchedWishListID[0].wishListID

            const addProductQuery = "INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (?, ?, ?, ?)"
            const addProductValues = [productID, wishListID, false, null]

            await connection.query(addProductQuery, addProductValues)
            response.status(200).end()
        }

    } catch(error) {
        console.log(error)
        response.status(500).end()
    }
})

