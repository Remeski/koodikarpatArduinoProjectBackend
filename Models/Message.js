const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    maxLength: 12,
    required: true,
  },
  date: Date,
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
