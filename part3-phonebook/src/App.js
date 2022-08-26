import axios from 'axios'
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import contactService from './services/contactInformation'

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newSearch, setNewSearch] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [errorStatus, setErrorStatus] = useState('')
    
    useEffect(() => {
      contactService
        .getAll()
        .then(response => {
          setPersons(response)
        })
    }, [])

    const notificationMessageHandle = (message, errorStatus) => {
        setNotificationMessage(message)
        setErrorStatus(errorStatus)
        setTimeout(() => {setNotificationMessage(null)}, 5000)
    }

    const addPerson = (event) => {
      event.preventDefault()
      const personExists = persons.map(person => person.name.toLowerCase()).includes(newName.toLowerCase())
      const personsNumberExists = persons.map(person => person.number).includes(newNumber)
      if(personExists && personsNumberExists)
      {
          window.alert(`${newName} and number ${newNumber} is already added to phonebook`);
          return
      }
      //Do not take in to account if many people have the same number
      if(personExists && !personsNumberExists)
      {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one? `)){
          let personId = 0;
          for (let i = 0; i < persons.length; i++) {
            if(newName === persons[i].name)
            {
              personId = persons[i].id
            }
          }
          const noteObject = {
            name: newName,
            number: newNumber
          }
          contactService
            .update(personId, noteObject)
            .then(() => {
              contactService
                .getAll()
                .then(response => {
                  setPersons(response)
                })
              notificationMessageHandle(`Changed ${newName}'s number to ${newNumber}`, 0)
          })
          .catch(error => {
            notificationMessageHandle(`Failed to change ${newName}'s number to ${newNumber}. Information has already been removed from server`, 1)
          })
          setNewName('')
          setNewNumber('')
          return
        }
      }

      const noteObject = {
        name: newName,
        number: newNumber
      }
     contactService
        .create(noteObject)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setNewName('')
          setNewNumber('')
     })
     notificationMessageHandle(`Added "${newName}" to phonebook`, 0)
   }
    
    const handleNameChange = (event) => {setNewName(event.target.value)}
    const handleNumberChange = (event) => {setNewNumber(event.target.value)}
    const handleSearchChange = (event) => {setNewSearch(event.target.value)}

    const deleteContact = async (id, name) => {
      if(window.confirm(`Delete ${name} ?`)){
        await axios.delete(`http://localhost:3001/api/persons/${id}`)
        
        contactService
        .getAll()
        .then(response => {
          setPersons(response)
        })
        notificationMessageHandle(`Deleted ${name} from phonebook` , 0)
      } 
    }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage} errorStatus={errorStatus}/>
        <Filter newSearch = {newSearch} handleSearchChange={handleSearchChange}/>
      <h2>Add a new</h2>  
        <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
        <Persons newSearch={newSearch} persons={persons} deleteContact={deleteContact}/>
    </div>
  )

}

export default App
