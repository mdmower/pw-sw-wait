import { test, expect } from "./pw-fixtures.js";

test.describe("Bubble", () => {
  test.beforeEach(async ({ page, extension }) => {
    await page.goto(extension.bubbleUrl);
  });

  test("bubble contents", async ({ page }) => {
    await expect(page.getByText("Hello World")).toBeVisible();
  });
});
