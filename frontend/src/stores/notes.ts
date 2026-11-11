import { defineStore } from "pinia";
import localforage from "localforage";

export interface Note {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

// A dedicated instance (rather than localforage's default) keeps this app's notes in their
// own IndexedDB database/localStorage keyspace, with localforage choosing IndexedDB first
// and falling back to localStorage automatically when IndexedDB is unavailable.
const storage = localforage.createInstance({
  name: "notepad7",
  storeName: "notes",
});

const STORAGE_KEY = "notes";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface NotesState {
  items: Note[];
  loaded: boolean;
}

export const useNotesStore = defineStore("notes", {
  state: (): NotesState => ({
    items: [],
    loaded: false,
  }),
  getters: {
    notes(state): Note[] {
      return [...state.items].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
    },
  },
  actions: {
    async load(): Promise<void> {
      const saved = await storage.getItem<Note[]>(STORAGE_KEY);
      this.items = saved ?? [];
      this.loaded = true;
    },
    async persist(): Promise<void> {
      // `this.items` is Pinia/Vue reactive state: its entries are Proxy-wrapped objects.
      // A real browser's IndexedDB uses the structured clone algorithm, which throws
      // DataCloneError on a Proxy (localforage's localStorage fallback and the fake
      // IndexedDB used in unit tests are both lenient and hide this). Writing a plain,
      // JSON-safe copy keeps autosave working against the real browser store.
      const plain = JSON.parse(JSON.stringify(this.items)) as Note[];
      await storage.setItem(STORAGE_KEY, plain);
    },
    async createNote(): Promise<Note> {
      const now = new Date().toISOString();
      const note: Note = {
        id: createId(),
        title: "",
        body: "",
        created_at: now,
        updated_at: now,
      };
      this.items = [...this.items, note];
      await this.persist();
      return note;
    },
    async updateNote(id: string, changes: { title?: string; body?: string }): Promise<void> {
      const note = this.items.find((n) => n.id === id);
      if (!note) return;
      if (changes.title !== undefined) note.title = changes.title;
      if (changes.body !== undefined) note.body = changes.body;
      note.updated_at = new Date().toISOString();
      await this.persist();
    },
    async deleteNote(id: string): Promise<void> {
      this.items = this.items.filter((n) => n.id !== id);
      await this.persist();
    },
    getNote(id: string): Note | undefined {
      return this.items.find((n) => n.id === id);
    },
  },
});
