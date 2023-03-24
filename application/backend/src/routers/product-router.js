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




router.get("/", async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")


	try {
		const connection = await pool.getConnection()

		const getAllProductsQuery = "SELECT * FROM Products"
		const getAllProductsValues = [userID]
		const products = await connection.query(getAllProductsQuery, getAllProductsValues)

		response.status(200).json(products)

	} catch (error) {
		response.status(500).end()
	}
}
)


router.get('/search', async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")


	try {
		const searchQuery = request.query.q

		const connection = await pool.getConnection()

		const getSearchedProductsQuery = `SELECT * FROM Products WHERE productID != ${userID} AND productName LIKE '%${searchQuery}%'`
		const searchedProducts = await connection.query(getSearchedProductsQuery)

		if (searchedProducts.length == 0) {
			response.status(404).end()
		} else {
			response.status(200).json(searchedProducts)
		}

	} catch {
		// add catch
	}
})

//----------------------- products ----------------------


router.get("/:id", async function (request, response) {

	try {
		const otherProductID = parseInt(request.params.id)

		const connection = await pool.getConnection()

		const productQuery = "SELECT * FROM Products WHERE productID = ?"



		const productValue = [parseInt(otherProductID)]

		const productToSend = await connection.query(productQuery, productValue)

		const product = productToSend[0]
		var productIsInWishList = false

		try {

			const userID = request.get("UserID")

			const getWishListIDQuery = "SELECT wishListID FROM WishList WHERE userID = ?"
			const getWishListIDValue = [userID]

			const fetchedWishListID = await connection.query(getWishListIDQuery, getWishListIDValue)

			if (fetchedWishListID.length != 0) {
				const wishListID = fetchedWishListID[0].wishListID
				console.log("wishListID is: " + wishListID)

				const getWishListProductQuery = "SELECT * FROM WishListProduct WHERE wishListID = ? AND productID = ?"
				const getWishListProductValues = [wishListID, productValue]

				const result = await connection.query(getWishListProductQuery, getWishListProductValues)

				console.log("result is: " + result)
				if (result.length != 0) {
					console.log("found the product")
					productIsInWishList = true
				}

			}

		} catch (error) {

			console.log(error)
			response.status(500)
		}


		const model = {
			product,
			productIsInWishList
		}

		console.log(model)

		response.status(200).json(model)
	} catch (error) {
		response.status(500).end()
	}
})


router.get("/:id/update", async function (request, response) {


	try {
		const anotherProductID = parseInt(request.params.id)

		const connection = await pool.getConnection()

		const productQuery = "SELECT * FROM Products WHERE productID = ?"

		const productValue = [parseInt(anotherProductID)]

		const productToSend = await connection.query(productQuery, productValue)

		response.status(200).json(productToSend)
	} catch (error) {
		response.status(500).end()
	}
})

//----------------------- Delete products ----------------------


router.get("/:id/delete", async function (request, response) {

	try {
		const productID = parseInt(request.params.id)
		const connection = await pool.getConnection()
		const productQuery = "SELECT * FROM Products WHERE productID = ?"
		const productValue = [parseInt(productID)]
		const productToSend = await connection.query(productQuery, productValue)

		response.status(200).json(productToSend)
	} catch (error) {
		response.status(500).end()
	}
})

router.delete("/:id/delete", async function (request, response) {

	const productID = parseInt(request.params.id)

	try {
		const connection = await pool.getConnection()

		const deleteProductQuery = "DELETE FROM Products WHERE productID = ?"
		const deleteProductValues = [productID]

		await connection.query(deleteProductQuery, deleteProductValues)

		response.status(200).end()
	} catch (error) {
		response.status(500).end()
	}
})


//----------------------- Update products ----------------------

router.put("/:id/update", async function (request, response) {
	console.log("WE ARE HERE!!!!")
	const anotherProductID = parseInt(request.params.id)
	const newProductName = request.body.NewProductName
	const newProductDescription = request.body.NewProductDescription

	try {
		const connection = await pool.getConnection()
		console.log("Connection established successfully")
		console.log(anotherProductID)
		console.log(newProductName)
		console.log(newProductDescription)

		const updateProductQuery = "UPDATE Products SET productName = ?, description = ? WHERE productID = ?"
		const updateProductValues = [newProductName, newProductDescription, anotherProductID]

		await connection.query(updateProductQuery, updateProductValues)
		console.log("Product updated successfully")

		response.status(200).end()

	} catch (error) {
		console.log("Error updating product: ", error)
		response.status(500).end()
	}
})

router.post("/", async function (request, response) {

	const product = request.body
	try {
		const connection = await pool.getConnection()

		const createProductQuery = "INSERT INTO Products (productName, description) VALUES (?, ?)"
		const createProductValues = [product.productName, product.description]

		await connection.query(createProductQuery, createProductValues)

		response.status(201).end()
	} catch (error) {
		response.status(500).end()
	}
})