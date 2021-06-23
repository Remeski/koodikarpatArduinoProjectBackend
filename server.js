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

app.get('/', (req, res) => {
  res.send('Server here')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
