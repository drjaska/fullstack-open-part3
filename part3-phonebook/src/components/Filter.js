const Filter = ({newSearch, handleSearchChange}) => {
    return (
      <form>
        filter shown with <input value={newSearch} onChange={handleSearchChange}/>
      </form>
      )
}

export default Filter