const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const note = require('../../parts/node/models/note')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// Replaced by the formatter 2 lines down
//app.use(morgan('tiny'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  
  }

  next(error)
}

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.find({}).then(person => {
    res.send(`<p>Phonebook has info for ${person.length} people</p><p> ${new Date()}</p>`)
  })
})

const generateId = () => {
  //Random whole number between 1 and 1 million
  const newId = Math.floor((Math.random() * 1000000) + 1); 
  return newId
}

app.post('/api/persons', (request, response, next) => {
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

  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        return response.status(400).json({ 
          error: 'name must be unique'
        })
      }
  })

  const person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  const person = {
    //id?
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(request.params.id, person, 
    { new: true, runValidators: true, context: 'query'  })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
