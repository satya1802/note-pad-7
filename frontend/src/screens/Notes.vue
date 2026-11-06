<script setup>
/* eslint-disable @typescript-eslint/no-unused-vars -- generated imports, matched generously */
import { ref, computed, onMounted } from "vue";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const navigate = useNavigate();

const PRODUCT = "note pad 7";
const SCREEN = "Notes";

const notes = ref([
  {
    id: "n_0419",
    title: "Boiler service — Flat 2B",
    body:
      "Gas Safe cert runs out 19 Jan. Ring Peckham Heating on 020 7946 0421 and ask for Dermot, he did the last one. Stopcock is under the sink on the left, behind the bleach. Landlord pays, send him the invoice as a photo not a PDF.",
    created_at: "2026-10-28T09:12:00.000Z",
    updated_at: "2026-11-06T08:41:00.000Z",
  },
  {
    id: "n_0418",
    title: "Sourdough — Marta's timings",
    body:
      "Levain at 9pm, 30g starter, 60g flour, 60g water. Mix dough 8am, autolyse one hour. Four sets of folds, forty minutes apart. Bulk until 10am and no further or it goes slack. Shape cold from the fridge. 250C lid on for 20, lid off for 22.",
    created_at: "2026-10-22T20:04:00.000Z",
    updated_at: "2026-11-05T19:55:00.000Z",
  },
  {
    id: "n_0417",
    title: "",
    body: "ring the dentist back before five — they close at half past",
    created_at: "2026-11-05T14:30:00.000Z",
    updated_at: "2026-11-05T14:31:00.000Z",
  },
  {
    id: "n_0416",
    title: "Reading list 2026",
    body:
      "Finished: Stoner, The Dig, A Month in the Country. Next: The Rings of Saturn (borrowed from Priya, give it back by Christmas). Maybe: Piranesi again. Ask Tom what the Icelandic one was called.",
    created_at: "2026-09-02T11:18:00.000Z",
    updated_at: "2026-11-02T10:07:00.000Z",
  },
  {
    id: "n_0415",
    title: "Dad's 60th — ideas",
    body:
      "Lunch at the Anchor rather than a party, he will hate a party. Twelve people at most. Ask Auntie Jean for the photographs from Whitby 1987 and get them scanned. Budget around 400. Cake from the Portuguese place on Bellenden.",
    created_at: "2026-10-11T18:44:00.000Z",
    updated_at: "2026-10-30T21:16:00.000Z",
  },
  {
    id: "n_0414",
    title: "Pantry, week of 3 Nov",
    body:
      "Tinned tomatoes x6, chickpeas, smoked paprika, bay leaves, rice (the brown one in the blue bag), oat milk, coffee beans, washing up liquid, stamps. Not olives, there are two jars open already.",
    created_at: "2026-11-03T07:50:00.000Z",
    updated_at: "2026-11-03T08:02:00.000Z",
  },
]);

const query = ref("");
const focusedId = ref(null);
const hoveredId = ref(null);
const reduceMotion = ref(false);

onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    reduceMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return notes.value;
  return notes.value.filter(
    (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
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
    transition: reduceMotion.value ? "none" : "background-color 160ms ease-out, color 160ms ease-out",
  };
}

function openNote() {
  navigate("note-detail");
}

function createNote() {
  const now = new Date().toISOString();
  notes.value = [
    { id: `n_${Date.now()}`, title: "", body: "", created_at: now, updated_at: now },
    ...notes.value,
  ];
  navigate("note-detail");
}

function clearSearch() {
  query.value = "";
}
</script>

<template>
  <div class="space-y-8" :style="{ color: brand.primaryColor, fontFamily: brand.fontBody }">
    <header class="space-y-4 text-center">
      <h1 class="text-3xl" :style="caps">{{ SCREEN }}</h1>
      <p class="text-[10px] uppercase tracking-[0.35em] tabular-nums" :style="{ color: brand.neutralColor }">
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

    <ul v-if="visible.length" class="grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-2 lg:grid-cols-3">
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
          >{{ monogram(note) }}</span>
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
          <div aria-hidden="true" class="mx-auto mt-3 h-px w-12" :style="{ backgroundColor: brand.accentColor }"></div>
          <p class="mt-3 text-[10px] uppercase tracking-[0.25em] tabular-nums" :style="{ color: brand.neutralColor }">
            Edited {{ formatDate(note.updated_at) }} — {{ wordCount(note) }} {{ wordCount(note) === 1 ? "word" : "words" }}
          </p>
        </article>
      </li>
    </ul>

    <div v-else-if="query.trim()" class="mx-auto max-w-xl p-10 text-center" :style="frame">
      <span
        aria-hidden="true"
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg"
        :style="{ border: `1px solid ${brand.accentColor}`, fontFamily: brand.fontHeading, color: brand.accentColor }"
      >◆</span>
      <h2 class="mt-4 text-sm" :style="caps">Nothing by that name</h2>
      <div aria-hidden="true" class="mx-auto mt-3 h-px w-12" :style="{ backgroundColor: brand.accentColor }"></div>
      <p class="mt-3 text-[10px] uppercase tracking-[0.25em]" :style="{ color: brand.neutralColor }">
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
        :style="{ border: `1px solid ${brand.accentColor}`, fontFamily: brand.fontHeading, color: brand.accentColor }"
      >◆</span>
      <h2 class="mt-4 text-sm" :style="caps">The register is empty</h2>
      <div aria-hidden="true" class="mx-auto mt-3 h-px w-12" :style="{ backgroundColor: brand.accentColor }"></div>
      <p class="mt-3 text-[10px] uppercase tracking-[0.25em]" :style="{ color: brand.neutralColor }">
        Begin a note and it saves itself as you type — no account, no button to press
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
