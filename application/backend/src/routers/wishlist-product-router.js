const e = require('express')
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

router.patch("/:id/purchase", async function (request, response) {
    console.log("entering update purchased")
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")
    console.log("id to update is: " + id)
    console.log("my userID is: " + userID)
    const connection = await pool.getConnection()

    try {

        console.log("got connection")

        const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
        console.log("1")
        const updatePurchasedValues = [true, userID, id]
        console.log("2")

        await connection.query(updatePurchasedQuery, updatePurchasedValues)

        console.log("updated!")
        response.status(200).end()

    } catch (error) {

    } finally {
        if (connection) {
            connection.release()
        }
    }

})

router.patch("/:id/undo-purchase", async function (request, response) {
    console.log("entering update purchased")
    const id = parseInt(request.params.id)
    const userID = request.get("UserID")
    console.log("id to update is: " + id)
    console.log("my userID is: " + userID)
    const connection = await pool.getConnection()

    try {


        console.log("got connection")

        const getUserPurchasedQuery = "SELECT userPurchased FROM WishListProduct WHERE wishListProductID = ?"
        const getUserPurchasedValues = [id]

        const userPurchasedID = await connection.query(getUserPurchasedQuery, getUserPurchasedValues)
        console.log(userPurchasedID[0].userPurchased + "bought this product")
        console.log("logged in as userID: " + userID)

        if (userPurchasedID[0].userPurchased == userID) {
            const updatePurchasedQuery = "UPDATE WishListProduct SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?"
            const updatePurchasedValues = [false, null, id]

            await connection.query(updatePurchasedQuery, updatePurchasedValues)

            console.log("updated!")
            response.status(200).end()

        } else {
            response.status(403).end()
        }


    } catch (error) {

    } finally {
        if (connection) {
            connection.release()
        }
    }

})

router.post("/:id", async function (request, response) {

    const connection = await pool.getConnection()

    try {

        const productID = parseInt(request.params.id)
        const userID = request.get("UserID")



        const getWishListIDQuery = "SELECT wishListID FROM WishList WHERE userID = ?"
        const getWishListIDValue = [userID]

        const fetchedWishListID = await connection.query(getWishListIDQuery, getWishListIDValue)

        if (fetchedWishListID != null) {
            const wishListID = fetchedWishListID[0].wishListID

            const addProductQuery = "INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (?, ?, ?, ?)"
            const addProductValues = [productID, wishListID, false, null]

            await connection.query(addProductQuery, addProductValues)
            response.status(200).end()
        }

    } catch (error) {
        console.log(error)
        response.status(500).end()
    } finally {
        if (connection) {
            connection.release()
        }
    }
})

