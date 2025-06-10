import { useState, useEffect } from "react";
import backendServices from "./services/backend";
import Input from "./components/Input";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import "./index.css";

const Filter = ({ children }) => <>{children}</>;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorFlag, setErrorFlag] = useState(false);

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

    // Clear filter view
    setIsFilter(false);
    setQuery("");

    const existingNames = persons.map((person) => person.name);
    const newContact = { name: newName, number: newNumber };

    if (existingNames.includes(newName)) {
      const reply = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (reply) {
        const existingPersonId = persons.find((p) => p.name === newName).id;
        backendServices
          .update(existingPersonId, newContact)
          .then((contact) => {
            setPersons(persons.map((p) => (p.id === contact.id ? contact : p)));
            setErrorFlag(false);
            setNotification(`Changed ${newName}'s number to ${newNumber}`);
          })
          .catch(() => {
            setErrorFlag(true);
            setNotification(
              `Information of ${newName} has already been removed from server`
            );
            fetchPersons();
          });
      }
    } else {
      backendServices
        .create(newContact)
        .then((p) => setPersons(persons.concat(p)));
      setErrorFlag(false);
      setNotification(`Added ${newName}`);
    }

    // Clear notification box in 5s
    setTimeout(() => {
      setNotification(null);
    }, 5_000);

    // Clear add new fields
    setNewName("");
    setNewNumber("");
  };

  const deleteContact = (id) => {
    const contact = persons.find((p) => p.id === id);
    alert(`Delete ${contact.name} ?`);

    backendServices.remove(id).then(fetchPersons);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={errorFlag} />
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
