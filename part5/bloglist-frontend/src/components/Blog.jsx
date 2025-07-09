import { useState } from "react";

function Blog({ blog, user, incrLikes, removeBlog }) {
  const [view, setView] = useState(false);
  const buttonlabel = view ? "hide" : "view";

  function viewBlog() {
    setView(!view);
  }

  function showBlog() {
    const isLoggedInUser = user.username === blog.user.username;
    return (
      <div>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={addLikes}>likes</button>
        </div>
        <div>{blog.user.name}</div>
        {isLoggedInUser && (
          <button
            onClick={deleteBlog}
            style={{ color: "white", backgroundColor: "blue" }}
          >
            remove
          </button>
        )}
      </div>
    );
  }

  async function addLikes() {
    const updatedBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 };
    delete updatedBlog.id;
    await incrLikes(blog.id, updatedBlog);
  }

  async function deleteBlog() {
    const decision = window.confirm(`Remove ${blog.title}`);
    if (decision) {
      await removeBlog(blog.id);
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={viewBlog}>{buttonlabel}</button>
      </div>
      {view && showBlog()}
    </div>
  );
}

export default Blog;
