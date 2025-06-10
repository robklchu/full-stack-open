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
    name: String,
    number: String,
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
