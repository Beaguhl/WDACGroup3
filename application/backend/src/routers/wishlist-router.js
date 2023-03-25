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

const app = express()


router.get("/:id", async function (request, response) {

    const id = parseInt(request.params.id)

    const userID = request.get("UserID")

    const connection = await pool.getConnection()

    try {


        // gets one wishListID from "WishLists"
        const getWishListQuery = "SELECT * FROM WishLists WHERE userID = ?"
        const getWishListValue = [id]

        const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue)
        console.log("33 wishlist id is: " + fetchedWishlistID[0])
        const wishListID = fetchedWishlistID[0].wishListID

        try {
            // gets all wishListProduct from "WishListProducts"
            const getWishListProductsQuery = "SELECT * FROM WishListProducts WHERE wishListID = ?"
            const getWishListProductsValue = [wishListID]
            const wishListProducts = await connection.query(getWishListProductsQuery, getWishListProductsValue)

            var products = []

            for (let i = 0; i < wishListProducts.length; i += 1) {
                // gets one product from "Products"
                const getProductQuery = "SELECT * FROM Products WHERE productID = ?"
                const wishListProductID = wishListProducts[i].productID
                const getProductValue = [wishListProductID]

                const product = await connection.query(getProductQuery, getProductValue)
                console.log("----------------------------------")
                console.log(product[0])
                console.log(wishListProducts[i])
                products.push([product[0], wishListProducts[i]])
                console.log("----------------------------------")


            }
            console.log("products är nu: " + products[0])
            response.status(200).json(products)

        } catch (error) {
            console.log(error)
            response.status(500).end()
        } finally {
            if (connection) {
                connection.release()
            }
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


router.get("/:id/search", async function (request, response) {
    const id = parseInt(request.params.id)


    console.log("searching my wish list")
    const userID = request.get("UserID")
    const connection = await pool.getConnection()

    try {
        const searchQuery = request.query.q


        // get wish list ID
        const getWishListQuery = "SELECT * FROM WishLists WHERE userID = ?"
        const getWishListValue = [id]

        const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue)
        const wishListID = fetchedWishlistID[0].wishListID


        const getProductsQuery = `SELECT * FROM Products WHERE productName LIKE '%${searchQuery}%'`

        // gets all products from "Products"
        const searchedProducts = await connection.query(getProductsQuery)
        console.log("searchedProducts.length är: " + searchedProducts.length)
        var searchResults = []

        for (let i = 0; i < searchedProducts.length; i += 1) {
            // search through products to see if it exists in wishListProduct
            const getWishListProductsQuery = "SELECT * FROM WishListProducts WHERE productID = ? AND wishListID = ?"
            const getWishListProductsValue = [searchedProducts[i].productID, wishListID]
            const wishListProduct = await connection.query(getWishListProductsQuery, getWishListProductsValue)

            if (wishListProduct.length != 0) {
                console.log(searchedProducts[i].productName)
                let arrLenght = searchResults.length
                console.log("---------------------------------")
                console.log(searchedProducts[i])
                console.log(wishListProduct[0])
                console.log("---------------------------------")
                searchResults[arrLenght] = [searchedProducts[i], wishListProduct[0]]

            }
        }

        console.log("detta fångade vi: " + searchResults)
        console.log("längden är: " + searchResults.length)
        if (searchResults.length == 0) {
            console.log("404")
            response.status(404).end()
        } else {
            console.log("200")
            response.status(200).json(searchResults)
        }

    } catch (error) {

    } finally {
        if (connection) {
            connection.release()
        }
    }
})

/*router.post("/:id", async function (request, response) {
    const id = request.get("UserID")

    try {
        const connection = await pool.getConnection()

        const postWishlistProductQuery = "SELECT * FROM WishListProducts INNER JOIN Products ON Products.productID = WishListProducts.productID WHERE WishListProducts.wishListID = ? AND WishListProducts.productID = ?"
    }
})*/