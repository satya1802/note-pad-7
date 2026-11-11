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
  await page.goto("/notes");
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
}

test.describe("responsive desktop (1280x800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await freshProfile(page);
  });

  test("[AC-025] the list renders in more than one column at 1280x800", async ({ page }) => {
    await createNote(page, "Desktop One", "first note body");
    await createNote(page, "Desktop Two", "second note body");
    await createNote(page, "Desktop Three", "third note body");

    const cards = page.locator("ul li");
    await expect(cards).toHaveCount(3);

    const boxes = await cards.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().left),
    );
    const distinctLefts = new Set(boxes);
    expect(distinctLefts.size).toBeGreaterThan(1);

    await expectNoHorizontalOverflow(page);
  });

  test("[AC-025] the editor is usable with no horizontal overflow at 1280x800", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one|begin a note/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    await page.locator("#note-title").fill("Desktop editor check");
    await page.locator("#note-body").fill("Body text typed at the desktop viewport");
    await page.waitForTimeout(1200);

    await expect(page.locator("#note-title")).toHaveValue("Desktop editor check");
    await expect(page.locator("#note-body")).toHaveValue(
      "Body text typed at the desktop viewport",
    );
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("responsive mobile (390x844)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await freshProfile(page);
  });

  test("[AC-026] create, edit, search and delete each complete end to end at 390x844 with no horizontal scrolling", async ({
    page,
  }) => {
    // create
    await page.getByRole("button", { name: /write the first one|begin a note/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await expectNoHorizontalOverflow(page);

    // edit
    await page.locator("#note-title").fill("Mobile flow note");
    await page.locator("#note-body").fill("content typed during the mobile flow check");
    await page.waitForTimeout(1200);
    await expectNoHorizontalOverflow(page);

    await page.goto("/notes");
    await expectNoHorizontalOverflow(page);

    // search
    await page.locator("#note-search").fill("mobile flow");
    await expect(page.getByText("Mobile flow note", { exact: false })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.locator("#note-search").fill("");

    // delete
    await page.getByRole("button", { name: /mobile flow note/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await page.getByRole("button", { name: /delete note/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /^delete note$/i }).click();

    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.getByText("Mobile flow note", { exact: false })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("[AC-026] the delete confirmation dialog and both of its buttons are visible within the viewport at 390x844", async ({
    page,
  }) => {
    await createNote(page, "Dialog fits", "checking dialog visibility on mobile");

    await page.getByRole("button", { name: /dialog fits/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await page.getByRole("button", { name: /delete note/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const keepButton = dialog.getByRole("button", { name: /keep note/i });
    const deleteButton = dialog.getByRole("button", { name: /^delete note$/i });
    await expect(keepButton).toBeVisible();
    await expect(deleteButton).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const vw = viewport!.width;
    const vh = viewport!.height;

    for (const button of [keepButton, deleteButton]) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vw);
      expect(box!.y + box!.height).toBeLessThanOrEqual(vh);
    }
  });
});
