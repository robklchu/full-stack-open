const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;
  return blogs.map((blog) => blog.likes).reduce((total, cur) => total + cur);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  if (blogs.length === 1) return blogs[0];

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favBlogs = blogs.filter((blog) => blog.likes === maxLikes);
  const anyFav = favBlogs[Math.floor(favBlogs.length * Math.random())];

  return anyFav;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1,
    };
  }

  const tally = _.countBy(blogs, "author");
  const transformedTally = _.map(tally, (value, key) => ({
    author: key,
    blogs: value,
  }));
  const mostBlogger = _.maxBy(transformedTally, "blogs");
  return mostBlogger;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
