const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    console.log('MongoDB connected!')
  } catch (error) {
    console.log(error)

    process.exit(1)
  }
}

module.exports = connect
