require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist")); // to serve static files in 'dist'

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.json());

let persons = [
  // {
  //   id: "1",
  //   name: "Arto Hellas",
  //   number: "040-123456",
  // },
  // {
  //   id: "2",
  //   name: "Ada Lovelace",
  //   number: "39-44-5323523",
  // },
  // {
  //   id: "3",
  //   name: "Dan Abramov",
  //   number: "12-43-234345",
  // },
  // {
  //   id: "4",
  //   name: "Mary Poppendieck",
  //   number: "39-23-6423122",
  // },
];

app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  ///////////////////////////////
  // To be updated
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  ///////////////////////////////

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
