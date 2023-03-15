//import express from 'express'
const express = require('express')
const { createPool } = require ('mariadb')



const bcrypt = require('bcrypt');

// The password you want to hash
const jockePassword = 'acb231';
const ellenPassword = 'ellen123';
const nissePassword = 'Nasse1';

// ------------- jocke ---------------------
// Generate a salt with 12 rounds
bcrypt.genSalt(12, (err, salt) => {
  if (err) {
    throw err;
  }
  // Hash the password using the generated salt
  bcrypt.hash(jockePassword, salt, (err, hash) => {
    if (err) {
      throw err;
    }
    // Store the hashed password in the database
    console.log(`The jocke hashed password is: ${hash}`);
  });
});

// ------------- ellen ---------------------
// Generate a salt with 12 rounds
bcrypt.genSalt(12, (err, salt) => {
	if (err) {
	  throw err;
	}
	// Hash the password using the generated salt
	bcrypt.hash(ellenPassword, salt, (err, hash) => {
	  if (err) {
		throw err;
	  }
	  // Store the hashed password in the database
	  console.log(`The hashed ellen password is: ${hash}`);
	});
  });

  // ------------- nisse ---------------------
  // Generate a salt with 12 rounds
bcrypt.genSalt(12, (err, salt) => {
	if (err) {
	  throw err;
	}
	// Hash the password using the generated salt
	bcrypt.hash(nissePassword, salt, (err, hash) => {
	  if (err) {
		throw err;
	  }
	  // Store the hashed password in the database
	  console.log(`The hashed nisse password is: ${hash}`);
	});
  });


// The stored hashed password retrieved from the database
const storedPasswordHash = '$2b$10$nTl6iVkbDY7K.eBqGqbygeBZkuQJoQ1VyRNV2129YksTF0woXMdqC';

// The password entered by the user
const enteredPassword = 'mypassword';

// Compare the entered password with the stored hashed password
/*bcrypt.compare(enteredPassword, storedPasswordHash, (err, result) => {
  if (err) {
    throw err;
  }
  if (result === true) {
    console.log('The passwords match!');
  } else {
    console.log('The passwords do not match!');
  }
});*/


const pool = createPool({
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
})

/*const pool = createPool({
	host: "localhost",
	port: 5555,
	username: "root",
	password: "abc123",
	database: "abc",
})*/

pool.on('error', function(error){
	console.log("Error from pool", error)
})

const app = express()

app.get("/humans", async function(request, response){
	
	console.log("Hello there hi")
	
	try{
		
		const connection = await pool.getConnection()
		
		const query = "SELECT * FROM humans ORDER BY name"
		
		const humans = await connection.query(query)
		
		response.status(200).json(humans)
		
	}catch(error){
		console.log(error)
		response.status(500).end()
	}
	
})

app.get("/", function(request, response){
	response.send("It works")
})

app.listen(8080)