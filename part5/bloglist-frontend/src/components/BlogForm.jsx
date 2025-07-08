function BlogForm({
  title,
  author,
  url,
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) {
  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default BlogForm;
