import { render } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  test("renders title and author but not url and likes", () => {
    const blog = {
      title: "Testing",
      author: "Tester",
      url: "http://example.testing.org",
      likes: 0,
    };

    const { container } = render(<Blog blog={blog} />);

    const div = container.querySelector(".default-view");
    expect(div).toHaveTextContent(`${blog.title}`);
    expect(div).toHaveTextContent(`${blog.author}`);
    expect(div).not.toHaveTextContent(`${blog.url}`);
    expect(div).not.toHaveTextContent(`${blog.likes}`);
  });
});
