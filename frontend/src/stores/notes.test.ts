import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNotesStore } from "./notes";

describe("notes store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(async () => {
    const store = useNotesStore();
    await store.load();
    for (const note of [...store.notes]) {
      await store.deleteNote(note.id);
    }
  });

  it("[AC-001] createNote starts with an empty title and body", async () => {
    const store = useNotesStore();
    await store.load();
    const note = await store.createNote();
    expect(note.title).toBe("");
    expect(note.body).toBe("");
  });

  it("[AC-002] createNote adds a distinct record each time, none overwritten", async () => {
    const store = useNotesStore();
    await store.load();
    const a = await store.createNote();
    const b = await store.createNote();
    expect(a.id).not.toBe(b.id);
    expect(store.notes).toHaveLength(2);
    expect(store.notes.some((n) => n.id === a.id)).toBe(true);
    expect(store.notes.some((n) => n.id === b.id)).toBe(true);
  });

  it("updateNote changes only the targeted note", async () => {
    const store = useNotesStore();
    await store.load();
    const a = await store.createNote();
    const b = await store.createNote();
    await store.updateNote(a.id, { title: "A", body: "a body" });
    expect(store.getNote(a.id)?.title).toBe("A");
    expect(store.getNote(b.id)?.title).toBe("");
  });

  it("deleteNote removes only the targeted note", async () => {
    const store = useNotesStore();
    await store.load();
    const a = await store.createNote();
    const b = await store.createNote();
    await store.deleteNote(a.id);
    expect(store.getNote(a.id)).toBeUndefined();
    expect(store.getNote(b.id)).toBeDefined();
  });

  it("[AC-019] a fresh store instance loads notes persisted earlier", async () => {
    const store = useNotesStore();
    await store.load();
    const note = await store.createNote();
    await store.updateNote(note.id, { title: "Persisted", body: "stays" });

    setActivePinia(createPinia());
    const reloaded = useNotesStore();
    await reloaded.load();
    expect(reloaded.getNote(note.id)?.title).toBe("Persisted");
  });

  it("notes getter sorts by updated_at desc", async () => {
    const store = useNotesStore();
    await store.load();
    const a = await store.createNote();
    await new Promise((resolve) => setTimeout(resolve, 2));
    const b = await store.createNote();
    expect(store.notes[0].id).toBe(b.id);
    expect(store.notes[1].id).toBe(a.id);
  });

  it(
    "[AC-021][AC-022][NFR-001] load, createNote, updateNote and deleteNote never call " +
      "fetch, so notes never leave this browser and there is nothing a server could hold " +
      "or sync back once local storage is cleared",
    async () => {
      // A spy that fails the assertion below the moment anything in the notes lifecycle
      // tries to reach a network -- the direct, fast counterpart to the e2e specs that
      // capture real browser requests for the same guarantee (privacy.spec.ts, NFR-001).
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const store = useNotesStore();
      await store.load();
      const note = await store.createNote();
      await store.updateNote(note.id, { title: "Local only", body: "never transmitted" });
      await store.deleteNote(note.id);

      // A second, fresh store instance re-reading persisted state (the unit-level stand-in
      // for "a different browser session opening the app") must also do it with no network
      // call -- the whole point of AC-021/AC-022 is that persistence is local-only.
      setActivePinia(createPinia());
      const reloaded = useNotesStore();
      await reloaded.load();

      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    },
  );
});
