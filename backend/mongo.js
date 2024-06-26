const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    'mongodb+srv://yuval:HW2@cluster0.qlmyydw.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: {
    name: String,
    email: String,
    },
    content: String,
   })

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  title: 'note4',
  author: null,
  content: 'HTML is easy',
})

Note.find({content: 'HTML is easy'}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})