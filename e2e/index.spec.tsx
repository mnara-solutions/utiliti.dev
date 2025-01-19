import { expect, test } from "@playwright/test";
import { Routes } from "../app/routes";

test("navigate to a few pages and perform smoke test", async ({ page }) => {
  // load up the index page
  await page.goto("/");

  // ensure the index page has a few key pieces of information
  await expect(page.locator("h1")).toContainText("Utiliti");
  await expect(
    page.getByText("A collection of open source utilities."),
  ).toBeVisible();
  await expect(page.getByText("Standards")).toBeVisible();
  await expect(page.getByText("Popular Utilities")).toBeVisible();

  // click on the lorem ipsum utility
  await page.getByRole("link", { name: "Lorem Ipsum" }).click();
  await expect(page).toHaveURL(Routes.LOREM_IPSUM);
  await expect(page.locator("h1")).toContainText("Lorem Ipsum");
  await expect(page.getByText("Popular Utilities")).toBeVisible();

  // click on the Word Counter utility
  await page.getByRole("link", { name: "Word Counter" }).click();
  await expect(page).toHaveURL(Routes.WORD_COUNTER);
  await expect(page.locator("h1")).toContainText("Word Counter");
  await expect(page.getByText("Popular Utilities")).toBeVisible();
});
