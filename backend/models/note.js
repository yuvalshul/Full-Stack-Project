const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_CONNECTION_URL

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const noteSchema = new mongoose.Schema({
    noteNumber: Number,
    title: String,
    author: {
    name: String,
    email: String,
    },
    content: String,
   })

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)