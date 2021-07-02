const Message = require('../Models/Message')
const TempMeasurement = require('../Models/TempMeasurement')

const router = require('express').Router()
const NodeCache = require('node-cache')
const messageCache = new NodeCache()

// GET /messagedisplay/
router.get('/', async (req, res) => {
  const randomMessage = messages => {
    const randomNum = Math.floor(Math.random() * messages.length)
    const message = messages[randomNum]
    return message
  }

  const handleMessages = async messages => {
    if (messages.length < 1) {
      return res.status(404).json({ error: 'No messages found' })
    }
    const message = randomMessage(messages)
    messageCache.set('lastMessage', message.id)

    await Message.findByIdAndUpdate(message.id, { isShown: true })

    return res.json(message)
  }

  try {
    const messages = await Message.find({ isShown: false })
    if (messages.length < 1) {
      const messages = await Message.find({
        _id: { $ne: messageCache.get('lastMessage') },
      })
      return handleMessages(messages)
    }
    handleMessages(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /messagedisplay/
router.post('/', (req, res) => {
  //const { text, size } = req.body

  const { row1, row2, colour } = req.body

  if (!row1 || !row2 || !colour) {
    return res.status(400).json({ error: 'Invalid body' })
  }

  const message = new Message({
    row1,
    row2,
    colour,
  })

  message
    .save()
    .then(result => {
      res.status(201).end()
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    })
})

module.exports = router
