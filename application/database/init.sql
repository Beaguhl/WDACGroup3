
CREATE TABLE IF NOT EXISTS User (
	userID INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(24),
	password CHAR(60),
	admin BOOLEAN
);


INSERT INTO User (username, password, admin)
VALUES ("jocke", "$2b$12$8OEo/.3aeIJXnz1CviYSdevFwYtFAQXfHyGSewYy4oacVU5R4KjcS", TRUE);
INSERT INTO User (username, password, admin)
VALUES ("ellen", "$2b$12$eXGwfoAHUOiUX7KkhFhKQezMlpXGRGpYE137r2kYwWGNrQmSyv5wm", TRUE);
INSERT INTO User (username, password, admin)
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
	wishListID INT,
	productName VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	purchased Boolean, 
	userPurchased INT,
	FOREIGN KEY (wishListID) REFERENCES WishList(wishListID)
);


INSERT INTO Product (wishListID, productName, description, purchased, userPurchased) VALUES (1, "Loka", "en god dricka", FALSE, NULL);
INSERT INTO Product (wishListID, productName, description, purchased, userPurchased) VALUES (1, "Godis", "smakens", TRUE, 2);





