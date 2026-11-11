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
  await page.getByRole("button", { name: /write the first one|begin a note/i }).click();
  await expect(page).toHaveURL(/\/notes\/.+/);
  await page.locator("#note-title").fill(title);
  await page.locator("#note-body").fill(body);
  // Let the debounced autosave commit before moving on.
  await page.waitForTimeout(1200);
}

test.describe("editor", () => {
  test.beforeEach(async ({ page }) => {
    await freshProfile(page);
  });

  test("[AC-012] clicking a note from the list opens the editor populated with that note's title and body", async ({
    page,
  }) => {
    await createNote(page, "Meeting Notes", "Discuss roadmap and budget");

    await page.goto("/notes");
    await page.getByRole("button", { name: /meeting notes/i }).click();

    await expect(page).toHaveURL(/\/notes\/.+/);
    await expect(page.locator("#note-title")).toHaveValue("Meeting Notes");
    await expect(page.locator("#note-body")).toHaveValue("Discuss roadmap and budget");
  });

  test("[AC-013] returning to the list and opening a second note shows the second note's content, not the first's", async ({
    page,
  }) => {
    await createNote(page, "First Note", "Content belonging to the first note");
    await page.goto("/notes");

    await createNote(page, "Second Note", "Content belonging to the second note");
    await page.goto("/notes");

    await page.getByRole("button", { name: /^second note$/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await expect(page.locator("#note-title")).toHaveValue("Second Note");
    await expect(page.locator("#note-body")).toHaveValue("Content belonging to the second note");

    await page.goto("/notes");
    await page.getByRole("button", { name: /^first note$/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await expect(page.locator("#note-title")).toHaveValue("First Note");
    await expect(page.locator("#note-body")).toHaveValue("Content belonging to the first note");
  });

  test("[AC-007] typing in title and body persists with no save button clicked, after the debounce window", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    await expect(page.getByRole("button", { name: /^save$/i })).toHaveCount(0);

    await page.locator("#note-title").fill("Debounced Title");
    await page.locator("#note-body").fill("Debounced body content");
    await page.waitForTimeout(1200);

    await page.reload();
    await expect(page.locator("#note-title")).toHaveValue("Debounced Title");
    await expect(page.locator("#note-body")).toHaveValue("Debounced body content");
  });

  test("[AC-008] closing the note and reopening it in the same browser shows the most recent changes", async ({
    page,
  }) => {
    await createNote(page, "Revisit Later", "initial content");

    const url = page.url();
    await page.locator("#note-body").fill("updated content before leaving");
    await page.waitForTimeout(1200);

    await page.goto("/notes");
    await page.goto(url);

    await expect(page.locator("#note-title")).toHaveValue("Revisit Later");
    await expect(page.locator("#note-body")).toHaveValue("updated content before leaving");
  });

  test("[AC-009] the editor exposes an automatic-save status and no element matching /save/i acting as a save button", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    await expect(page.getByText(/auto-saved|saving|changes pending/i)).toBeVisible();

    const saveButtons = page.getByRole("button", { name: /save/i });
    const count = await saveButtons.count();
    for (let i = 0; i < count; i += 1) {
      await expect(saveButtons.nth(i)).not.toHaveText(/^save$/i);
    }
    await expect(page.getByRole("button", { name: /^save$/i })).toHaveCount(0);
  });

  test("[AC-017] delete plus confirm removes the note from the list and it is absent after a reload", async ({
    page,
  }) => {
    await createNote(page, "Delete Me", "to be removed");

    await page.getByRole("button", { name: /delete note/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /^delete note$/i }).click();

    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.getByText("Delete Me", { exact: false })).toHaveCount(0);

    await page.reload();
    await expect(page.getByText("Delete Me", { exact: false })).toHaveCount(0);
  });

  test("[AC-018] delete plus cancel retains the note unchanged", async ({ page }) => {
    await createNote(page, "Keep Me", "should remain after cancel");

    await page.getByRole("button", { name: /delete note/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /keep note/i }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator("#note-title")).toHaveValue("Keep Me");
    await expect(page.locator("#note-body")).toHaveValue("should remain after cancel");

    await page.goto("/notes");
    await expect(page.getByText("Keep Me", { exact: false })).toBeVisible();

    await page.reload();
    await expect(page.getByText("Keep Me", { exact: false })).toBeVisible();
  });
});
