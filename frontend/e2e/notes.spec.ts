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

test.describe("notes", () => {
  test.beforeEach(async ({ page }) => {
    await freshProfile(page);
  });

  test("[AC-011] fresh browser profile shows the empty state with a create action", async ({
    page,
  }) => {
    await expect(page.getByText(/no notes yet/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /write the first one/i })).toBeVisible();
  });

  test("[AC-001] creating a note lands in the editor with empty title and body and adds one entry to the list", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    const titleInput = page.locator("#note-title");
    const bodyInput = page.locator("#note-body");
    await expect(titleInput).toHaveValue("");
    await expect(bodyInput).toHaveValue("");

    await page.goBack();
    await expect(page).toHaveURL(/\/notes$/);
    const cards = page.locator("ul li article");
    await expect(cards).toHaveCount(1);
  });

  test("[AC-019] notes created in the session are still present with identical content after a full page reload", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /begin a note/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    const titleInput = page.locator("#note-title");
    const bodyInput = page.locator("#note-body");
    await titleInput.fill("Reload check");
    await bodyInput.fill("content that should survive a reload");
    // Autosave in the editor is debounced; give it time to commit before reloading.
    await page.waitForTimeout(1200);

    await page.reload();
    await expect(page.locator("#note-title")).toHaveValue("Reload check");
    await expect(page.locator("#note-body")).toHaveValue("content that should survive a reload");

    await page.goto("/notes");
    await page.reload();
    await expect(page.getByText("Reload check", { exact: false })).toBeVisible();
  });

  test("[AC-010] a note saved with a blank title appears in the list as 'Untitled'", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await page.locator("#note-body").fill("some body text, no title given");
    await page.waitForTimeout(1200);

    await page.goto("/notes");
    await expect(page.getByText("Untitled", { exact: false })).toBeVisible();
  });

  test("[AC-003] a title typed in the editor appears as the note's label in the list after navigating back", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await page.locator("#note-title").fill("Grocery List");
    await page.waitForTimeout(1200);

    await page.goBack();
    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.getByText("Grocery List", { exact: false })).toBeVisible();
  });

  test("[AC-006] pasting HTML/rich content into the body stores and renders plain text only, with no markup", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    const bodyInput = page.locator("#note-body");
    await bodyInput.click();
    await page.evaluate(() => {
      const el = document.getElementById("note-body") as HTMLTextAreaElement;
      const dt = new DataTransfer();
      dt.setData("text/plain", "Bold heading item");
      dt.setData("text/html", "<h1><b>Bold heading</b></h1><ul><li>item</li></ul>");
      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: dt,
      });
      el.dispatchEvent(pasteEvent);
    });
    await page.waitForTimeout(1200);

    await expect(bodyInput).toHaveValue("Bold heading item");
    const bodyHtml = await bodyInput.innerHTML().catch(() => "");
    expect(bodyHtml).not.toContain("<h1>");
    expect(bodyHtml).not.toContain("<b>");

    await page.reload();
    await expect(bodyInput).toHaveValue("Bold heading item");
  });

  test("[AC-005] body content survives a page reload exactly as typed", async ({ page }) => {
    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);

    const bodyInput = page.locator("#note-body");
    const text = "Line one.\nLine two with  double  spaces.\nLine three — em dash, and symbols !@#$%";
    await bodyInput.fill(text);
    await page.waitForTimeout(1200);

    await page.reload();
    await expect(bodyInput).toHaveValue(text);
  });

  test("[AC-023][AC-024] no login, sign-up or payment prompt appears at any point in the create-and-use flow", async ({
    page,
  }) => {
    const forbidden =
      /log\s*in|sign\s*in|sign\s*up|register|subscribe|upgrade|payment|billing|credit card/i;
    await expect(page.locator("body")).not.toContainText(forbidden);

    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await expect(page.locator("body")).not.toContainText(forbidden);

    await page.goto("/notes");
    await expect(page.locator("body")).not.toContainText(forbidden);
  });

  test("[AC-027] visible labels on the list screen are English and no language switcher exists", async ({
    page,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
    await expect(page.getByRole("button", { name: /write the first one/i })).toBeVisible();

    const switcherCandidates = page.locator(
      '[aria-label*="language" i], select[name*="lang" i], button:has-text("English"), button:has-text("Español"), button:has-text("Français")',
    );
    await expect(switcherCandidates).toHaveCount(0);
  });

  test("[AC-020][NFR-001] no network request for notes data is made", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/\/api\//.test(url) || /notes/i.test(url.split("?")[0]) === false) return;
    });
    // Track any request whose path looks like a notes/data API call, excluding the app's
    // own static assets and the local dev/preview server's document and script requests.
    page.on("request", (req) => {
      const url = new URL(req.url());
      const isAppOrigin = url.origin === new URL(page.url()).origin;
      const looksLikeDataApi =
        /\/api\//.test(url.pathname) ||
        (/\/notes(\/|$)/.test(url.pathname) && req.method() !== "GET");
      if (looksLikeDataApi && isAppOrigin) {
        apiCalls.push(req.url());
      }
      if (!isAppOrigin) {
        apiCalls.push(req.url());
      }
    });

    await page.getByRole("button", { name: /write the first one/i }).click();
    await expect(page).toHaveURL(/\/notes\/.+/);
    await page.locator("#note-title").fill("No network please");
    await page.waitForTimeout(1200);
    await page.goto("/notes");

    expect(apiCalls).toEqual([]);
  });
});
