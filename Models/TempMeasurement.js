const mongoose = require('mongoose')

const tempMeasurementSchema = new mongoose.Schema({
  sensor: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  date: Date,
})

tempMeasurementSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

const TempMeasurement = new mongoose.model(
  'TempMeasurement',
  tempMeasurementSchema
)


module.exports = TempMeasurement
