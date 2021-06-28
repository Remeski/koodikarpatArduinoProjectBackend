const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

require('./db')()

// Middleware
app.use(express.json())
app.use(cors())

// Routing
app.use('/temperature', require('./routes/Temperature'))
app.use('/messagedisplay', require('./routes/MessageDisplay'))

app.get('/', (req, res) => {
  res.send(
    'Shhh, be quiet. This backend needs absolute silence to work to its fullest potential'
  )
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
