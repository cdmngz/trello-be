require('dotenv').config({path:__dirname+'/./../.env'})

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const pool = require('../database')

router.get('/', getUser, async (req, res) => {
    const user_id = req.user.id
    console.log(user_id)
    try {
        const results = await pool.query(`SELECT * FROM listas WHERE user_id = "${user_id}" AND status = 1`)
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.get('/:id', getUser, getLista, (req, res) => {
    res.json(res.lista)
})

router.post('/', getUser, async (req, res) => {
    try {
        const user_id = req.user.id
        const { title, description } = req.body
        await pool.query(`INSERT INTO listas (title, description, user_id) VALUES ("${title}", "${description}", "${user_id}")`)
        res.status(201).json('Lista Creada')
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/editar/:id', getUser, getLista, async (req, res) => {
    const { title, description } = req.body
    const { id } = res.lista[0]
    try {
        await pool.query(`UPDATE listas SET title = "${title}", description = "${description}" WHERE id = "${id}"`)    
        res.status(202).json('Lista updated')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
})

router.patch('/eliminar/:id', async (req, res) => {
    const { id } = req.params
    const status = false
    try {
        await pool.query(`UPDATE listas SET status = "${status}" WHERE id = "${id}"`)    
        res.status(202).json('Lista blured.')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
})

async function getLista (req, res, next) {
    const user_id = req.user.id
    let lista
    const { id } = req.params
    try {
        lista = await pool.query(`SELECT * FROM listas WHERE id = ${id} AND user_id = ${user_id}`)
        if(lista.length===0) {
            return res.status(404).json({ message: "Cannot find lista" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.lista = lista
    next()
}

async function getUser (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_ACCESS, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = router