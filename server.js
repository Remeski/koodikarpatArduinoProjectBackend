const express = require('express')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

require('./db')()

// Middleware 
app.use(express.json())

// Routing
app.use('/temperature', require('./routes/Temperature'))

app.get('/', (req, res) => {
  res.send('Server here')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))