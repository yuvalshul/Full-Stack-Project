const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_CONNECTION_URL

console.log(url)

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

/*
const deleteAllDocuments = async () => {
  try {
    const result = await Note.deleteMany({});
    console.log(`${result.deletedCount} documents were deleted.`);
  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    mongoose.connection.close();
  }
};

deleteAllDocuments();



Note.find({content: 'HTML is easy'}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
  */

// Function to create and save a new note
const createAndSaveNote = async (id) => {
  const note = new Note({
    id: id,
    title: `Note ${id}`,
    author: {
      name: `Author ${id}`,
      email: `author${id}@example.com`
    },
    content: `HTML is easy ${id}`
  });

  try {
    const savedNote = await note.save();
    console.log(`Note ${savedNote.id} saved!`);
  } catch (error) {
    console.error('Error saving note:', error);
  }
};

// Loop to create and save notes with indices from 1 to 20
const createNotes = async () => {
  for (let i = 1; i <= 54; i++) {
    await createAndSaveNote(i);
  }
  mongoose.connection.close();
};

createNotes();