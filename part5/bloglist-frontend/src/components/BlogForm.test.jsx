import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("calls click event handler with right details when a new blog is created", async () => {
    const mockHandler = vi.fn();
    render(<BlogForm createBlog={mockHandler} />);

    const titleEditBox = screen.getByPlaceholderText("type blog title here");
    const authorEditBox = screen.getByPlaceholderText(
      "type blog author name here"
    );
    const urlEditBox = screen.getByPlaceholderText("type blog url here");
    const createButton = screen.getByText("create");

    const tester = userEvent.setup();
    await tester.type(titleEditBox, "Testing");
    await tester.type(authorEditBox, "Tester");
    await tester.type(urlEditBox, "http://example.testing.org");
    await tester.click(createButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe("Testing");
    expect(mockHandler.mock.calls[0][0].author).toBe("Tester");
    expect(mockHandler.mock.calls[0][0].url).toBe("http://example.testing.org");
  });
});
