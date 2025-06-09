const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Can't connect to database: missing password");
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log("Can't add entry: missing name or number");
  process.exit(1);
}

if (process.argv.length > 5) {
  console.log("Abort: too many arguments");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.vbuafhp.mongodb.net/Person?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const schema = new mongoose.Schema(
  {
    name: String,
    number: String,
  },
  {
    strictQuery: "throw",
  }
);

const Person = mongoose.model("Person", schema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const nameReg = /[a-z|\s]+/gi;
  const numReg = /[\d|-]+/g;

  if (name.length !== name.match(nameReg)[0].length) {
    console.log(`Abort: invalid name ${name}`);
    process.exit(1);
  }

  if (number.length !== number.match(numReg)[0].length) {
    console.log(`Abort: invalid number ${number}`);
    process.exit(1);
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
