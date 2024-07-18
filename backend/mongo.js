const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_CONNECTION_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    noteNum: Number,
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
const createAndSaveNote = async (noteNum) => {
  const note = new Note({
    noteNum: noteNum,
    title: `Note ${noteNum}`,
    author: {
      name: `Author ${noteNum}`,
      email: `author${noteNum}@example.com`
    },
    content: `HTML is easy ${noteNum}`
  });

  try {
    const savedNote = await note.save();
    console.log(`Note ${savedNote.noteNum} saved!`);
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