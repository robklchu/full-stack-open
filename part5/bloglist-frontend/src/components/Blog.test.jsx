import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let blog;
  let user;

  beforeEach(() => {
    blog = {
      title: "Testing",
      author: "Tester",
      url: "http://example.testing.org",
      likes: 36,
      user: {
        username: "creator",
      },
    };

    user = {
      username: "creator",
    };
  });

  test("renders title and author but not url and likes", () => {
    const { container } = render(<Blog blog={blog} />);

    const div = container.querySelector(".default-view");
    expect(div).toHaveTextContent(`${blog.title}`);
    expect(div).toHaveTextContent(`${blog.author}`);
    expect(div).not.toHaveTextContent(`${blog.url}`);
    expect(div).not.toHaveTextContent(`${blog.likes}`);
  });

  test("renders url and likes when view button is clicked", async () => {
    const { container } = render(<Blog blog={blog} user={user}/>);

    const tester = userEvent.setup();
    const viewButton = screen.getByText("view");
    await tester.click(viewButton);

    const div = container.querySelector(".detail-view");
    expect(div).toHaveTextContent(`${blog.url}`);
    expect(div).toHaveTextContent(`${blog.likes}`);
  });
});
