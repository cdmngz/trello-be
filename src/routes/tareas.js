require('dotenv').config({path:__dirname+'/./../.env'})

const express = require('express')
const router = express.Router()

const pool = require('../database')

router.get('/:id', async (req, res) => {
    const lista_id = req.params.id
    try {
        const results = await pool.query(`SELECT * FROM tareas WHERE lista_id = "${lista_id}"`)
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.post('/:id', async (req, res) => {
    try {
        const lista_id = req.params.id
        const { title } = req.body
        await pool.query(`INSERT INTO tareas (title, lista_id) VALUES ("${title}", "${lista_id}")`)
        res.status(201).json('Tarea Creada')
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/editar/:id', getLista, async (req, res) => {
    const { title } = req.body
    const { id } = res.lista[0]
    try {
        await pool.query(`UPDATE tareas SET title = "${title}" WHERE id = "${id}"`)    
        res.status(202).json('Tarea updated')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
})

router.patch('/eliminar/:id', getLista, async (req, res) => {
    const { id } = res.lista[0]
    const status = false
    try {
        await pool.query(`UPDATE tareas SET status = "${status}" WHERE id = "${id}"`)    
        res.status(202).json('Elemento Blur')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
})
router.patch('/devolver/:id', getLista, async (req, res) => {
    const { id } = res.lista[0]
    const status = 1
    try {
        await pool.query(`UPDATE tareas SET status = "${status}" WHERE id = "${id}"`)    
        res.status(202).json('Regresó a la vida')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
})

async function getLista (req, res, next) {
    let lista
    const { id } = req.params
    try {
        lista = await pool.query(`SELECT * FROM tareas WHERE id = ${id}`)
        if(lista.length===0) {
            return res.status(404).json({ message: "Cannot find lista" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.lista = lista
    next()
}

module.exports = router