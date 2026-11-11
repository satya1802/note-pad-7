<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { Button, Input, Textarea, Label } from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { useNotesStore } from "@/stores/notes";

const { IconFileText, IconClock, IconTrash, IconArrowLeft, IconAlertCircle, IconCheckCircle } =
  Icons;

const navigate = useNavigate();
const route = useRoute();
const store = useNotesStore();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SAVE_DELAY = 600;

const title = ref("");
const body = ref("");
const createdAt = ref("");
const updatedAt = ref("");

const loading = ref(true);
const notFound = ref(false);
const status = ref("saved");
const showDelete = ref(false);
const suppress = ref(false);

let saveTimer = null;

const noteId = computed(() => String(route.params.id ?? ""));
const displayTitle = computed(() => (title.value.trim() ? title.value.trim() : "Untitled"));
const isUntitled = computed(() => !title.value.trim());
const wordCount = computed(() => body.value.trim().split(/\s+/).filter(Boolean).length);
const charCount = computed(() => body.value.length);

function fmtDate(iso) {
  if (!iso) return "";
  const p = iso.slice(0, 10).split("-");
  return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1] + " " + p[0];
}

const statusText = computed(() => {
  if (status.value === "pending") return "Changes pending…";
  if (status.value === "saving") return "Saving to this browser…";
  return "Auto-saved";
});

async function loadNote() {
  loading.value = true;
  notFound.value = false;
  if (!store.loaded) {
    await store.load();
  }
  const note = store.getNote(noteId.value);
  if (!note) {
    notFound.value = true;
    loading.value = false;
    return;
  }
  suppress.value = true;
  title.value = note.title;
  body.value = note.body;
  createdAt.value = note.created_at;
  updatedAt.value = note.updated_at;
  loading.value = false;
  await nextTick();
  suppress.value = false;
}

function clearSaveTimer() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
}

function queueSave() {
  clearSaveTimer();
  status.value = "pending";
  saveTimer = setTimeout(async () => {
    status.value = "saving";
    await store.updateNote(noteId.value, { title: title.value, body: body.value });
    const note = store.getNote(noteId.value);
    if (note) updatedAt.value = note.updated_at;
    status.value = "saved";
  }, SAVE_DELAY);
}

watch([title, body], () => {
  if (suppress.value || notFound.value) return;
  queueSave();
});

watch(
  () => route.params.id,
  () => {
    clearSaveTimer();
    void loadNote();
  },
);

function onBodyPaste(event) {
  event.preventDefault();
  const clipboard = event.clipboardData;
  const text = clipboard ? clipboard.getData("text/plain") : "";
  const el = event.target;
  const start = el.selectionStart ?? body.value.length;
  const end = el.selectionEnd ?? body.value.length;
  body.value = body.value.slice(0, start) + text + body.value.slice(end);
  nextTick(() => {
    const pos = start + text.length;
    el.selectionStart = pos;
    el.selectionEnd = pos;
  });
}

function askDelete() {
  showDelete.value = true;
  nextTick(() => {
    document.getElementById("keep-note-btn")?.focus();
  });
}

function closeDelete() {
  showDelete.value = false;
  nextTick(() => {
    document.getElementById("delete-note-btn")?.focus();
  });
}

async function confirmDelete() {
  clearSaveTimer();
  await store.deleteNote(noteId.value);
  showDelete.value = false;
  navigate("notes");
}

function onKey(e) {
  if (e.key === "Escape" && showDelete.value) {
    e.preventDefault();
    closeDelete();
  }
}

