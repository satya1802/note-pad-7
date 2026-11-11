<script setup>
import { ref, computed, onMounted } from "vue";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { useNotesStore } from "@/stores/notes";

const navigate = useNavigate();
const store = useNotesStore();

const PRODUCT = "note pad 7";
const SCREEN = "Notes";

const query = ref("");
const focusedId = ref(null);
const hoveredId = ref(null);
const reduceMotion = ref(false);

onMounted(async () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    reduceMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  if (!store.loaded) {
    await store.load();
  }
});

const frame = {
  border: `1px solid ${brand.accentColor}`,
  outline: `1px solid ${brand.primaryColor}`,
  outlineOffset: 3,
  borderRadius: brand.radius,
};

const caps = {
  fontFamily: brand.fontHeading,
  textTransform: "uppercase",
  letterSpacing: "0.3em",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const notes = computed(() => store.notes);

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return notes.value;
  return notes.value.filter(
    (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
  );
});

const registerLine = computed(() => {
  const n = visible.value.length;
  if (!notes.value.length) return `${PRODUCT} — kept in this browser alone`;
  if (query.value.trim()) return `${PRODUCT} — ${n} of ${notes.value.length} matching`;
  return `${PRODUCT} — ${n} ${n === 1 ? "note" : "notes"} in this browser`;
});

function label(note) {
  return note.title.trim() || "Untitled";
}

function monogram(note) {
  return label(note).charAt(0).toUpperCase();
}

