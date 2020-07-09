require('dotenv').config({path:__dirname+'/./../.env'})

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const pool = require('../database')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {

    const { username, password } = req.body
    const passEncrypt = await bcrypt.hash(password, 10)
    
    try {
        const results = await pool.query(`SELECT username FROM users WHERE username = "${username}"`)
        if(results.length > 0) {
            res.status(409).json({ message: "Usuario ya existente" })
        } else {
            await pool.query(`INSERT INTO users (username, password) VALUES ("${username}", "${passEncrypt}")`)
            const results = await pool.query(`SELECT LAST_INSERT_ID() AS last`)
            console.log(results[0].last)
            const user = {
                id: results[0].last,
                username: results[0].username
            }
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS, { expiresIn: '1d' })
            res.status(201).json({ accessToken: accessToken })
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if(username && password) {
        try {
            const results = await pool.query(`SELECT * FROM users WHERE username = "${username}" LIMIT 1`)
            if(results.length === 0) {
                res.status(404).json('Usuario no existente')
            } else {
                if (bcrypt.compareSync(password, results[0].password)) {
                    const user = {
                        id: results[0].id,
                        username: results[0].username
                    }
                    const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS, { expiresIn: '1d' })
                    res.status(200).json({ accessToken: accessToken })
                } else {
                    res.send('Incorrect Password!')
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
})

module.exports = router