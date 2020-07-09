const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

//Support json encoded bodies
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

//Settings
app.set('port', process.env.PORT || 4000)
app.use(express.json())

//Routes
app.use(require('./routes/auth'))
app.use('/listas', require('./routes/listas'))
app.use('/tareas', require('./routes/tareas'))

//Start Server
app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'))
})

