const express = require('express');
const router = express.Router();
const Note = require('../models/note');
//const { generateId } = require('../index');

// GET all notes
router.get('/', (req, res) => {
  const currentPage = parseInt(req.query._page) || 1;
  const perPage = parseInt(req.query._per_page) || 10;
    Note.find({})
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .then(notes => {
      Note.countDocuments()
          .then(count => {
            res.json({ notes, count });
          })
          .catch(error => {
            throw error; // Pass the error to the next error handler
          });
      })
    .catch (err => res.status(500).json({ message: err.message }))
});

// GET a specific note by id
router.get('/:id', (req, res) => {
  Note.findOneAndDelete({ noteNumber: parseInt(req.params.id) })
    .then(note => {
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    })
    .catch(err => res.status(500).json({ message: err.message }))
});


// Function to generate new noteNumber based on the last document in the collection
const generateId = () => {
  return Note.findOne().sort({ noteNumber: -1 }).exec()
    .then(lastNote => {
      if (lastNote) {
        return lastNote.noteNumber + 1;
      } else {
        return 1; // If no notes exist yet, start from 1
      }
    })
    .catch(error => {
      console.error('Failed to generate note number:', error);
      throw error;
    });
};


// POST a new note
router.post('/', (req, res) => {
  generateId()
  .then(noteNumber => {
    const { title, author, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is missing' });
    }
    const note = new Note({
      noteNumber,
      title,
      author,
      content
    });

    return note.save();
  })
  .then(savedNote => res.json(savedNote))
  .catch(err => res.status(500).json({ message: err.message }))
  });

// PUT update a note by id
router.put('/:id', (req, res) => {
    const { content } = req.body;
    Note.findOneAndUpdate(
      { noteNumber: req.params.id },
      { content },
      { new: true, runValidators: true }
    )
      .then(updatedNote => {
        if (!updatedNote) {
          return res.status(404).json({ error: 'Note not found' });
        }
        res.json(updatedNote);
      })
      .catch(err => res.status(500).json({ message: err.message }))
  });

// DELETE a note by id
router.delete('/:id', (req, res) => {
    Note.findOneAndDelete({ noteNumber: parseInt(req.params.id) })
    .then(deletedNote => {
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: err.message }))
});

module.exports = router;