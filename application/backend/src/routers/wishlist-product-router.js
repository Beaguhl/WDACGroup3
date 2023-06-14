const express = require("express");
const { pool, authenticateAndAuthorize } = require("../context")
const router = express.Router();

pool.on("error", function (error) {
    console.log("Error from pool", error);
});

module.exports = router;

//------------------- purchase --------------------
router.patch("/:id/purchase", async function (request, response) {
    let connection
    const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

    try {
        connection = await pool.getConnection()

        authenticateAndAuthorize(accessToken)
            .then(async userID => {
                const id = parseInt(request.params.id);
                const updatePurchasedQuery =
                    "UPDATE WishListProducts SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?";
                const updatePurchasedValues = [true, userID, id];

                await connection.query(updatePurchasedQuery, updatePurchasedValues);

                response.status(200).end();
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

//------------------- undo purchase --------------------
router.patch("/:id/undo-purchase", async function (request, response) {
    let connection
    const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

    try {
        connection = await pool.getConnection()

        authenticateAndAuthorize(accessToken)
            .then(async userID => {
                const id = parseInt(request.params.id);
                
                const getUserPurchasedQuery =
                    "SELECT userPurchased FROM WishListProducts WHERE wishListProductID = ?";
                const getUserPurchasedValues = [id];

                const userPurchasedID = await connection.query(
                    getUserPurchasedQuery,
                    getUserPurchasedValues
                );

                if (userPurchasedID[0].userPurchased == userID) {
                    const updatePurchasedQuery =
                        "UPDATE WishListProducts SET purchased = ?, userPurchased = ? WHERE wishListProductID = ?";
                    const updatePurchasedValues = [false, null, id];

                    await connection.query(updatePurchasedQuery, updatePurchasedValues);

                    response.status(200).end();
                } else {
                    response.status(403).end();
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

//------------------- add product to my wishlist --------------------
router.post("/:id", async function (request, response) {
    let connection
    const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

    try {
        connection = await pool.getConnection()

        authenticateAndAuthorize(accessToken)
            .then(async userID => {
                const productID = parseInt(request.params.id);

                const getWishListIDQuery = "SELECT wishListID FROM WishLists WHERE userID = ?";
                const getWishListIDValue = [userID];

                const fetchedWishListID = await connection.query(getWishListIDQuery, getWishListIDValue);

                if (fetchedWishListID != null) {
                    const wishListID = fetchedWishListID[0].wishListID;

                    const addProductQuery =
                        "INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (?, ?, ?, ?)";
                    const addProductValues = [productID, wishListID, false, null];

                    await connection.query(addProductQuery, addProductValues);
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
