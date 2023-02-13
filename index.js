require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

function generateId() {
  return Math.floor(Math.random() * 100000000000)
}

// GET INFO
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>
  `)
})

// GET ALL PERSONS
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// GET PERSON
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => {
    return p.id === id
  })

  if (!person) {
    return res.status(404).json({
      error: `Person with the id of ${id} does not exist`
    })
  }

  res.json(person)
})

// CREATE NEW PERSON
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined ) {
    return res.status(400).json({
      error: 'name is required'
    })
  }

  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number is required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

// UPDATE PERSON
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body 
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

// DELETE PERSON
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err))
})

// FUNCTIONALITY FOR HANDLING ERRRORS
const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'malformed id' })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})