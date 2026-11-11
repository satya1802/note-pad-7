import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, describe, expect, it } from "vitest";

import Notes from "./Notes.vue";
import { useNotesStore } from "@/stores/notes";

async function setup() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/notes", component: Notes },
      { path: "/notes/:id", component: { template: "<div>editor</div>" } },
    ],
  });
  await router.push("/notes");
  await router.isReady();
  const wrapper = mount(Notes, { global: { plugins: [router, pinia] } });
  await flushPromises();
  return { wrapper, router };
}

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
  const match = wrapper.findAll("button").find((b) => b.text().includes(text));
  if (!match) throw new Error(`no button found with text "${text}"`);
  return match;
}

describe("Notes", () => {
  afterEach(async () => {
    const store = useNotesStore();
    await store.load();
    for (const note of [...store.notes]) {
      await store.deleteNote(note.id);
    }
  });

  it("[AC-011] shows an empty state with no notes and an action to create one", async () => {
    const { wrapper } = await setup();
    expect(wrapper.text()).toContain("no notes yet");
    expect(findButton(wrapper, "Write the first one")).toBeTruthy();
  });

  it("[AC-010] lists every note by title, and 'Untitled' for a blank title", async () => {
    const store = useNotesStore();
    await store.load();
    const titled = await store.createNote();
    await store.updateNote(titled.id, { title: "Groceries", body: "milk, eggs" });
    await store.createNote();

    const { wrapper } = await setup();
    expect(wrapper.text()).toContain("Groceries");
    expect(wrapper.text()).toContain("Untitled");
  });

  it("[AC-001] Begin a Note creates a note and navigates to the editor", async () => {
    const { wrapper, router } = await setup();
    const store = useNotesStore();
    const before = store.notes.length;

    await findButton(wrapper, "Begin a Note").trigger("click");
    await flushPromises();

    expect(store.notes).toHaveLength(before + 1);
    const created = store.notes.find((n) => n.title === "" && n.body === "");
    expect(created).toBeTruthy();
    expect(router.currentRoute.value.path).toBe(`/notes/${created!.id}`);
  });

  it("[AC-002] creating a second note keeps the first one intact", async () => {
    const seed = useNotesStore();
    await seed.load();
    const first = await seed.createNote();
    await seed.updateNote(first.id, { title: "First note", body: "keep me" });

    const { wrapper } = await setup();
    const store = useNotesStore();
    await findButton(wrapper, "Begin a Note").trigger("click");
    await flushPromises();

    expect(store.notes).toHaveLength(2);
    expect(store.getNote(first.id)?.title).toBe("First note");
    expect(store.getNote(first.id)?.body).toBe("keep me");
  });

  it("[AC-014] a search term filters the list to notes whose title matches", async () => {
    const seed = useNotesStore();
    await seed.load();
    const groceries = await seed.createNote();
    await seed.updateNote(groceries.id, { title: "Groceries", body: "milk, eggs" });
    const workout = await seed.createNote();
    await seed.updateNote(workout.id, { title: "Workout plan", body: "squats, lunges" });

    const { wrapper } = await setup();
    await wrapper.get("#note-search").setValue("grocer");
    await flushPromises();

    expect(wrapper.text()).toContain("Groceries");
    expect(wrapper.text()).not.toContain("Workout plan");
  });

  it("[AC-014] a search term filters the list to notes whose body matches, even when the title does not", async () => {
    const seed = useNotesStore();
    await seed.load();
    const groceries = await seed.createNote();
    await seed.updateNote(groceries.id, { title: "Groceries", body: "milk, eggs, bread" });
    const workout = await seed.createNote();
    await seed.updateNote(workout.id, { title: "Workout plan", body: "squats, lunges" });

    const { wrapper } = await setup();
    await wrapper.get("#note-search").setValue("lunges");
    await flushPromises();

    expect(wrapper.text()).toContain("Workout plan");
    expect(wrapper.text()).not.toContain("Groceries");
  });

  it("[AC-015] a search term matching no notes shows an empty/no-results state, not the full list", async () => {
    const seed = useNotesStore();
    await seed.load();
    const groceries = await seed.createNote();
    await seed.updateNote(groceries.id, { title: "Groceries", body: "milk, eggs" });

    const { wrapper } = await setup();
    await wrapper.get("#note-search").setValue("zzz-no-such-term");
    await flushPromises();

    expect(wrapper.text()).not.toContain("Groceries");
    expect(wrapper.text().toLowerCase()).toMatch(/nothing by that name|no note/);
  });

  it("[AC-016] clearing an active search term shows the full list of all notes again", async () => {
    const seed = useNotesStore();
    await seed.load();
    const groceries = await seed.createNote();
    await seed.updateNote(groceries.id, { title: "Groceries", body: "milk, eggs" });
    const workout = await seed.createNote();
    await seed.updateNote(workout.id, { title: "Workout plan", body: "squats, lunges" });

    const { wrapper } = await setup();
    const search = wrapper.get("#note-search");
    await search.setValue("grocer");
    await flushPromises();
    expect(wrapper.text()).not.toContain("Workout plan");

    await search.setValue("");
    await flushPromises();

    expect(wrapper.text()).toContain("Groceries");
    expect(wrapper.text()).toContain("Workout plan");
  });
});
