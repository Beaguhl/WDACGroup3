
CREATE TABLE IF NOT EXISTS Users (
	userID INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(24),
	password CHAR(60),
	admin BOOLEAN
);


INSERT INTO Users (username, password, admin)
VALUES ("jocke", "$2b$12$8OEo/.3aeIJXnz1CviYSdevFwYtFAQXfHyGSewYy4oacVU5R4KjcS", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("ellen", "$2b$12$eXGwfoAHUOiUX7KkhFhKQezMlpXGRGpYE137r2kYwWGNrQmSyv5wm", TRUE);
INSERT INTO Users (username, password, admin)
VALUES ("nisse", "$2b$12$RKGQ6juzBi7GyPkEAjTHeObnAcRV973C1f7vU4H4LgPMOPu/W/6Vq", FALSE);


CREATE TABLE IF NOT EXISTS Follow (
	followID INT PRIMARY KEY AUTO_INCREMENT,
	userID INT,
	followingUserID INT,
	FOREIGN KEY (userID) REFERENCES User(userID),
	FOREIGN KEY (followingUserID) REFERENCES User(userID)
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
	FOREIGN KEY (userID) REFERENCES User(userID)
);

INSERT INTO WishList (userID) VALUES (1);
INSERT INTO WishList (userID) VALUES (2);
INSERT INTO WishList (userID) VALUES (3);

CREATE TABLE IF NOT EXISTS Product (
	productID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productName VARCHAR(20) NOT NULL,
	description VARCHAR(50) NOT NULL
);

INSERT INTO Product (productName, description) VALUES ("fanta", "en annan god dricka");
INSERT INTO Product (productName, description) VALUES ("Loka", "en god dricka");

CREATE TABLE IF NOT EXISTS WishListProduct (
	productID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	wishListID INT NOT NULL,
	purchased Boolean NOT NULL, 
	userPurchased INT,
	FOREIGN KEY (wishListID) REFERENCES WishList(wishListID)
);

INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (1, 1, FALSE, NULL);
INSERT INTO WishListProduct (productID, wishListID, purchased, userPurchased) VALUES (2, 2, FALSE, NULL);






