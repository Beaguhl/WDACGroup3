
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
INSERT INTO Users (username, password, admin)
VALUES ("jocke1", "$2b$12$SxN/g01Ktw4BVmaPGsE0q.94UoRtYI/QvPlwkyheUgkHnubxI90vm", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("ellen1", "$2b$12$WsKB6biwEx.IE07bKf.XHOBtWDvSCEShh01ymS/.3DsZ9/DmuIyXq", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("nisse1", "$2b$12$h1W/m.Ut5L99..OaZNaYcelKI/6jT.VbAT2CKkI2arM.jG57D9DNK", FALSE);
INSERT INTO Users (username, password, admin)
VALUES ("jocke2", "$2b$12$SxN/g01Ktw4BVmaPGsE0q.94UoRtYI/QvPlwkyheUgkHnubxI90vm", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("ellen2", "$2b$12$WsKB6biwEx.IE07bKf.XHOBtWDvSCEShh01ymS/.3DsZ9/DmuIyXq", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("nisse2", "$2b$12$h1W/m.Ut5L99..OaZNaYcelKI/6jT.VbAT2CKkI2arM.jG57D9DNK", FALSE);

CREATE TABLE IF NOT EXISTS Follows (
	followID INT PRIMARY KEY AUTO_INCREMENT,
	userID INT,
	followingUserID INT,
	FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
	FOREIGN KEY (followingUserID) REFERENCES Users(userID) ON DELETE CASCADE
);

INSERT INTO Follows (userID, followingUserID)
VALUES (2, 1);
INSERT INTO Follows (userID, followingUserID)
VALUES (1, 2);
INSERT INTO Follows (userID, followingUserID)
VALUES (2, 3);
INSERT INTO Follows (userID, followingUserID)
VALUES (3, 1);
INSERT INTO Follows (userID, followingUserID)
VALUES (3, 2);

CREATE TABLE IF NOT EXISTS WishLists (
	wishListID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	userID INT,
	FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

INSERT INTO WishLists (userID) VALUES (1);
INSERT INTO WishLists (userID) VALUES (2);
INSERT INTO WishLists (userID) VALUES (3);
INSERT INTO WishLists (userID) VALUES (4);
INSERT INTO WishLists (userID) VALUES (5);
INSERT INTO WishLists (userID) VALUES (6);
INSERT INTO WishLists (userID) VALUES (7);
INSERT INTO WishLists (userID) VALUES (8);
INSERT INTO WishLists (userID) VALUES (9);

CREATE TABLE IF NOT EXISTS Products (
	productID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productName VARCHAR(20) NOT NULL,
	description VARCHAR(50) NOT NULL
);

INSERT INTO Products (productName, description) VALUES ("Fanta", "Drink from orange");
INSERT INTO Products (productName, description) VALUES ("Loka", "Sparkling water");
INSERT INTO Products (productName, description) VALUES ("Phone", "Expensive thing");
INSERT INTO Products (productName, description) VALUES ("Food", "Made of vegetables");
INSERT INTO Products (productName, description) VALUES ("Jeans", "Cropped jeans");
INSERT INTO Products (productName, description) VALUES ("Coffecup", "Pink coffecup");
INSERT INTO Products (productName, description) VALUES ("Phone case", "Protects your phone");
INSERT INTO Products (productName, description) VALUES ("Cables", "Connect things");
INSERT INTO Products (productName, description) VALUES ("Cole", "Black drink");
INSERT INTO Products (productName, description) VALUES ("Eraser", "Remove your mistakes");
INSERT INTO Products (productName, description) VALUES ("Murder weapon", "Soft and cuddly");
INSERT INTO Products (productName, description) VALUES ("Drink", "Sangria");
INSERT INTO Products (productName, description) VALUES ("My little pony", "It is emo");
INSERT INTO Products (productName, description) VALUES ("Troll", "Big hair");
INSERT INTO Products (productName, description) VALUES ("Mufasa", "He is dead");
INSERT INTO Products (productName, description) VALUES ("Movie", "A dvd");

CREATE TABLE IF NOT EXISTS WishListProducts (
	wishListProductID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productID INT NOT NULL,
	wishListID INT NOT NULL,
	purchased Boolean NOT NULL, 
	userPurchased INT,
	FOREIGN KEY (wishListID) REFERENCES WishLists(wishListID) ON DELETE CASCADE,
	FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE
);

INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (1, 1, TRUE, 2);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (2, 2, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (6, 3, TRUE, 1);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (1, 3, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (4, 4, TRUE, 3);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (14, 5, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (15, 6, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (9, 1, TRUE, 2);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (3, 7, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (13, 8, TRUE, 1);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (15, 5, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (7, 3, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (3, 6, TRUE, 3);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (11, 2, FALSE, NULL);
INSERT INTO WishListProducts (productID, wishListID, purchased, userPurchased) VALUES (12, 5, FALSE, NULL);






