const express = require("express");
const { pool, authenticateAndAuthorize } = require("../context")
const router = express.Router();

pool.on("error", function (error) {
    console.log("Error from pool", error);
});

module.exports = router;

//---------------------- get specific wishlist --------------
router.get("/:id", async function (request, response) {
    let connection
    const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

    try {
        connection = await pool.getConnection()

        authenticateAndAuthorize(accessToken)
            .then(async userID => {
                const id = parseInt(request.params.id);
                const getWishListQuery = "SELECT * FROM WishLists WHERE userID = ?";
                const getWishListValue = [id];

                const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue);
                const wishListID = fetchedWishlistID[0].wishListID;

                const getWishListProductsQuery = "SELECT * FROM WishListProducts WHERE wishListID = ?";
                const getWishListProductsValue = [wishListID];
                const wishListProducts = await connection.query(
                    getWishListProductsQuery,
                    getWishListProductsValue
                );

                var products = [];

                for (let i = 0; i < wishListProducts.length; i += 1) {

                    const getProductQuery = "SELECT * FROM Products WHERE productID = ?";
                    const wishListProductID = wishListProducts[i].productID;
                    const getProductValue = [wishListProductID];

                    const product = await connection.query(getProductQuery, getProductValue);
                    products.push([product[0], wishListProducts[i]]);
                }
                response.status(200).json(products);
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

//-------------------- search through wishlist -----------------
router.get("/:id/search", async function (request, response) {
    let connection
    const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

    try {
        connection = await pool.getConnection()

        authenticateAndAuthorize(accessToken)
            .then(async () => {
                const id = parseInt(request.params.id);
                const searchQuery = request.query.q;

                const getWishListQuery = "SELECT * FROM WishLists WHERE userID = ?";
                const getWishListValue = [id];

                const fetchedWishlistID = await connection.query(getWishListQuery, getWishListValue);
                const wishListID = fetchedWishlistID[0].wishListID;

                const getProductsQuery = `SELECT * FROM Products WHERE productName LIKE '%${searchQuery}%'`;

                const searchedProducts = await connection.query(getProductsQuery);
                var searchResults = [];

                for (let i = 0; i < searchedProducts.length; i += 1) {
                    const getWishListProductsQuery =
                        "SELECT * FROM WishListProducts WHERE productID = ? AND wishListID = ?";
                    const getWishListProductsValue = [searchedProducts[i].productID, wishListID];
                    const wishListProduct = await connection.query(
                        getWishListProductsQuery,
                        getWishListProductsValue
                    );

                    if (wishListProduct.length != 0) {
                        let arrLenght = searchResults.length;
                        searchResults[arrLenght] = [searchedProducts[i], wishListProduct[0]];
                    }
                }

                if (searchResults.length == 0) {
                    response.status(404).end();
                } else {
                    response.status(200).json(searchResults);
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
