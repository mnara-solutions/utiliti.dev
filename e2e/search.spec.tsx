import { expect, test } from "@playwright/test";

test("clicking on search box", async ({ page }) => {
  // load up the index page
  await page.goto("/");

  // click on search box
  await page.locator('[test-id="search-box"]').first().click();

  // wait for search options
  await expect(page.locator('[test-id="search-option"]').first()).toBeVisible();

  // ensure the first item is private notes
  const text = await page
    .locator('[test-id="search-option"]')
    .first()
    .textContent();
  expect(text).toContain("Private Notes");
});

test("searching via keyboard shortcut", async ({ page }) => {
  // load up the index page
  await page.goto("/");

  // open dialog via shortcut
  await page.keyboard.press("Meta+k");

  // the search input should be focused
  await expect(page.locator("input:focus")).toBeVisible();

  // fill the focused input
  await page.keyboard.type("JSON");

  // wait for the search option to appear
  await expect(page.locator('[test-id="search-option"]')).toBeVisible();

  // ensure its the json search result
  const searchResultText = await page
    .locator('[test-id="search-option"]')
    .textContent();
  expect(searchResultText).toContain("JSON");

  // click on it
  await page.locator('[test-id="search-option"]').first().click();

  // ensure page URL
  await expect(page).toHaveURL("/json");
});
