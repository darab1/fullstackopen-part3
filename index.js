const express = require('express')
const app = express()

app.use(express.json())

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
  console.log('inside get all persons functionality')
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

// DELET PERSON
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})