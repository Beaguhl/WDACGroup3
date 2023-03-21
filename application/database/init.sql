
CREATE TABLE IF NOT EXISTS Users (
	userID INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(24),
	password CHAR(60),
	admin BOOLEAN
);


INSERT INTO Users (username, password, admin)
VALUES ("jocke", "$2b$12$SxN/g01Ktw4BVmaPGsE0q.94UoRtYI/QvPlwkyheUgkHnubxI90vm", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("ellen", "$2b$12$WsKB6biwEx.IE07bKf.XHOBtWDvSCEShh01ymS/.3DsZ9/DmuIyXq", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("nisse", "$2b$12$h1W/m.Ut5L99..OaZNaYcelKI/6jT.VbAT2CKkI2arM.jG57D9DNK", FALSE);


CREATE TABLE IF NOT EXISTS Follow (
	followID INT PRIMARY KEY AUTO_INCREMENT,
	userID INT,
	followingUserID INT,
	FOREIGN KEY (userID) REFERENCES Users(userID),
	FOREIGN KEY (followingUserID) REFERENCES Users(userID)
);

INSERT INTO Follow (userID, followingUserID)
VALUES (2, 1);
INSERT INTO Follow (userID, followingUserID)
VALUES (1, 2);
INSERT INTO Follow (userID, followingUserID)
VALUES (2, 3);
INSERT INTO Follow (userID, followingUserID)
VALUES (3, 1);
INSERT INTO Follow (userID, followingUserID)
VALUES (3, 2);

CREATE TABLE IF NOT EXISTS WishList (
	wishListID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	userID INT,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

INSERT INTO WishList (userID) VALUES (1);
INSERT INTO WishList (userID) VALUES (2);
INSERT INTO WishList (userID) VALUES (3);

CREATE TABLE IF NOT EXISTS Products (
	productID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productName VARCHAR(20) NOT NULL,
	description VARCHAR(50) NOT NULL
);

INSERT INTO Products (productName, description) VALUES ("fanta", "en annan god dricka");
INSERT INTO Products (productName, description) VALUES ("Loka", "en god dricka");

CREATE TABLE IF NOT EXISTS WishListProduct (
	wishListProductID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productID INT NOT NULL,
	wishListID INT NOT NULL,
	purchased Boolean NOT NULL, 
	userPurchased INT,
	FOREIGN KEY (wishListID) REFERENCES WishList(wishListID),
	FOREIGN KEY (productID) REFERENCES Products(productID)
);

INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (1, 1, FALSE, NULL);
INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (2, 2, FALSE, NULL);






