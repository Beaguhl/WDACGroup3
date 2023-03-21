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


router.get("/", async function (request, response) {

	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const userID = request.get("UserID")


	try {
		const connection = await pool.getConnection()

		const getAllProductsQuery = "SELECT * FROM Products"
		const getAllProductsValues = [userID]
		const products = await connection.query(getAllProductsQuery, getAllProductsValues)

		console.log("products are-__ " + products[1])
		response.status(200).json(products)

	} catch (error) {
		console.log(error)
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
		console.log("search useds inside: " + searchedProducts)

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
	console.log("går in i products id")


	try {
		const otherProductID = parseInt(request.params.id)
		console.log("other procut är: " + otherProductID)

		const connection = await pool.getConnection()
		console.log("har connectat")

		const productQuery = `SELECT * FROM Products WHERE productID = ${parseInt(otherProductID)}`
		console.log("har 1")

		const productToSend = await connection.query(productQuery)
		console.log("procudt to send is: " + productToSend)

		console.log("HÄR ÄR PRODUCTTOSEND!!!!! " + productToSend)
		console.log("HÄR ÄR PRODUCTTOSEND!!!!! ")

		const procuct = productToSend[0]

		console.log("HAUHDFJHWJLAHLJF " + procuct)

		const model = {
			procuct
		}

		response.status(200).json(model)
	} catch (error) {
		response.status(500).end()
	}
})