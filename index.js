const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));

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
  res.json(persons)
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
  const found = persons.find(p => p.name === body.name)

  if (!body.name ) {
    return res.status(404).json({
      error: 'name is required'
    })
  }

  if (!body.number) {
    return res.status(404).json({
      error: 'number is required'
    })
  }

  if (found) {
    return res.status(400).json({
      error: 'name must be unique'
    })

  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(persons)
})

// DELETE PERSON
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})