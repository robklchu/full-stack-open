import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // otherwise user.token is erased upon refresh
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogsByLikes(blogs)));
  }, []);

  function sortBlogsByLikes(blogs) {
    const sortedBlogs = [...blogs];
    sortedBlogs.sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setIsError(true);
      setMessage("Wrong username or password");
      setTimeout(() => {
        setIsError(false);
        setMessage(null);
      }, 5000);
    } finally {
      setUsername("");
      setPassword("");
    }
  }

  function handleLogout(event) {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  }

  function loginForm() {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username</label>
          <input
            data-testid="username"
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            data-testid="password"
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  }

  const blogFormRef = useRef(null);

  function blogForm() {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    );
  }

  async function addBlog(blogObject) {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blogObject);
      setMessage(`a new blog ${newBlog.title} added`);

      const blogs = await blogService.getAll();
      setBlogs(sortBlogsByLikes(blogs));
    } catch (exception) {
      setIsError(true);
      setMessage("Missing title or url");
    } finally {
      setTimeout(() => {
        setIsError(false);
        setMessage(null);
      }, 5000);
    }
  }

  async function addLikes(blogId, blogObject) {
    await blogService.update(blogId, blogObject);

    const blogs = await blogService.getAll();
    setBlogs(sortBlogsByLikes(blogs));
  }

  async function deleteBlog(blogId) {
    await blogService.remove(blogId);

    const blogs = await blogService.getAll();
    setBlogs(sortBlogsByLikes(blogs));
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} isError={isError} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />
      <p>
        {user.name} logged in
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </p>

      {blogForm()}

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          incrLikes={addLikes}
          removeBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
