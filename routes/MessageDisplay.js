const Message = require('../Models/Message')
const TempMeasurement = require('../Models/TempMeasurement')

const router = require('express').Router()

const SHOWNMESSAGES = []
const SHOWNMESSAGES_LIMIT = 5

// GET /messagedisplay/
router.get('/', async (req, res) => {
  try {
    let message

    let messages = await Message.find({ isShown: false })
    if (messages.length < 1) {
      messages = await Message.find({})
    }

    const randomNum = Math.floor(Math.random() * messages.length)
    message = messages[randomNum]

    SHOWNMESSAGES.push(message.id)

    res.json(message)
    await Message.findByIdAndUpdate(message.id, { isShown: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /messagedisplay/
router.post('/', (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'Invalid body' })
  }

  const message = new Message({
    text,
    date: new Date(),
  })

  message
    .save()
    .then(result => {
      res.status(201).end()
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
})

module.exports = router
