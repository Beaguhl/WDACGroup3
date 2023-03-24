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

//------------------ get wish list -----------------
router.get("/:id", async function(request, response){
    const id = parseInt(request.params.id)

    try {
        const connection = await pool.getConnection()

        const getWishListQuery = "SELECT * FROM WishList WHERE userID = ?"
        const getWishListValue = [id]

        const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue)
        const wishListID = fetchedWishlistID[0].wishListID

        try {
            const getWishListProductQuery = "SELECT * FROM WishListProduct WHERE wishListID = ?"
            const getWishListProductValue = [wishListID]
            const wishListProducts = await connection.query(getWishListProductQuery, getWishListProductValue)

            var products = []

            for (let i = 0; i < wishListProducts.length; i += 1) {
                const getProductQuery = "SELECT * FROM Products WHERE productID = ?"
                const wishListProductID = wishListProducts[i].productID
                const getProductValue = [wishListProductID]

                await connection.query(getProductQuery, getProductValue)
            }
            response.status(200).json(products)

        } catch (error) {
            console.log(error)
            response.status(500).end()
        }

    } catch (error) {
        console.log(error)
        response.status(500).end()
    }
})

//---------------- search in my wish list ----------------
router.get("/:id/search", async function(request, response){
    const id = parseInt(request.params.id)

    try {
        const searchQuery = request.query.q
        const connection = await pool.getConnection()

        const getWishListQuery = "SELECT * FROM WishList WHERE userID = ?"
        const getWishListValue = [id]

        const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue)
        const wishListID = fetchedWishlistID[0].wishListID

        const getProductsQuery = `SELECT * FROM Products WHERE productName LIKE '%${searchQuery}%'`

        const searchedProducts = await connection.query(getProductsQuery)
        var searchResults = []

        for (let i = 0; i < searchedProducts.length; i += 1) {
            const getWishListProductQuery = "SELECT * FROM WishListProduct WHERE productID = ? AND wishListID = ?"
            const getWishListProductValue = [searchedProducts[i].productID, wishListID]
            const wishListProduct = await connection.query(getWishListProductQuery, getWishListProductValue)

            if (wishListProduct.length != 0) {
                let arrLenght = searchResults.length
                searchResults[arrLenght] = [searchedProducts[i], wishListProduct[0]]
            }
        }

        if (searchResults.length == 0) {
            console.log("404")
            response.status(404).end()
        } else {
            console.log("200")
            response.status(200).json(searchResults)
        }

    } catch (error) {
        console.log(error)
        response.status(500).end()
    }
})
