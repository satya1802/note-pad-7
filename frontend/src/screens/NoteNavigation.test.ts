import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, describe, expect, it } from "vitest";

import Notes from "./Notes.vue";
import NoteDetail from "./NoteDetail.vue";
import { useNotesStore } from "@/stores/notes";

function freshPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

// Notes.test.ts and NoteDetail.test.ts each mount one screen with the other stubbed out,
// which proves every screen's own behaviour but never that picking a note in the real list
// actually hands the real editor the right note. This file wires both real components
// behind one router -- the integration AC-012/AC-013 are actually about.
async function mountApp(pinia: ReturnType<typeof createPinia>) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/notes", component: Notes },
      { path: "/notes/:id", component: NoteDetail },
    ],
  });
  await router.push("/notes");
  await router.isReady();
  const wrapper = mount({ template: "<router-view />" }, { global: { plugins: [router, pinia] } });
  await flushPromises();
  return { wrapper, router };
}

function findNoteButton(wrapper: ReturnType<typeof mount>, title: string) {
  const match = wrapper.findAll("button").find((b) => b.text().includes(title));
  if (!match) throw new Error(`no note button found for "${title}"`);
  return match;
}

function findBackButton(wrapper: ReturnType<typeof mount>) {
  const match = wrapper.findAll("button").find((b) => b.text().includes("All notes"));
  if (!match) throw new Error("no 'All notes' back button found");
  return match;
}

describe("navigating from the notes list into the editor", () => {
  afterEach(async () => {
    const store = useNotesStore();
    await store.load();
    for (const note of [...store.notes]) {
      await store.deleteNote(note.id);
    }
  });

  it("[AC-012] selecting a note from the real list opens the real editor with its title and full body", async () => {
    const pinia = freshPinia();
    const seed = useNotesStore();
    await seed.load();
    const note = await seed.createNote();
    await seed.updateNote(note.id, {
      title: "Meeting notes",
      body: "Discuss roadmap, budget and next quarter's hiring plan.",
    });

    const { wrapper, router } = await mountApp(pinia);

    await findNoteButton(wrapper, "Meeting notes").trigger("click");
    await flushPromises();

    expect(router.currentRoute.value.path).toBe(`/notes/${note.id}`);
    expect((wrapper.get("#note-title").element as HTMLInputElement).value).toBe("Meeting notes");
    expect((wrapper.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "Discuss roadmap, budget and next quarter's hiring plan.",
    );
  });

  it("[AC-013] returning to the list and opening a different note shows that note's own content, not the previous one's", async () => {
    const pinia = freshPinia();
    const seed = useNotesStore();
    await seed.load();
    const first = await seed.createNote();
    await seed.updateNote(first.id, { title: "First note", body: "content of the first note" });
    const second = await seed.createNote();
    await seed.updateNote(second.id, {
      title: "Second note",
      body: "content of the second note",
    });

    const { wrapper, router } = await mountApp(pinia);

    // Open the first note and confirm it shows its own content.
    await findNoteButton(wrapper, "First note").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe(`/notes/${first.id}`);
    expect((wrapper.get("#note-title").element as HTMLInputElement).value).toBe("First note");
    expect((wrapper.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "content of the first note",
    );

    // Return to the list, then open the second note: the editor must now show the second
    // note's content -- not a stale copy of the first one it just displayed.
    await findBackButton(wrapper).trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/notes");

    await findNoteButton(wrapper, "Second note").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe(`/notes/${second.id}`);
    expect((wrapper.get("#note-title").element as HTMLInputElement).value).toBe("Second note");
    expect((wrapper.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "content of the second note",
    );

    // And the reverse direction: going back again and reopening the first note still shows
    // the first note's content, proving neither selection leaked into the other.
    await findBackButton(wrapper).trigger("click");
    await flushPromises();
    await findNoteButton(wrapper, "First note").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe(`/notes/${first.id}`);
    expect((wrapper.get("#note-title").element as HTMLInputElement).value).toBe("First note");
    expect((wrapper.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "content of the first note",
    );
  });

  it("[AC-014] opening a note from a filtered search list opens that note, not another one sharing the term", async () => {
    const pinia = freshPinia();
    const seed = useNotesStore();
    await seed.load();
    const groceries = await seed.createNote();
    await seed.updateNote(groceries.id, {
      title: "Groceries",
      body: "milk, eggs, bread -- buy before the weekend",
    });
    const reading = await seed.createNote();
    await seed.updateNote(reading.id, {
      title: "Reading list",
      body: "a book that mentions groceries in passing",
    });
    const workout = await seed.createNote();
    await seed.updateNote(workout.id, { title: "Workout plan", body: "squats, lunges" });

    const { wrapper, router } = await mountApp(pinia);

    await wrapper.get("#note-search").setValue("grocer");
    await flushPromises();

    // Both notes mentioning "grocer" remain, the unrelated one is filtered out.
    expect(wrapper.text()).toContain("Groceries");
    expect(wrapper.text()).toContain("Reading list");
    expect(wrapper.text()).not.toContain("Workout plan");

    // Selecting the body-match result opens that exact note, not the title-match one,
    // proving the filtered list wires each result button to its own note's id.
    await findNoteButton(wrapper, "Reading list").trigger("click");
    await flushPromises();

    expect(router.currentRoute.value.path).toBe(`/notes/${reading.id}`);
    expect((wrapper.get("#note-title").element as HTMLInputElement).value).toBe("Reading list");
    expect((wrapper.get("#note-body").element as HTMLTextAreaElement).value).toBe(
      "a book that mentions groceries in passing",
    );
  });
});
