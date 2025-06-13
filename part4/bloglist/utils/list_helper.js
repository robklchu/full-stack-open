const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;
  return blogs.map((blog) => blog.likes).reduce((total, cur) => total + cur);
};

module.exports = {
  dummy,
  totalLikes,
};
