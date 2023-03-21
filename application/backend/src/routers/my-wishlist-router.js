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

router.get("/", async function(request, response){
    const userID = request.get("UserID")

    try {
        const connection = await pool.getConnection()
        
        const getWishListQuery = "SELECT * FROM WishList WHERE userID = ?"
        const getWishListValue = [userID]
        const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue)
        const wishListID = fetchedWishlistID[0].wishListID

        try {
            const getWishListProductQuery = "SELECT * FROM WishListProduct WHERE wishListID = ?"
            const getWishListProductValue = [wishListID]

            const wishListProducts = await connection.query(getWishListProductQuery, getWishListProductValue)

            var products = []

            for (let i = 0; i < wishListProducts.length; i += 1){
                const getProductQuery = "SELECT * FROM Products WHERE productID = ?"
                const wishListProductID = wishListProducts[i].wishListProductID
                const getProductValue = [wishListProductID]

                const product = await connection.query(getProductQuery, getProductValue)
                products.push(product[0])
                
            }

            console.log("products are: " + products)
            response.status(200).json(products)

        } catch (error) {
            console.log(error)
		    response.status(500).end()
        }

    } catch (error){
        console.log(error)
		response.status(500).end()
    }
})