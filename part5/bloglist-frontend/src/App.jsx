import { useState, useEffect } from "react";
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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // otherwise user.token is erased upon refresh
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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

  function blogForm() {
    return (
      <Togglable buttonlabel="new note">
        <BlogForm
          title={title}
          author={author}
          url={url}
          handleSubmit={addBlog}
          handleTitleChange={(e) => setTitle(e.target.value)}
          handleAuthorChange={(e) => setAuthor(e.target.value)}
          handleUrlChange={(e) => setUrl(e.target.value)}
        />
      </Togglable>
    );
  }

  async function addBlog(event) {
    event.preventDefault();

    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      });
      setMessage(`a new blog ${newBlog.title} added`);
      setBlogs(blogs.concat(newBlog));
    } catch (exception) {
      setIsError(true);
      setMessage("Missing title or url");
    } finally {
      setTimeout(() => {
        setIsError(false);
        setMessage(null);
      }, 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
    }
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
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
