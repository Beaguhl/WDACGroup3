const express = require("express");
const { pool, authenticateAndAuthorize } = require("../context.js");
const router = express.Router();
const { validateProductErrors, validateNewProduct } = require("../product-validations");

module.exports = router;

pool.on("error", function (error) {
	console.log("Error from pool", error);
});

//----------------------- get all Products ----------------------
router.get("/", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
			.then(async () => {
				const getAllProductsQuery = "SELECT * FROM Products";
				const products = await connection.query(getAllProductsQuery)

				response.status(200).json(products)
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------------- search Products ----------------------
router.get("/search", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
			.then(async () => {
				const searchQuery = request.query.q

				const getSearchedProductsQuery = `SELECT * FROM Products WHERE productName LIKE '%${searchQuery}%'`
				const searchedProducts = await connection.query(getSearchedProductsQuery)

				if (searchedProducts.length == 0) {
					response.status(404).end()
				} else {
					response.status(200).json(searchedProducts);
				}
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------------- products ----------------------
router.get("/:id", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
			.then(async userID => {
				const otherProductID = parseInt(request.params.id);

				const productQuery = "SELECT * FROM Products WHERE productID = ?";

				const productValue = [parseInt(otherProductID)];

				const productToSend = await connection.query(productQuery, productValue);

				const product = productToSend[0];
				var productIsInWishList = false;

				try {
					const getWishListIDQuery = "SELECT wishListID FROM WishLists WHERE userID = ?";
					const getWishListIDValue = [userID];

					const fetchedWishListID = await connection.query(
						getWishListIDQuery,
						getWishListIDValue
					);

					if (fetchedWishListID.length != 0) {
						const wishListID = fetchedWishListID[0].wishListID;

						const getWishListProductsQuery =
							"SELECT * FROM WishListProducts WHERE wishListID = ? AND productID = ?";
						const getWishListProductsValues = [wishListID, productValue];

						const result = await connection.query(
							getWishListProductsQuery,
							getWishListProductsValues
						);

						if (result.length != 0) {
							productIsInWishList = true;
						}
					}
				} catch (error) {
					console.log(error);
					response.status(500);
				} finally {
					if (connection) {
						connection.release();
					}
				}

				const model = {
					product,
					productIsInWishList,
				};

				response.status(200).json(model);
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------------- Delete product ----------------------
router.delete("/:id", async function (request, response) {
	let connection;
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()
		
		authenticateAndAuthorize(accessToken)
			.then(async () => {
				const productID = parseInt(request.params.id);
				const deleteProductQuery = "DELETE FROM Products WHERE productID = ?";
				const deleteProductValues = [productID];

				await connection.query(deleteProductQuery, deleteProductValues);

				response.status(204).end();
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------------- Update product ----------------------
router.put("/:id", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
			.then(async () => {
				const anotherProductID = parseInt(request.params.id);
				const newProductName = request.body.NewProductName;
				const newProductDescription = request.body.NewProductDescription;

				const productErrors = await validateProductErrors(newProductName, newProductDescription)

				if (productErrors.length > 0) {
					response.status(400).json({ productErrors });
				} else {
					const updateProductQuery =
						"UPDATE Products SET productName = ?, description = ? WHERE productID = ?";
					const updateProductValues = [newProductName, newProductDescription, anotherProductID];

					await connection.query(updateProductQuery, updateProductValues);

					response.status(200).end();
				}
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
});

//----------------------- Create product ----------------------
router.post("/", async function (request, response) {
	let connection
	const authorizationHeaderValue = request.get("Authorization")
	console.log("auth is:", authorizationHeaderValue)
	const accessToken = authorizationHeaderValue.substring(7)

	try {
		connection = await pool.getConnection()

		authenticateAndAuthorize(accessToken)
			.then(async () => {
				
				const product = request.body;
				const validationArr = await validateNewProduct(product.productName, product.description)
				
				if (validationArr.length > 0){
					response.status(400).json(validationArr);
					return;

				} else {
					const createProductQuery = "INSERT INTO Products (productName, description) VALUES (?, ?)";
					const createProductValues = [product.productName, product.description];

					await connection.query(createProductQuery, createProductValues);

					response.status(201).end();
				}
			})
			.catch(error => {
				console.error(error)
				response.send(401).end()
			});

	} catch (error) {
		console.log(error);
		response.status(500).end();
	} finally {
		if (connection) {
			connection.release();
		}
	}
	
});
