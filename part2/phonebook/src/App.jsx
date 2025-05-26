import { useState, useEffect } from "react";
import axios from "axios";

const Input = ({ text, handler, value }) => (
  <div>
    {text} <input onChange={handler} value={value} />
  </div>
);

const SubmitButton = ({ text }) => (
  <div>
    <button type="submit">{text}</button>
  </div>
);

const Filter = ({ children }) => <>{children}</>;

const PersonForm = ({
  submitHandler,
  changeNameHander,
  changeNumberHandler,
  name,
  number,
}) => (
  <form onSubmit={submitHandler}>
    <Input text="name:" handler={changeNameHander} value={name} />
    <Input text="number:" handler={changeNumberHandler} value={number} />
    <SubmitButton text="save" />
  </form>
);

const Persons = ({ group }) => {
  return (
    <>
      {group.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  useEffect(fetchPersons, []);

  function fetchPersons() {
    axios
      .get("http://localhost:3001/persons")
      .then((res) => setPersons(res.data));
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setIsFilter(true);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();

    setIsFilter(false);
    setQuery("");

    const existingNames = persons.map((person) => person.name);
    if (existingNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
    }
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter>
        <Input
          text="filter shown with"
          handler={handleQueryChange}
          value={query}
        />
      </Filter>

      <h3>Add a new</h3>
      <PersonForm
        submitHandler={addName}
        changeNameHander={handleNameChange}
        changeNumberHandler={handleNumberChange}
        name={newName}
        number={newNumber}
      />

      <h3>Numbers</h3>
      {!isFilter && <Persons group={persons} />}
      {isFilter && <Persons group={filteredPersons} />}
    </div>
  );
};

export default App;