function wordCount(note) {
  const w = note.body.trim().split(/\s+/).filter(Boolean);
  return w.length;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function cardStyle(note) {
  const lit = focusedId.value === note.id || hoveredId.value === note.id;
  return {
    ...frame,
    boxShadow: lit ? `inset 0 0 0 1px ${brand.accentColor}` : "none",
    transition: reduceMotion.value ? "none" : "box-shadow 160ms ease-out",
  };
}

function medallionStyle(note) {
  const lit = focusedId.value === note.id || hoveredId.value === note.id;
  return {
    border: `1px solid ${brand.accentColor}`,
    fontFamily: brand.fontHeading,
    backgroundColor: lit ? brand.accentColor : "transparent",
    color: lit ? brand.primaryColor : brand.accentColor,
    transition: reduceMotion.value
      ? "none"
      : "background-color 160ms ease-out, color 160ms ease-out",
  };
}

function openNote(note) {
  navigate(`notes/${note.id}`);
}

async function createNote() {
  const note = await store.createNote();
  navigate(`notes/${note.id}`);
}

function clearSearch() {
  query.value = "";
}
</script>

<template>
  <div class="space-y-8" :style="{ color: brand.primaryColor, fontFamily: brand.fontBody }">
    <header class="space-y-4 text-center">
      <h1 class="text-3xl" :style="caps">{{ SCREEN }}</h1>
      <p
        class="text-[10px] uppercase tracking-[0.35em] tabular-nums"
        :style="{ color: brand.neutralColor }"
      >
        {{ registerLine }}
      </p>
      <div aria-hidden="true" class="flex items-center gap-3">
        <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
        <span class="text-xs" :style="{ color: brand.accentColor }">◆</span>
        <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
      </div>
    </header>

    <div class="mx-auto flex max-w-xl flex-col items-stretch gap-4 sm:flex-row sm:items-center">
      <label for="note-search" class="sr-only">Search your notes by title or text</label>
      <input
        id="note-search"
        v-model="query"
        type="search"
        placeholder="SEARCH YOUR NOTES"
        class="h-11 flex-1 bg-transparent px-4 text-center text-xs tracking-[0.25em] outline-none placeholder:opacity-60 focus:ring-0"
        :style="{
          border: `1px solid ${focusedId === 'search' ? brand.primaryColor : brand.accentColor}`,
          borderRadius: brand.radius,
          color: brand.primaryColor,
          boxShadow: focusedId === 'search' ? `inset 0 0 0 1px ${brand.accentColor}` : 'none',
        }"
        @focus="focusedId = 'search'"
        @blur="focusedId = null"
      />
      <button
        type="button"
        class="h-11 shrink-0 px-6 text-[10px] uppercase tracking-[0.3em] focus:outline-none"
        :style="{
          backgroundColor: brand.primaryColor,
          color: brand.accentColor,
          border: `1px solid ${brand.accentColor}`,
          borderRadius: brand.radius,
          fontFamily: brand.fontHeading,
          outline: focusedId === 'new' ? `1px solid ${brand.primaryColor}` : 'none',
          outlineOffset: 3,
        }"
        @focus="focusedId = 'new'"
        @blur="focusedId = null"
        @click="createNote"
      >
        Begin a Note
      </button>
    </div>

    <ul
      v-if="visible.length"
      class="grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="note in visible" :key="note.id">
        <article
          class="relative h-full p-7 text-center"
          :style="cardStyle(note)"
          @mouseenter="hoveredId = note.id"
          @mouseleave="hoveredId = null"
        >
          <span
            aria-hidden="true"
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg"
            :style="medallionStyle(note)"
            >{{ monogram(note) }}</span
          >
          <h2 class="mt-4 text-sm" :style="caps">
            <button
              type="button"
              class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
              :style="{ fontFamily: brand.fontHeading, color: brand.primaryColor }"
              @focus="focusedId = note.id"
              @blur="focusedId = null"
              @click="openNote(note)"
            >
              {{ label(note) }}
              <span class="sr-only"> — open to read and edit</span>
            </button>
          </h2>
          <div
            aria-hidden="true"
            class="mx-auto mt-3 h-px w-12"
            :style="{ backgroundColor: brand.accentColor }"
          ></div>
          <p
            class="mt-3 text-[10px] uppercase tracking-[0.25em] tabular-nums"
            :style="{ color: brand.neutralColor }"
          >
            Edited {{ formatDate(note.updated_at) }} — {{ wordCount(note) }}
            {{ wordCount(note) === 1 ? "word" : "words" }}
          </p>
        </article>
      </li>
    </ul>

    <div v-else-if="query.trim()" class="mx-auto max-w-xl p-10 text-center" :style="frame">
      <span
        aria-hidden="true"
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg"
        :style="{
          border: `1px solid ${brand.accentColor}`,
          fontFamily: brand.fontHeading,
          color: brand.accentColor,
        }"
        >◆</span
      >
      <h2 class="mt-4 text-sm" :style="caps">Nothing by that name</h2>
      <div
        aria-hidden="true"
        class="mx-auto mt-3 h-px w-12"
        :style="{ backgroundColor: brand.accentColor }"
      ></div>
      <p
        class="mt-3 text-[10px] uppercase tracking-[0.25em]"
        :style="{ color: brand.neutralColor }"
      >
        No note holds “{{ query.trim() }}” in its title or its text
      </p>
      <button
        type="button"
        class="mt-6 h-11 px-6 text-[10px] uppercase tracking-[0.3em] focus:outline-none"
        :style="{
          backgroundColor: brand.primaryColor,
          color: brand.accentColor,
          border: `1px solid ${brand.accentColor}`,
          borderRadius: brand.radius,
          fontFamily: brand.fontHeading,
          outline: focusedId === 'clear' ? `1px solid ${brand.primaryColor}` : 'none',
          outlineOffset: 3,
        }"
        @focus="focusedId = 'clear'"
        @blur="focusedId = null"
        @click="clearSearch"
      >
        Show all notes
      </button>
    </div>

    <div v-else class="mx-auto max-w-xl p-10 text-center" :style="frame">
      <span
        aria-hidden="true"
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg"
        :style="{
          border: `1px solid ${brand.accentColor}`,
          fontFamily: brand.fontHeading,
          color: brand.accentColor,
        }"
        >◆</span
      >
      <h2 class="mt-4 text-sm" :style="caps">The register is empty</h2>
      <div
        aria-hidden="true"
        class="mx-auto mt-3 h-px w-12"
        :style="{ backgroundColor: brand.accentColor }"
      ></div>
      <p
        class="mt-3 text-[10px] uppercase tracking-[0.25em]"
        :style="{ color: brand.neutralColor }"
      >
        There are no notes yet — begin one and it saves itself as you type, no account, no button
        to press
      </p>
      <button
        type="button"
        class="mt-6 h-11 px-6 text-[10px] uppercase tracking-[0.3em] focus:outline-none"
        :style="{
          backgroundColor: brand.primaryColor,
          color: brand.accentColor,
          border: `1px solid ${brand.accentColor}`,
          borderRadius: brand.radius,
          fontFamily: brand.fontHeading,
          outline: focusedId === 'first' ? `1px solid ${brand.primaryColor}` : 'none',
          outlineOffset: 3,
        }"
        @focus="focusedId = 'first'"
        @blur="focusedId = null"
        @click="createNote"
      >
        Write the first one
      </button>
    </div>
  </div>
</template>
