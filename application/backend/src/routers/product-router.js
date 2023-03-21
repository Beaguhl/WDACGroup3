const express = require('express')

const router = express.Router()
const { createPool } = require ('mariadb')

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

module.exports = router

const app = express()