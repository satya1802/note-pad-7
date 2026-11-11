import { expect, test, type Page } from "@playwright/test";

// Every test starts from a genuinely fresh browser profile: clearing localStorage alone
// is not enough because localforage prefers IndexedDB, so both are wiped before navigating.
async function freshProfile(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(async () => {
    window.localStorage.clear();
    if (window.indexedDB?.databases) {
      const dbs = await window.indexedDB.databases();
      await Promise.all(
        dbs.map(
          (db) =>
            db.name &&
            new Promise((resolve) => {
              const req = window.indexedDB.deleteDatabase(db.name as string);
              req.onsuccess = () => resolve(undefined);
              req.onerror = () => resolve(undefined);
              req.onblocked = () => resolve(undefined);
            }),
        ),
      );
    }
  });
  await page.goto("/notes");
}

async function createNote(page: Page, title: string, body: string): Promise<void> {
  // The "Begin a Note" control in the search bar is always present, whether the list is
  // empty or not, unlike the bottom-of-page "Write the first one" empty-state action --
  // using it keeps this helper unambiguous whether this is the first note or a later one.
  await page.getByRole("button", { name: "Begin a Note", exact: true }).click();
  await expect(page).toHaveURL(/\/notes\/.+/);
  await page.locator("#note-title").fill(title);
  await page.locator("#note-body").fill(body);
  // Let the debounced autosave commit before moving on.
  await page.waitForTimeout(1200);
  await page.goto("/notes");
}

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
    await freshProfile(page);
  });

  test("[AC-014] entering a search term filters the list to notes whose title or body matches it", async ({
    page,
  }) => {
    await createNote(page, "Groceries", "milk, eggs, bread");
    await createNote(page, "Workout plan", "squats, lunges, push-ups");
    await createNote(page, "Reading list", "a book that mentions groceries in passing");

    const search = page.locator("#note-search");
    await search.fill("grocer");

    await expect(page.getByText("Groceries", { exact: false })).toBeVisible();
    await expect(page.getByText("Reading list", { exact: false })).toBeVisible();
    await expect(page.getByText("Workout plan", { exact: false })).toHaveCount(0);
  });

  test("[AC-015] a search term matching no notes shows an empty/no-results state", async ({
    page,
  }) => {
    await createNote(page, "Groceries", "milk, eggs, bread");
    await createNote(page, "Workout plan", "squats, lunges, push-ups");

    const search = page.locator("#note-search");
    await search.fill("no-such-term-exists-anywhere-xyz");

    await expect(page.getByText("Groceries", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Workout plan", { exact: false })).toHaveCount(0);
    await expect(page.getByText(/nothing by that name/i)).toBeVisible();
  });

  test("[AC-014] clicking a note from a filtered search list opens that exact note in the editor", async ({
    page,
  }) => {
    await createNote(page, "Groceries", "milk, eggs, bread");
    await createNote(page, "Reading list", "a book that mentions groceries in passing");
    await createNote(page, "Workout plan", "squats, lunges, push-ups");

    const search = page.locator("#note-search");
    await search.fill("grocer");
    await expect(page.getByText("Workout plan", { exact: false })).toHaveCount(0);

    // Open the body-match result (not the title-match one) and confirm the editor shows
    // that result's own content, proving the filtered list still routes to the right note.
    await page.getByRole("button", { name: "Reading list", exact: true }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await expect(page.locator("#note-title")).toHaveValue("Reading list");
    await expect(page.locator("#note-body")).toHaveValue(
      "a book that mentions groceries in passing",
    );
  });

  test("[AC-016] clearing the search term shows the full list of all notes again", async ({
    page,
  }) => {
    await createNote(page, "Groceries", "milk, eggs, bread");
    await createNote(page, "Workout plan", "squats, lunges, push-ups");

    const search = page.locator("#note-search");
    await search.fill("grocer");
    await expect(page.getByText("Workout plan", { exact: false })).toHaveCount(0);

    await search.fill("");

    await expect(page.getByText("Groceries", { exact: false })).toBeVisible();
    await expect(page.getByText("Workout plan", { exact: false })).toBeVisible();
  });
});
