import { useState, useEffect } from "react";
import backendServices from "./services/backend";

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

const Persons = ({ group, deleteHandler }) => {
  return (
    <>
      {group.map((person) => (
        <div key={person.name}>
          {person.name} {person.number} &nbsp;
          <button onClick={() => deleteHandler(person.id)}>delete</button>
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
    backendServices
      .getAll()
      .then((initialContacts) => setPersons(initialContacts));
  }

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
      alert(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      const existingPersonId = persons.find((p) => p.name === newName).id;
      const contactToUpdate = { name: newName, number: newNumber };
      backendServices
        .update(existingPersonId, contactToUpdate)
        .then((contact) => {
          setPersons(persons.map((p) => (p.id === contact.id ? contact : p)));
        });
    } else {
      const newContact = { name: newName, number: newNumber };
      backendServices
        .create(newContact)
        .then((p) => setPersons(persons.concat(p)));
    }
    setNewName("");
    setNewNumber("");
  };

  const deleteContact = (id) => {
    const contact = persons.find((p) => p.id === id);
    alert(`Delete ${contact.name} ?`);

    backendServices
      .remove(id)
      .then((removedPerson) =>
        setPersons(persons.filter((p) => p.id !== removedPerson.id))
      );
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
      {!isFilter && <Persons group={persons} deleteHandler={deleteContact} />}
      {isFilter && (
        <Persons group={filteredPersons} deleteHandler={deleteContact} />
      )}
    </div>
  );
};

export default App;
