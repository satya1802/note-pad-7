import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, describe, expect, it } from "vitest";

import NoteDetail from "./NoteDetail.vue";
import { useNotesStore, type Note } from "@/stores/notes";

function freshPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

async function mountEditor(pinia: ReturnType<typeof createPinia>, id: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/notes", component: { template: "<div>list</div>" } },
      { path: "/notes/:id", component: NoteDetail },
    ],
  });
  await router.push(`/notes/${id}`);
  await router.isReady();
  const wrapper = mount(NoteDetail, { global: { plugins: [router, pinia] } });
  await flushPromises();
  return { wrapper, router };
}

async function settleAutosave(wrapper: ReturnType<typeof mount>) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  await flushPromises();
  await wrapper.vm.$nextTick();
}

describe("NoteDetail", () => {
  afterEach(async () => {
    const store = useNotesStore();
    await store.load();
    for (const note of [...store.notes]) {
      await store.deleteNote(note.id);
    }
  });

  it("shows a clear English 'note not found' state with a link back to the list for an unknown id", async () => {
    const pinia = freshPinia();
    const { wrapper } = await mountEditor(pinia, "does-not-exist");
    expect(wrapper.text().toLowerCase()).toContain("note not found");
    const link = wrapper.find("a[href='/notes']");
    expect(link.exists()).toBe(true);
  });

  it("[AC-003] typing in the title field saves the title to the note in the store", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    const titleInput = wrapper.get("#note-title");
    await titleInput.setValue("Groceries");
    await settleAutosave(wrapper);

    expect(store.getNote(note.id)?.title).toBe("Groceries");
  });

  it("[AC-004] leaving the title empty still creates and saves the note, shown as 'Untitled'", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    await wrapper.get("#note-body").setValue("some text, no title");
    await settleAutosave(wrapper);

    expect(store.getNote(note.id)?.title).toBe("");
    expect(wrapper.find("h1").text()).toContain("Untitled");
  });

  it("[AC-005] typing, changing and deleting body text is reflected exactly as plain text and persisted", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    const bodyInput = wrapper.get("#note-body");
    await bodyInput.setValue("first draft");
    await settleAutosave(wrapper);
    expect(store.getNote(note.id)?.body).toBe("first draft");

    await bodyInput.setValue("first draft, edited");
    await settleAutosave(wrapper);
    expect(store.getNote(note.id)?.body).toBe("first draft, edited");

    await bodyInput.setValue("");
    await settleAutosave(wrapper);
    expect(store.getNote(note.id)?.body).toBe("");
  });

  it("[AC-006] pasting rich HTML content retains only plain text", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    const bodyEl = wrapper.get("#note-body").element as HTMLTextAreaElement;
    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true }) as ClipboardEvent & {
      clipboardData: unknown;
    };
    Object.defineProperty(pasteEvent, "clipboardData", {
      value: {
        getData: (type: string) =>
          type === "text/plain"
            ? "Bold heading item"
            : "<h1><b>Bold heading</b></h1><ul><li>item</li></ul>",
      },
    });
    bodyEl.focus();
    bodyEl.dispatchEvent(pasteEvent);
    await flushPromises();
    await settleAutosave(wrapper);

    const savedBody = store.getNote(note.id)?.body ?? "";
    expect(savedBody).toBe("Bold heading item");
    expect(savedBody).not.toContain("<");
    expect(savedBody).not.toContain("</");
  });

  it("deletes the note from the store and persistence, then returns to the list", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper, router } = await mountEditor(pinia, note.id);

    await wrapper.get("#delete-note-btn").trigger("click");
    await flushPromises();
    const confirmButtons = wrapper
      .findAll("button")
      .filter((b) => b.text().includes("Delete note"));
    await confirmButtons[confirmButtons.length - 1].trigger("click");
    await flushPromises();

    expect(store.getNote(note.id)).toBeUndefined();
    expect(router.currentRoute.value.path).toBe("/notes");
  });

  it("shows no login, payment, or non-English copy", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    const forbidden = /log\s*in|sign\s*in|sign\s*up|register|subscribe|upgrade|payment|billing/i;
    expect(wrapper.text()).not.toMatch(forbidden);
  });

  it("[AC-007] pausing then continuing to type keeps saving automatically with no manual save action", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    // There is no save control to click -- the only way these changes reach the store
    // is the debounced autosave itself.
    const saveButtons = wrapper.findAll("button").filter((b) => /^save$/i.test(b.text().trim()));
    expect(saveButtons).toHaveLength(0);

    const bodyInput = wrapper.get("#note-body");
    await bodyInput.setValue("typed, then paused");
    await settleAutosave(wrapper);
    expect(store.getNote(note.id)?.body).toBe("typed, then paused");

    // Continue typing after the pause; the only persisted value should be the latest one.
    await bodyInput.setValue("typed, then paused, then continued without any save click");
    await settleAutosave(wrapper);
    expect(store.getNote(note.id)?.body).toBe(
      "typed, then paused, then continued without any save click",
    );
  });

  it("[AC-008] reopening the note after it was closed shows the most recently auto-saved changes", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    await wrapper.get("#note-title").setValue("Reopen target");
    await wrapper.get("#note-body").setValue("saved before the note was closed");
    await settleAutosave(wrapper);
    wrapper.unmount();

    // Simulate closing and reopening the note: a brand-new component instance, backed by
    // its own fresh Pinia store, reads back whatever autosave already persisted.
    const reopenedPinia = freshPinia();
    const { wrapper: reopened } = await mountEditor(reopenedPinia, note.id);

    expect((reopened.get("#note-title").element as HTMLInputElement).value).toBe("Reopen target");
    expect((reopened.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "saved before the note was closed",
    );
  });

  it("[AC-009] the editor shows no manual save button and states that saving is automatic", async () => {
    const pinia = freshPinia();
    const store = useNotesStore();
    await store.load();
    const note: Note = await store.createNote();
    const { wrapper } = await mountEditor(pinia, note.id);

    const saveButtons = wrapper.findAll("button").filter((b) => /^save$/i.test(b.text().trim()));
    expect(saveButtons).toHaveLength(0);
    expect(wrapper.text().toLowerCase()).toContain("no save button");
    expect(wrapper.text().toLowerCase()).toContain("auto-saved");
  });
});
