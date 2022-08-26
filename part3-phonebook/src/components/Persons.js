import Person from './Person'

const Persons = ({newSearch, persons, deleteContact}) => {
    const personsToShow = newSearch === '' ? persons : persons.filter(person => person.name.toLocaleLowerCase().includes(newSearch.toLowerCase()))  
  
  return (
    <p>{personsToShow.map((person, i) => <Person key={i} person={person} deleteContact={deleteContact}/>)}</p>
  )
}

export default Persons

