const Person = ({ person, deleteContact }) => { 
    return (
    <li>{person.name} {person.number} <button onClick={() => deleteContact(person.id, person.name)}>delete</button></li>
    )
}

export default Person