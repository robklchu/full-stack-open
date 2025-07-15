export async function loginWith(page, username, password) {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
}

export async function createBlog(page, title, author, url) {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByPlaceholder(/\btitle\b/).fill(title);
  await page.getByPlaceholder(/\bauthor\b/).fill(author);
  await page.getByPlaceholder(/\burl\b/).fill(url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${title} ${author}`).waitFor();
}
