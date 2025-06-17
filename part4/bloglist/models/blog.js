const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform(doc, rtn) {
    rtn.id = rtn._id.toString();
    delete rtn._id;
    delete rtn.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
