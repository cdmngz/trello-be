require('dotenv').config({path:__dirname+'/./.env'})

const mysql = require('mysql')
const { promisify } = require('util')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

pool.getConnection((err, conn) => {
    if(err) throw err;
    if(conn) conn.release()
    console.log('DB is connected')
    return
})

//Cada vez que se haga un pool.query este será una promesa
pool.query = promisify(pool.query)

module.exports = pool