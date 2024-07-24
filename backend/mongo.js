const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_CONNECTION_URL

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
*/




// Function to create and save a new note
const createAndSaveNote = async (id) => {
  const note = new Note({
    id: id,
    title: `Note ${id}`,
    author: {
      name: `Yuval`,
      email: 'yuval2@gmail.com'
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

// Loop to create and save notes with given indices
const createNotes = async () => {
  for (let i = 25; i <= 55; i++) {
    await createAndSaveNote(i);
  }
  mongoose.connection.close();
};

createNotes();
