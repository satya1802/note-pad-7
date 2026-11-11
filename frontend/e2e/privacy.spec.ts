import { expect, test, type Browser, type Page } from "@playwright/test";

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

test.describe("privacy and local-only storage", () => {
  test(
    "[AC-021] a note created in one browser profile does not appear in a separate, " +
      "independent browser profile",
    async ({ page, browser }: { page: Page; browser: Browser }) => {
      // "page" stands in for one visitor's browser: wipe it and write a note only there.
      await freshProfile(page);
      await createNote(page, "Only in browser one", "private to this device");
      await expect(page.getByText("Only in browser one", { exact: false })).toBeVisible();

      // A brand-new, isolated browser context has its own cookie jar, localStorage and
      // IndexedDB -- exactly the isolation a different browser or a different device would
      // have, since nothing is shared across contexts and nothing was synced to a server.
      const otherDeviceContext = await browser.newContext();
      const otherDevicePage = await otherDeviceContext.newPage();
      try {
        await otherDevicePage.goto("/notes");
        await expect(otherDevicePage.getByText(/no notes yet/i)).toBeVisible();
        await expect(
          otherDevicePage.getByText("Only in browser one", { exact: false }),
        ).toHaveCount(0);

        // The "other device" writes its own note; it must stay invisible back on the
        // original profile too -- proving the isolation runs both ways, with no sync.
        await createNote(otherDevicePage, "Only in browser two", "private to the other device");
        await expect(
          otherDevicePage.getByText("Only in browser two", { exact: false }),
        ).toBeVisible();
      } finally {
        await otherDeviceContext.close();
      }

      await page.goto("/notes");
      await expect(page.getByText("Only in browser one", { exact: false })).toBeVisible();
      await expect(page.getByText("Only in browser two", { exact: false })).toHaveCount(0);
    },
  );

  test(
    "[AC-022][NFR-001] clearing the site's browser data erases every note, with no copy " +
      "recovered from a server",
    async ({ page }) => {
      await freshProfile(page);
      await createNote(page, "Gone after clearing", "this only ever lived in this browser");
      await createNote(page, "Also gone", "second note, same browser");

      await page.goto("/notes");
      await expect(page.getByText("Gone after clearing", { exact: false })).toBeVisible();
      await expect(page.getByText("Also gone", { exact: false })).toBeVisible();

      // Simulate the visitor clearing their browser data for this site: wipe localStorage
      // and every IndexedDB database the way "Clear site data" does, without touching a
      // server -- there is none to hold a copy (NFR-001, no cloud backup).
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

      await page.reload();
      await expect(page.getByText(/no notes yet/i)).toBeVisible();
      await expect(page.getByText("Gone after clearing", { exact: false })).toHaveCount(0);
      await expect(page.getByText("Also gone", { exact: false })).toHaveCount(0);

      // Reloading again (a fresh app boot reading whatever storage exists) still shows
      // nothing: the notes are not recoverable from anywhere because nothing else holds them.
      await page.reload();
      await expect(page.getByText(/no notes yet/i)).toBeVisible();
    },
  );

  test(
    "[NFR-001] create, edit, search and delete flows issue no cross-origin request and no " +
      "/api/ request carrying note data",
    async ({ page }: { page: Page }) => {
      await freshProfile(page);

      // Capture every request made from this point on, excluding the app's own origin
      // document/asset/navigation requests, so the list should stay empty throughout.
      const captured: string[] = [];
      page.on("request", (req) => {
        const url = new URL(req.url());
        const isAppOrigin = url.origin === new URL(page.url()).origin;
        const looksLikeDataApi = /\/api\//.test(url.pathname);
        if (!isAppOrigin || looksLikeDataApi) {
          captured.push(`${req.method()} ${req.url()}`);
        }
      });

      // create
      await page.getByRole("button", { name: "Begin a Note", exact: true }).click();
      await expect(page).toHaveURL(/\/notes\/.+/);

      // edit
      await page.locator("#note-title").fill("Privacy flow note");
      await page.locator("#note-body").fill("content typed during the privacy flow check");
      await page.waitForTimeout(1200);

      // search
      await page.goto("/notes");
      await page.locator("#note-search").fill("privacy flow");
      await expect(page.getByText("Privacy flow note", { exact: false })).toBeVisible();
      await page.locator("#note-search").fill("");

      // delete
      await page.getByRole("button", { name: /privacy flow note/i }).click();
      await expect(page).toHaveURL(/\/notes\/.+/);
      await page.getByRole("button", { name: /delete note/i }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: /^delete note$/i }).click();
      await expect(page).toHaveURL(/\/notes$/);

      expect(captured).toEqual([]);
    },
  );
});
