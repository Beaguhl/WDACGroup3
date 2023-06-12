const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('./context')

const followersRouter = require("./routers/followers-router");
const followingsRouter = require("./routers/followings-router");
const productRouter = require("./routers/product-router");
const userRouter = require("./routers/user-router");
const myAccountRouter = require("./routers/my-account-router");
const myWishListRouter = require("./routers/wishlist-router");
const wishListproduct = require("./routers/wishlist-product-router");

const ACCESS_TOKEN_SECRET = "PN#/(dh6-.E.x-'P2";

pool.on("error", function (error) {
	console.log("Error from pool", error);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(function (request, response, next) {
	response.set("Access-Control-Allow-Origin", "http://localhost:5173");
	response.set("Access-Control-Allow-Methods", "*");
	response.set("Access-Control-Allow-Headers", "*");
	response.set("Access-Control-Expose-Headers", "*");

	next();
});

//----------------------- tokens ----------------------
app.post("/tokens", async function (request, response) {
	const grantType = request.body.grant_type;
	const username = request.body.username;
	const password = request.body.password;

	if (grantType != "password") {
		response.status(400).json({ error: "unsupported_grant_type" }).end();
		return;
	}

	try {
		const connection = await pool.getConnection()
		try {

			if (username == "" || password == "") {
				response.status(400).json({ error: "invalid_request" }).end();
				return;
			}

			const getUserQuery = "SELECT * FROM Users WHERE username = ?";
			const getUserValue = [username];

			const accounts = await connection.query(getUserQuery, getUserValue);

			if (accounts.length == 0) {
				response.status(400).json({ error: "invalid_grant" });
				return;
			} else {
				bcrypt.compare(password, accounts[0].password, (err, res) => {
					if (err) {
						throw err;
					}
					if (res !== true) {
						response.status(403).end();
					} else {
						const payload = {
							sub: `${accounts[0].userID}`,
						};

						jwt.sign(payload, ACCESS_TOKEN_SECRET, function (error, accessToken) {
							if (error) {
								response.status(500).end();
							} else {
								const payloadIDToken = {
									sub: `${accounts[0].userID}`,
									iss: `http://localhost:8080`,
									aud: `wishes.com`,
									exp: Math.floor(Date.now() / 1000) + 600,
								};

								jwt.sign(
									payloadIDToken,
									ACCESS_TOKEN_SECRET,
									function (error, id_token) {
										if (error) {
											response.status(500).end();
										} else {
											response.status(200).json({
												access_token: accessToken,
												id_token: id_token,
												type: "bearer",
												userID: accounts[0].userID,
												admin: accounts[0].admin,
											});
										}
									}
								);
							}
						});
					}
				});
			}
		} catch (error) {
			console.log(error)
			response.status(500).end();
		} finally {
			if (connection) {
				connection.release();
			}
		}
	} catch (error) {
		console.log(error)
		response.status(500)
	}
});

app.use("/followers", followersRouter);
app.use("/followings", followingsRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/my-account", myAccountRouter);
app.use("/wishlist", myWishListRouter);
app.use("/wishlist-product", wishListproduct);

app.listen(8080, () => {
	console.log("Server started on port 8080");
});
