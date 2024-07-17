require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const Note = require('./models/note')
const jwt = require('jsonwebtoken')

const logFilePath = path.join(__dirname, 'log.txt')

//middleware logger function
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

const unknownEndpoint = (request, response) => {
  console.log("unknownEndpoint")
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())

app.use(cors())

app.use(requestLogger)





//NOTES

//GET all notes
app.get('/notes', (req, response) => {
  const currentPage = parseInt(req.query._page) || 1;
  const perPage = parseInt(req.query._per_page) || 10;
  Note.find({}).skip((currentPage - 1) * perPage).limit(perPage)
  .then(notesRes => {
    Note.countDocuments()
        .then(count => {
          console.log({ notesRes, count });
          response.status(200).json({ notesRes, count });
        })
        .catch (error => response.status(500).json({ error }));
    })
    .catch (error => response.status(500).json({ error }));
})


//GET note by id
app.get('/notes/:id', (request, response) => {
  Note.findOneAndDelete({ id: parseInt(request.params.id) })
  .then(note => {
    if (!note)
      return (response.status(404).json({ error }));
    else
      response.status(200).json(note)
  })
  .catch (error => response.status(404).json({ error }));
})

// Function to generate new id based on the last document in the collection
const generateId = () => {
  return Note.findOne().sort({ id: -1 }).exec()
    .then(lastNote => {
      if (lastNote) {
        return lastNote.id + 1;
      } else {
        return 1; // If no notes exist yet, start from 1
      }
    })
    .catch (error => response.status(500).json({ error }));
};

//POST
app.post('/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: 'Content missing' });
  }

  generateId()
    .then(id => {
      return User.findById(body.userId)
        .then(user => {
          if (!user) {
            throw new Error('User not found');
          }
          const note = new Note({
            id: id,
            title: body.title,
            author: {
              name: body.author ? body.author.name : '',
              email: body.author ? body.author.email : ''
            },
            content: body.content,
            user: user._id
          });
          return note.save()
            .then(savedNote => {
              user.notes = user.notes.concat(savedNote._id);
              return user.save()
                .then(() => savedNote); // Ensure savedNote is returned
            });
        });
    })
    .then(savedNote => {
      response.status(201).json(savedNote);
    })
      .catch (error => response.status(500).json({ error }));
});

//DELETE note by id
app.delete('/notes/:id', (request, response) => {
  Note.find({}).skip((parseInt(request.params.id)) - 1).exec()
  .then(notes => {
    if (!notes) {
      return (response.status(500).json({ error }))
    }
    return Note.findByIdAndDelete(notes[0]._id);
  })
  .then(() => {
    response.status(204).end();
  })
  .catch (error => response.status(404).json({ error }));
})

//PUT (upadte)
app.put('/notes/:id', (request, response) => {
  const { content } = request.body;
  Note.find({}).skip((parseInt(request.params.id)) - 1).exec()
  .then(notes => {
    if (!notes) {
      return response.status(404).json({ error })
    }
    return Note.findOneAndUpdate(
      { _id: notes[0]._id },
      { content },
      { new: true, runValidators: true, context: 'query' }
    );
  })
  .then(updatedNote => {
    if (!updatedNote) {
      return response.status(500).json({ error });
    }
    response.status(201).json(updatedNote);
  })
  .catch (error => response.status(404).json({ error }));
})





//USERS

//Get all users
app.get('/users', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

//Add a new user
app.post('/users', async (request, response) => {
  const { name, email, username, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    email,
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})




//LOGIN
app.post('/login', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})




app.use(unknownEndpoint)

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.log(err.message));