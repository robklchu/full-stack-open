const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Robert Chu",
        username: "robchu",
        password: "hehehaha",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "robchu", "hehehaha");

      await expect(page.getByText("Robert Chu logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "robchu", "wrongpwd");

      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "robchu", "hehehaha");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "Testing", "Tester", "http://testing.org");

      await expect(page.getByText("Testing Tester")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "Another new blog",
          "Blogger",
          "http://new-blog.org"
        );
      });

      test("the blog can be liked", async ({ page }) => {
        await page
          .getByText("Another new blog")
          .getByRole("button", { name: "view" })
          .click();
        await page.getByRole("button", { name: "likes" }).click();

        await expect(page.getByText("1")).toBeVisible();
      });

      test("the blog can be deleted by the user who added it", async ({
        page,
      }) => {
        await expect(page.getByText("Another new blog Blogger")).toBeVisible();

        await page
          .getByText("Another new blog")
          .getByRole("button", { name: "view" })
          .click();
        page.on("dialog", async (dialog) => await dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByText("Another new blog Blogger")
        ).not.toBeVisible();
      });

      test("the user who didn't add the blog cannot see its 'remove' button", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "mluukkai", "salainen");
        await page
          .getByText("Another new blog")
          .getByRole("button", { name: "view" })
          .click();

        await expect(
          page.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });
    });
  });
});
