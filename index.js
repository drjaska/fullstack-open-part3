const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

//let because otherwise server gives "TypeError: Assignment to constant variable"
/*
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
*/

// Replaced by the formatter 2 lines down
//app.use(morgan('tiny'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

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
  console.log(body)
  /*
  //do not need to care about this in 3.14
  for(let i = 0; i < persons.length; i++)
  {
    if (persons[i].name === body.name){
      return response.status(400).json({ 
        error: 'name must be unique'
      })
    }
  }
  */

  const person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
    /*
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)  
    } else {
         response.status(404).end()  
    }
    */
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