onMounted(() => {
  void loadNote();
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  clearSaveTimer();
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div
    class="min-h-screen"
    :style="{
      backgroundColor: brand.backgroundColor,
      color: brand.primaryColor,
      fontFamily: brand.fontBody,
    }"
  >
    <div class="mx-auto w-full max-w-4xl px-4 sm:px-8 py-8 sm:py-12">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <Button
          class="inline-flex items-center gap-2 px-3 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
          :style="{
            backgroundColor: 'transparent',
            color: brand.primaryColor,
            outlineColor: brand.primaryColor,
            border: '1px solid ' + brand.accentColor,
          }"
          @click="navigate('notes')"
        >
          <IconArrowLeft class="h-4 w-4" aria-hidden="true" />
          All notes
        </Button>

        <p
          class="inline-flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.18em]"
          :style="{ border: '1px solid ' + brand.accentColor, color: brand.primaryColor }"
        >
          <IconFileText class="h-3.5 w-3.5" aria-hidden="true" />
          Kept in this browser only
        </p>
      </div>

      <!-- LOADING -->
      <section v-if="loading" class="mt-8" aria-live="polite">
        <div class="p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div
            class="bg-white px-6 sm:px-10 py-14 text-center"
            :style="{ border: '1px solid ' + brand.accentColor }"
          >
            <p
              class="text-[12px] uppercase tracking-[0.3em]"
              :style="{ color: brand.neutralColor }"
            >
              Opening note
            </p>
          </div>
        </div>
      </section>

      <!-- NOT FOUND -->
      <section v-else-if="notFound" class="mt-8" aria-live="polite">
        <div class="p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div
            class="bg-white px-6 sm:px-10 py-12 text-center"
            :style="{ border: '1px solid ' + brand.accentColor }"
          >
            <IconAlertCircle
              class="mx-auto h-6 w-6"
              :style="{ color: brand.neutralColor }"
              aria-hidden="true"
            />
            <h1
              class="mt-5 text-lg uppercase tracking-[0.2em]"
              :style="{ fontFamily: brand.fontHeading }"
            >
              Note not found
            </h1>
            <p
              class="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed"
              :style="{ opacity: 0.75 }"
            >
              This note does not exist in this browser's storage. It may have been deleted, or the
              link may be wrong.
            </p>
            <div class="mt-8 flex justify-center">
              <RouterLink
                to="/notes"
                class="inline-flex items-center gap-2 px-6 py-3 text-[12px] uppercase tracking-[0.2em] focus:outline focus:outline-2 focus:outline-offset-2"
                :style="{
                  backgroundColor: brand.primaryColor,
                  color: brand.accentColor,
                  outlineColor: brand.primaryColor,
                }"
              >
                Back to all notes
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- EDITOR -->
      <section v-else class="mt-8">
        <header class="text-center">
          <h1
            class="text-2xl sm:text-[34px] leading-tight uppercase tracking-[0.16em] break-words"
            :style="{
              fontFamily: brand.fontHeading,
              color: brand.primaryColor,
              opacity: isUntitled ? 0.45 : 1,
            }"
          >
            {{ displayTitle }}
          </h1>
          <p
            class="mt-3 text-[12px] tracking-[0.1em]"
            :style="{
              color: brand.primaryColor,
              opacity: 0.68,
              fontVariantNumeric: 'tabular-nums',
            }"
          >
            Created {{ fmtDate(createdAt) }} &nbsp;·&nbsp; Last edited {{ fmtDate(updatedAt) }}
          </p>
        </header>

        <div class="mt-8 p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div
            class="bg-white px-5 sm:px-10 py-8 sm:py-10"
            :style="{ border: '1px solid ' + brand.accentColor }"
          >
            <div class="mx-auto max-w-[66ch]">
              <Label
                for="note-title"
                class="block text-[11px] uppercase tracking-[0.28em]"
                :style="{ color: brand.neutralColor }"
              >
                Title
              </Label>
              <Input
                id="note-title"
                v-model="title"
                type="text"
                placeholder="Give this note a name"
                class="mt-3 w-full rounded-none border-0 border-b bg-transparent px-0 py-2 text-xl sm:text-2xl tracking-[0.06em] focus:outline focus:outline-2 focus:outline-offset-4"
                :style="{
                  borderColor: brand.accentColor,
                  color: brand.primaryColor,
                  fontFamily: brand.fontHeading,
                  outlineColor: brand.primaryColor,
                }"
              />
              <p v-if="isUntitled" class="mt-2 text-[12px]" :style="{ opacity: 0.6 }">
                Left blank, this note is filed as “Untitled” — it still saves and still appears in
                your list.
              </p>

              <div class="my-8 space-y-[3px]" aria-hidden="true">
                <div class="flex items-center gap-3">
                  <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
                  <span
                    class="h-1.5 w-1.5 rotate-45"
                    :style="{ backgroundColor: brand.primaryColor }"
                  ></span>
                  <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
                </div>
              </div>

              <div class="flex items-baseline justify-between gap-4">
                <Label
                  for="note-body"
                  class="block text-[11px] uppercase tracking-[0.28em]"
                  :style="{ color: brand.neutralColor }"
                >
                  Note
                </Label>
                <span class="text-[11px] tracking-[0.1em]" :style="{ opacity: 0.6 }"
                  >Plain text only</span
                >
              </div>
              <Textarea
                id="note-body"
                v-model="body"
                rows="14"
                placeholder="Start writing. Everything you type is kept on this device as you go."
                class="mt-3 w-full resize-none rounded-none border-0 bg-transparent px-0 py-1 text-[15px] leading-[1.75] focus:outline focus:outline-2 focus:outline-offset-4"
                :style="{
                  color: brand.primaryColor,
                  fontFamily: brand.fontBody,
                  outlineColor: brand.primaryColor,
                  minHeight: '320px',
                }"
                @paste="onBodyPaste"
              />

              <p v-if="!body" class="text-[12px]" :style="{ opacity: 0.6 }">
                This note is empty. Anything you write here saves itself — bold, headings and lists
                are dropped, by design.
              </p>
            </div>

            <div class="mt-8">
              <div class="h-px w-full" :style="{ backgroundColor: brand.accentColor }"></div>
              <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                  class="text-[12px] tracking-[0.08em] order-2 sm:order-1"
                  :style="{ opacity: 0.7, fontVariantNumeric: 'tabular-nums' }"
                >
                  {{ wordCount }} words · {{ charCount }} characters
                </p>

                <p
                  class="order-1 sm:order-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]"
                  :style="{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }"
                  aria-live="polite"
                >
                  <IconCheckCircle v-if="status === 'saved'" class="h-4 w-4" aria-hidden="true" />
                  <IconClock
                    v-else
                    class="h-4 w-4 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {{ statusText }}
                </p>

                <Button
                  id="delete-note-btn"
                  class="order-3 inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
                  :style="{
                    backgroundColor: 'transparent',
                    color: brand.primaryColor,
                    border: '1px solid ' + brand.primaryColor,
                    outlineColor: brand.primaryColor,
                    minHeight: '44px',
                  }"
                  @click="askDelete"
                >
                  <IconTrash class="h-4 w-4" aria-hidden="true" />
                  Delete note
                </Button>
              </div>
            </div>
          </div>
        </div>

        <p class="mt-4 text-center text-[12px]" :style="{ opacity: 0.65 }">
          There is no save button — edits are written to this browser a moment after you stop
          typing.
        </p>
      </section>

      <!-- DELETE CONFIRM -->
      <div
        v-if="showDelete"
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div
          class="w-full max-w-sm bg-white p-6"
          :style="{ border: '1px solid ' + brand.primaryColor }"
        >
          <h2
            id="delete-dialog-title"
            class="text-base uppercase tracking-[0.2em]"
            :style="{ fontFamily: brand.fontHeading }"
          >
            Delete “{{ displayTitle }}”?
          </h2>
          <p class="mt-3 text-[14px]" :style="{ opacity: 0.75 }">
            This removes the note from this browser's storage. There is no cloud copy to recover it
            from.
          </p>
          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              id="keep-note-btn"
              class="min-h-[44px] w-full px-4 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none focus:outline focus:outline-2 focus:outline-offset-2 sm:w-auto"
              :style="{
                backgroundColor: 'transparent',
                color: brand.primaryColor,
                border: '1px solid ' + brand.accentColor,
                outlineColor: brand.primaryColor,
                minHeight: '44px',
              }"
              @click="closeDelete"
            >
              Keep note
            </Button>
            <Button
              class="min-h-[44px] w-full px-4 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none focus:outline focus:outline-2 focus:outline-offset-2 sm:w-auto"
              :style="{
                backgroundColor: brand.primaryColor,
                color: brand.accentColor,
                outlineColor: brand.primaryColor,
                minHeight: '44px',
              }"
              @click="confirmDelete"
            >
              Delete note
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
