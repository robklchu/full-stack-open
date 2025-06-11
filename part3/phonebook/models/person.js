const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: [true, "Name required"],
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator(v) {
          return /^\d{2,3}-\d+$/.test(v);
        },
        message(props) {
          return `${props.value} is not a valid phone number!`
        }
      },
      required: [true, "Phone number required"],
    },
  },
  {
    strictQuery: "throw",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Person", schema);
