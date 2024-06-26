const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// GET all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET a specific note by id
router.get('/:id', getNote, (req, res) => {
    res.json(res.note);
});

// POST a new note
router.post('/', async (req, res) => {
    const note = new Note({
        content: req.body.content,
        important: req.body.important
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a note by id
router.put('/:id', getNote, async (req, res) => {
    if (req.body.content != null) {
        res.note.content = req.body.content;
    }
    if (req.body.important != null) {
        res.note.important = req.body.important;
    }
    try {
        const updatedNote = await res.note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a note by id
router.delete('/:id', getNote, async (req, res) => {
    try {
        await res.note.remove();
        res.json({ message: 'Deleted note' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getNote(req, res, next) {
    let note;
    try {
        note = await Note.findById(req.params.id);
        if (note == null) {
            return res.status(404).json({ message: 'Cannot find note' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.note = note;
    next();
}

module.exports = router;