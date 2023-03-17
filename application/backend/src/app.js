//import express from 'express'
const express = require('express')
const { createPool } = require ('mariadb')
//import { renderToString } from 'svelte/ssr';



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

//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
const pool = createPool({
	host: "db",
	port: 3306,
	user: "root",
	password: "abc123",
	database: "abc",
})

pool.on('error', function(error){
	console.log("Error from pool", error)
})



/*const users = [{
    id: 1,
    username: "fakeJocke"
}, {
    id: 2,
    username: "fakeEllen"
}, {
    id: 3,
    username: "fakeNisse"
}]*/


const app = express()

app.use(express.json())

app.use(function(request, response, next){
	response.set("Access-Control-Allow-Origin", "http://localhost:5173")
	response.set("Access-Control-Allow-Methods", "*")
	response.set("Access-Control-Allow-Headers", "*")
	response.set("Access-Control-Expose-Headers", "*")

	next()
})

app.get("/", function(request, response){
	response.send("It works")
})

app.get("/users", async function(request, response){	
	try{
		const connection = await pool.getConnection()
		
		const query = "SELECT * FROM Users"
		const users = await connection.query(query)

		response.status(200).json(users)
		
	} catch(error) {
		console.log(error)
		response.status(500).end() // 500 = server error
	}
	
})

app.get("/user/:id", async function(request, response){
	const id = parseInt(request.params.id)

	try {
		const connection = await pool.getConnection()

		const query = "SELECT * FROM Users WHERE userID = ?"
		const values = [id]
		const user = await connection.query(query, values)

		response.status(200).json(user)

	} catch(error) {
		console.log(error)
		response.status(404).end()
	}

})



//app.listen(8080)
app.listen(8080, () => {
	console.log('Server started on port 8080')
  })