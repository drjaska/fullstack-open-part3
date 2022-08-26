const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const http = require('http')

//let because otherwise server gives "TypeError: Assignment to constant variable"
let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
]

app.use(morgan('tiny'))

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p> ${new Date()}</p>`)
})

const generateId = () => {
  //Random whole number between 1 and 1 million
  const newId = Math.floor((Math.random() * 1000000) + 1); 
  return newId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }
  for(let i = 0; i < persons.length; i++)
  {
    if (persons[i].name === body.name){
      return response.status(400).json({ 
        error: 'name must be unique'
      })
    }
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)  
    } else {
         response.status(404).end()  
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})