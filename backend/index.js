require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const notesRouter = require('./routes/notes')

const Note = require('./models/note')

const logFilePath = path.join(__dirname, 'log.txt')

const requestLogger = (request, response, next) => {
  const logEntry = `
  Time:    ${new Date().toISOString()}
  Method:  ${request.method}
  Path:    ${request.path}
  Body:    ${JSON.stringify(request.body)}
  -----------
  `;

  // Append the log entry to the log file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });

  next();
}

//app.use(express.static('dist'))

app.use(express.json())

app.use(cors())

app.use(requestLogger)

app.use('/notes', notesRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//GET all notes
app.get('/notes', (req, res) => {
  const currentPage = parseInt(req.query._page) || 1;
  const perPage = parseInt(req.query._per_page) || 10;
  Note.find({}).skip((currentPage - 1) * perPage).limit(perPage).then(notes => {
    Note.countDocuments()
        .then(count => {
          res.json({ notes, count });
        })
        .catch(error => {
          throw error; // Pass the error to the next error handler
        });
    })
    .catch(error => {
      next(error); // Pass the error to Express error handling middleware
    })
})

//POST
app.post('/notes', (request, response) => {
  console.log("post")
  generateId()
    .then(noteNumber => {
      const body = request.body
      if (!body.content) {
        return response.status(400).json({ 
          error: 'content is missing' 
        })
      }
      const note = new Note({
        noteNumber: noteNumber,
        title: body.title,
        author: {name: body.author.name, email: body.author.email} || { name: '', email: '' },
        content: body.content,
      })

      return note.save();
    })
      .then(savedNote => {
        response.json(savedNote)
      })
      .catch(error => next(error))
})

//DELETE note by id
app.delete('/notes/:id', (request, response) => {
  Note.findOneAndDelete({ noteNumber: parseInt(request.params.id) })
    .then(() => {
      console.log("note" + request.params.id + "was deleted successfully")
      response.status(204).end()
    })
    .catch(error => next(error))
})

//GET note by id
app.get('/notes/:id', (request, response) => {
  Note.findOneAndDelete({ noteNumber: parseInt(request.params.id) })
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

//PUT (upadte)
app.put('/notes/:id', (request, response) => {
  const { content } = request.body;

  Note.findOneAndUpdate(
    { noteNumber: request.params.id },
    { content },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      if (!updatedNote) {
        return response.status(404).json({ error: 'Note not found' });
      }
      response.json(updatedNote);
    })
    .catch(error => console.log(error))
})


mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT;
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.log(err.message));
