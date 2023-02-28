/*CREATE TABLE IF NOT EXISTS User (
	userID INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(24),
	password VARBINARY(255),
	admin BOOLEAN,
	userImage TEXT
);*/

/*INSERT INTO User (username, password, admin, userImage)
VALUES ("Olle", SHA2("ellen123", 256), TRUE, "https://i.dummyjson.com/data/products/12/4.jpg");*/

/*CREATE TABLE IF NOT EXISTS Follow (
	followerID INT,
	publisherID INT,
	PRIMARY KEY (followerID, publisherID),
	FOREIGN KEY (followerID) REFERENCES User(userID),
	FOREIGN KEY (publisherID) REFERENCES User(userID)
	
);*/

/*INSERT INTO Follow (followerID, publisherID) VALUES (2, 4);*/

/*CREATE TABLE IF NOT EXISTS WishList (
	wishListID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	userID INT,
	FOREIGN KEY (userID) REFERENCES User(userID)
);*/

/*INSERT INTO WishList (userID) VALUES (1);
INSERT INTO WishList (userID) VALUES (2);*/

/*CREATE TABLE IF NOT EXISTS Product (
	productID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	productName VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	description TEXT NOT NULL,
	image TEXT NOT NULL DEFAULT "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg",
	link TEXT
);*/

/*INSERT INTO Product (productName, price, description)
VALUES ("Loka", 99, "en god dricka")*/


/*CREATE TABLE IF NOT EXISTS WishListProduct (
	wishListID INT NOT NULL,
	productID INT NOT NULL,
	purchased INT DEFAULT NULL,
	PRIMARY KEY (wishListID, productID),
	FOREIGN KEY (wishListID) REFERENCES WishList(wishListID),
	FOREIGN KEY (productID) REFERENCES Product(productID),
	FOREIGN KEY (purchased) REFERENCES User(userID)
);*/

INSERT INTO WishListProduct (wishListID, productID)
VALUES (1, 1);

INSERT INTO WishListProduct (wishListID, productID, purchased)
VALUES (2, 3, 1);



