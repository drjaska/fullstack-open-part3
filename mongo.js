const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const pName = process.argv[3]
const PNumber = process.argv[4]

const url =
`mongodb+srv://FullstackStudent:${password}@cluster0.bln9yoy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: pName,
  number: PNumber || ''
})

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    //Most likely not the smarterst solution, but otherwise it will add new person anyway with no arguments
    process.exit(1)
  })
}

person.save().then(result => {
  console.log(`added ${pName} number ${PNumber} to phonebook`)
  mongoose.connection.close()
})

