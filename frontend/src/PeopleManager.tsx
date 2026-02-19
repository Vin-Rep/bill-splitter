interface Props {
    people: string[]
    onPeopleChange: (people: string[]) => void
  }
  
  function PeopleManager({ people, onPeopleChange }: Props) {
    const addPerson = () => {
      onPeopleChange([...people, ''])
    }
  
    const updatePerson = (index: number, name: string) => {
      const updated = [...people]
      updated[index] = name
      onPeopleChange(updated)
    }
  
    const removePerson = (index: number) => {
      onPeopleChange(people.filter((_, i) => i !== index))
    }
  
    return (
      <div style={{ marginTop: 32 }}>
        <h2>People</h2>
        {people.map((person, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={person}
              onChange={e => updatePerson(index, e.target.value)}
              placeholder={`Person ${index + 1}`}
              style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, flex: 1 }}
            />
            <button
              onClick={() => removePerson(index)}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addPerson}
          style={{ padding: '8px 16px', cursor: 'pointer', marginTop: 8 }}
        >
          Add Person
        </button>
      </div>
    )
  }
  
  export default PeopleManager