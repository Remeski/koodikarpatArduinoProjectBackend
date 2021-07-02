const mongoose = require('mongoose')

const colorValidator = v => {
  return /^#([0-9a-f]{3}){1,2}$/i.test(v)
}

const messageSchema = new mongoose.Schema({
  row1: {
    type: String,
    maxLength: 5,
    required: true,
  },
  row2: {
    type: String,
    maxLength: 5,
    required: true,
  },
  colour: {
    type: String,
    validate: [colorValidator, 'Invalid color'],
    required: true,
  },
  /*text: {
    type: String,
    maxLength: 7,
    required: true,
  },
  size: {
    type: Number,
    max: 3,
    required: true,
  },*/
  isShown: { type: Boolean, default: false },
})

messageSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj.isShown
    delete obj.date
    delete obj._id
    delete obj.__v
  },
})

const Message = new mongoose.model('Message', messageSchema)

module.exports = Message
