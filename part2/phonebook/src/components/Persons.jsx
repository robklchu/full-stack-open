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

export default Persons;
