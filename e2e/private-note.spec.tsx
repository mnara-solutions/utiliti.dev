import { expect, test } from "@playwright/test";
import { Routes } from "../app/routes";

test("Immediately expiring private note", async ({ page }) => {
  await page.goto(Routes.PRIVATE_NOTES);

  // create a default note
  const noteText =
    "This is an awesome note that I am creating for testing that should self destruct upon reading.";
  await expect(page.getByText("Popular Utilities")).toBeVisible();
  const note = page.getByPlaceholder("Write your note here…");
  await note.fill(noteText);
  await page.getByText("Create").click();

  // ensure note was created successfully
  await expect(page.getByText("Success")).toBeVisible();
  await expect(
    page.getByText("This note will self-destruct after reading it."),
  ).toBeVisible();

  // go to the note
  const noteUrl = await page.locator("input").inputValue();
  await page.goto(noteUrl);

  // ensure we get a confirmation page since this is a self-destructing note
  await expect(
    page.getByText(
      "You were sent a sensitive note which is meant to be destroyed after it is read. Once you click on the button below, the note will be deleted.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Popular Utilities")).toBeVisible();
  await page.getByText("Show the note").click();

  // ensure we can read the note
  await expect(page.getByText(noteText)).toBeVisible();
  await expect(
    page.getByText(
      "This note is now deleted. Copy the content in the note before closing this window.",
    ),
  ).toBeVisible();

  // ensure page url does not have the secret key
  await expect(page).toHaveURL(noteUrl.split("#")[0] + "?confirm=true");

  // reload the note and ensure it is deleted
  await page.goto(noteUrl);
  await expect(
    page.getByText(
      "The note you are looking was either not found or was deleted.",
    ),
  ).toBeVisible();
});

test("A note that is expiring in 1 hour", async ({ page }) => {
  await page.goto(Routes.PRIVATE_NOTES);

  // create a note that expires in 1 hour
  const noteText = "Note that will expire in 1 hour.";
  const note = page.getByPlaceholder("Write your note here…");
  await note.fill(noteText);
  await page.locator("select").selectOption("1 hour from now");
  await page.getByText("Create").click();

  // ensure note was created successfully
  await expect(page.getByText("Success")).toBeVisible();
  await expect(
    page.getByText("This note will self-destruct 1 hour from now."),
  ).toBeVisible();

  // go to the note
  const noteUrl = await page.locator("input").inputValue();
  await page.goto(noteUrl);

  // ensure we can read the note
  await expect(page.getByText(noteText)).toBeVisible();
  await expect(page.getByText("This note will be deleted on")).toBeVisible();

  // ensure page url does not have the secret key
  await expect(page).toHaveURL(Routes.PRIVATE_NOTES + "#redacted");

  // reload the note and ensure it is still visible
  await page.goto(noteUrl);
  await expect(page.getByText(noteText)).toBeVisible();
});
