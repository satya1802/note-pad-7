<script setup>
/* eslint-disable @typescript-eslint/no-unused-vars -- generated imports, matched generously */
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { Button, Input, Textarea, Label, Empty } from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { IconChevronRight, IconFileText, IconClock, IconTrash, IconArrowLeft, IconAlertCircle, IconCheckCircle } = Icons;
const navigate = useNavigate();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TODAY = '2026-11-06'
const YESTERDAY = '2026-11-05'
const LIMIT = 2000

const notes = reactive([
  {
    id: 'n-7f31',
    title: 'Sourdough — Thursday bake',
    body: 'Starter fed Wednesday 8pm, doubled by 11.\n\n500g strong white, 50g rye, 360g water, 100g starter, 11g salt.\n\nAutolyse 40 min. Four sets of folds, 30 min apart. Bulk until it is 60% risen — kitchen was 19C so it took closer to five hours.\n\nShape, fridge overnight, bake 250C with the lid on for 20, then 215C lid off for 22.\n\nLast week the crumb was tight at the base. Lighter hand on the final shaping.',
    created_at: '2026-10-28T19:05:00',
    updated_at: '2026-11-06T14:32:00'
  },
  {
    id: 'n-7e02',
    title: 'Packing — Lisbon, 21–26 Nov',
    body: 'Flights: TP1363 out 21 Nov 07:40, back 26 Nov 19:15.\n\nPassport, travel insurance card, charger and the EU adapter, running shoes, grey linen shirt, sunglasses, something to read on the plane.\n\nTell the Hendersons about the bins. Cancel the Thursday milk.\n\nFerreira: Rua da Bica 42, ring the top bell.',
    created_at: '2026-11-02T09:41:00',
    updated_at: '2026-11-06T08:17:00'
  },
  {
    id: 'n-7d90',
    title: 'Rent review — 14 Ashcombe Row',
    body: 'Letter from Marwood & Sons dated 29 Oct. Proposed increase from £1,240 to £1,395 from 1 Feb.\n\nLast review was Feb 2025 and that was 4.1%. This one is 12.5%.\n\nAsk about the hallway damp and the boiler service that never happened.\n\nReply by 30 Nov. Short, and in writing.',
    created_at: '2026-10-30T18:22:00',
    updated_at: '2026-11-05T21:09:00'
  },
  {
    id: 'n-7c55',
    title: '',
    body: "ring the vet about Pip's booster — Tuesday after 2pm\nthey shut for lunch 1–2",
    created_at: '2026-11-05T13:50:00',
    updated_at: '2026-11-05T13:51:00'
  },
  {
    id: 'n-7b18',
    title: "Priya's birthday — ideas",
    body: 'Turning 34 on 19 Dec.\n\nThe ceramics class at Fold Studio. That navy enamel kettle she keeps mentioning. Tickets for the Mingus night at the Vortex.\n\nBudget around £60. Ask Dan whether he wants to go in together.',
    created_at: '2026-10-24T20:02:00',
    updated_at: '2026-11-03T12:44:00'
  },
  {
    id: 'n-7a04',
    title: 'Quotes worth keeping',
    body: '"A man who carries a cat by the tail learns something he can learn in no other way." — Twain\n\n"Nothing is less real than realism." — O\'Keeffe\n\n"The trouble is, you think you have time."',
    created_at: '2026-09-11T22:30:00',
    updated_at: '2026-10-27T07:58:00'
  },
  {
    id: 'n-79c1',
    title: 'Weeknight meals that actually work',
    body: 'Lemon orzo with peas — 20 minutes, one pan.\nHarissa chickpeas, yoghurt, flatbread.\nFried rice with whatever is in the drawer.\nPuttanesca — there is always a tin of anchovies at the back.\n\nShopping: capers, frozen peas, flatbread, feta.',
    created_at: '2026-08-19T17:12:00',
    updated_at: '2026-10-19T19:03:00'
  }
])

const currentId = ref('n-7f31')
const title = ref('')
const body = ref('')
const updatedAt = ref('')
const createdAt = ref('')

const loading = ref(true)
const fading = ref(false)
const status = ref('saved')
const savedClock = ref(14 * 60 + 32)
const showDelete = ref(false)
const deletedTitle = ref('')
const deleted = ref(false)
const suppress = ref(false)

let t1 = null
let t2 = null
let t3 = null
let tLoad = null

function pad(n) { return n < 10 ? '0' + n : '' + n }
function clockLabel(mins) { return pad(Math.floor(mins / 60) % 24) + ':' + pad(mins % 60) }
function fmtDate(iso) {
  const p = iso.slice(0, 10).split('-')
  return Number(p[2]) + ' ' + MONTHS[Number(p[1]) - 1] + ' ' + p[0]
}
function editedLabel(iso) {
  const day = iso.slice(0, 10)
  const time = iso.slice(11, 16)
  if (day === TODAY) return 'Today at ' + time
  if (day === YESTERDAY) return 'Yesterday at ' + time
  return fmtDate(iso) + ' at ' + time
}
function shortLabel(iso) {
  const day = iso.slice(0, 10)
  if (day === TODAY) return 'Today ' + iso.slice(11, 16)
  if (day === YESTERDAY) return 'Yesterday ' + iso.slice(11, 16)
  return fmtDate(iso)
}
function grouped(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

const current = computed(() => notes.find((n) => n.id === currentId.value))
const otherNotes = computed(() => notes.filter((n) => n.id !== currentId.value))
const displayTitle = computed(() => (title.value.trim() ? title.value.trim() : 'Untitled'))
const isUntitled = computed(() => !title.value.trim())
const charCount = computed(() => body.value.length)
const wordCount = computed(() => body.value.trim().split(/\s+/).filter(Boolean).length)
const overLimit = computed(() => charCount.value > LIMIT)
const nearLimit = computed(() => !overLimit.value && charCount.value > LIMIT - 300)
const nextNote = computed(() => notes[0])

function loadInto(note) {
  suppress.value = true
  currentId.value = note.id
  title.value = note.title
  body.value = note.body
  createdAt.value = note.created_at
  updatedAt.value = note.updated_at
  nextTick(() => { suppress.value = false })
}

loadInto(notes[0])

function commit() {
  const n = current.value
  if (!n) return
  savedClock.value = savedClock.value + 1
  const stamp = TODAY + 'T' + clockLabel(savedClock.value) + ':00'
  n.title = title.value
  n.body = body.value
  n.updated_at = stamp
  updatedAt.value = stamp
}

function clearSaveTimers() {
  if (t1) clearTimeout(t1)
  if (t2) clearTimeout(t2)
  t1 = null
  t2 = null
}

function queueSave() {
  clearSaveTimers()
  status.value = 'pending'
  t1 = setTimeout(() => {
    if (overLimit.value) {
      status.value = 'error'
      return
    }
    status.value = 'saving'
    t2 = setTimeout(() => {
      commit()
      status.value = 'saved'
    }, 420)
  }, 600)
}

watch([title, body], () => {
  if (suppress.value) return
  queueSave()
})

function openNote(id) {
  const target = notes.find((n) => n.id === id)
  if (!target) return
  clearSaveTimers()
  if (status.value === 'pending' || status.value === 'saving') {
    commit()
    status.value = 'saved'
  }
  fading.value = true
  t3 = setTimeout(() => {
    loadInto(target)
    deleted.value = false
    nextTick(() => { fading.value = false })
  }, 160)
}

function askDelete() {
  showDelete.value = true
  nextTick(() => {
    const el = document.getElementById('keep-note-btn')
    if (el) el.focus()
  })
}

function closeDelete() {
  showDelete.value = false
  nextTick(() => {
    const el = document.getElementById('delete-note-btn')
    if (el) el.focus()
  })
}

function confirmDelete() {
  clearSaveTimers()
  const idx = notes.findIndex((n) => n.id === currentId.value)
  if (idx > -1) {
    deletedTitle.value = notes[idx].title.trim() || 'Untitled'
    notes.splice(idx, 1)
  }
  showDelete.value = false
  deleted.value = true
  status.value = 'saved'
}

function onKey(e) {
  if (e.key === 'Escape' && showDelete.value) {
    e.preventDefault()
    closeDelete()
  }
}

onMounted(() => {
  tLoad = setTimeout(() => { loading.value = false }, 520)
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  clearSaveTimers()
  if (t3) clearTimeout(t3)
  if (tLoad) clearTimeout(tLoad)
  window.removeEventListener('keydown', onKey)
})

const statusText = computed(() => {
  if (status.value === 'pending') return 'Changes pending…'
  if (status.value === 'saving') return 'Saving to this browser…'
  if (status.value === 'error') return 'Not saved — note is over length'
  return 'Auto-saved at ' + clockLabel(savedClock.value)
})
</script>

<template>
  <div
    class="min-h-screen"
    :style="{ backgroundColor: brand.backgroundColor, color: brand.primaryColor, fontFamily: brand.fontBody }"
  >
    <div class="mx-auto w-full max-w-4xl px-4 sm:px-8 py-8 sm:py-12">

      <!-- Top row: back + local-storage chip -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <Button
          class="inline-flex items-center gap-2 px-3 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
          :style="{ backgroundColor: 'transparent', color: brand.primaryColor, outlineColor: brand.primaryColor, border: '1px solid ' + brand.accentColor }"
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

      <!-- Masthead -->
      <header class="mt-8 sm:mt-10 text-center">
        <p class="text-[11px] uppercase tracking-[0.42em]" :style="{ color: brand.neutralColor }">
          Notepad N<span class="align-super text-[8px]">o</span> 7
        </p>

        <div class="mt-5 space-y-[3px]" aria-hidden="true">
          <div class="flex items-center gap-3">
            <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
            <span class="h-2 w-2 rotate-45" :style="{ backgroundColor: brand.accentColor }"></span>
            <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
          </div>
          <div class="h-px w-full" :style="{ backgroundColor: brand.primaryColor, opacity: 0.35 }"></div>
        </div>

        <h1
          class="mt-6 text-2xl sm:text-[34px] leading-tight uppercase tracking-[0.16em] break-words"
          :style="{ fontFamily: brand.fontHeading, color: brand.primaryColor, opacity: isUntitled ? 0.45 : 1 }"
        >
          {{ deleted ? 'Note deleted' : displayTitle }}
        </h1>

        <p
          v-if="!deleted && !loading"
          class="mt-3 text-[12px] tracking-[0.1em]"
          style="font-variant-numeric: tabular-nums"
          :style="{ color: brand.primaryColor, opacity: 0.68, fontVariantNumeric: 'tabular-nums' }"
        >
          No. {{ currentId.replace('n-', '') }} &nbsp;·&nbsp; Created {{ fmtDate(createdAt) }} &nbsp;·&nbsp; Last edited {{ editedLabel(updatedAt) }}
        </p>
      </header>

      <!-- LOADING -->
      <section v-if="loading" class="mt-8" aria-live="polite">
        <div class="p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div class="bg-white px-6 sm:px-10 py-14 text-center" :style="{ border: '1px solid ' + brand.accentColor }">
            <p class="text-[12px] uppercase tracking-[0.3em]" :style="{ color: brand.neutralColor }">
              Opening note
            </p>
            <div class="mx-auto mt-8 max-w-[52ch] space-y-3 animate-pulse motion-reduce:animate-none">
              <div class="h-3 w-2/3 mx-auto" :style="{ backgroundColor: brand.accentColor, opacity: 0.4 }"></div>
              <div class="h-2 w-full" :style="{ backgroundColor: brand.accentColor, opacity: 0.28 }"></div>
              <div class="h-2 w-11/12" :style="{ backgroundColor: brand.accentColor, opacity: 0.28 }"></div>
              <div class="h-2 w-4/5" :style="{ backgroundColor: brand.accentColor, opacity: 0.28 }"></div>
            </div>
            <p class="mt-8 text-[12px]" :style="{ color: brand.primaryColor, opacity: 0.6 }">
              Reading from this browser's storage. Nothing leaves the device.
            </p>
          </div>
        </div>
      </section>

      <!-- DELETED (success) -->
      <section v-else-if="deleted" class="mt-8" aria-live="polite">
        <div class="p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div class="bg-white px-6 sm:px-10 py-12 text-center" :style="{ border: '1px solid ' + brand.accentColor }">
            <IconCheckCircle class="mx-auto h-6 w-6" :style="{ color: brand.neutralColor }" aria-hidden="true" />
            <h2 class="mt-5 text-lg uppercase tracking-[0.2em]" :style="{ fontFamily: brand.fontHeading }">
              “{{ deletedTitle }}” is gone
            </h2>
            <p class="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed" :style="{ opacity: 0.75 }">
              Removed from this browser's storage. There was never a cloud copy, so there is nothing left to undo it with.
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                class="px-6 py-3 text-[12px] uppercase tracking-[0.2em] rounded-none transition-opacity duration-200 motion-reduce:transition-none hover:opacity-85 focus:outline focus:outline-2 focus:outline-offset-2"
                :style="{ backgroundColor: brand.primaryColor, color: brand.accentColor, outlineColor: brand.primaryColor }"
                @click="navigate('notes')"
              >
                Back to all notes
              </Button>
              <Button
                v-if="nextNote"
                class="px-6 py-3 text-[12px] uppercase tracking-[0.2em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
                :style="{ backgroundColor: 'transparent', color: brand.primaryColor, border: '1px solid ' + brand.accentColor, outlineColor: brand.primaryColor }"
                @click="openNote(nextNote.id)"
              >
                Open “{{ nextNote.title.trim() || 'Untitled' }}”
              </Button>
            </div>
          </div>
        </div>
      </section>

      <!-- EDITOR -->
      <section
        v-else
        class="mt-8 transition-opacity duration-200 motion-reduce:transition-none"
        :class="fading ? 'opacity-0' : 'opacity-100'"
      >
        <h2 class="sr-only">Edit this note</h2>

        <!-- over-length error -->
        <div
          v-if="status === 'error'"
          class="mb-4 p-[3px]"
          :style="{ border: '1px solid ' + brand.primaryColor }"
          role="alert"
        >
          <div class="px-5 py-4 flex gap-3 items-start" :style="{ backgroundColor: brand.primaryColor, border: '1px solid ' + brand.accentColor }">
            <IconAlertCircle class="h-5 w-5 shrink-0 mt-0.5" :style="{ color: brand.accentColor }" aria-hidden="true" />
            <div>
              <p class="text-[12px] uppercase tracking-[0.2em]" :style="{ color: brand.accentColor, fontFamily: brand.fontHeading }">
                Auto-save paused
              </p>
              <p class="mt-2 text-[14px] leading-relaxed" :style="{ color: brand.backgroundColor }">
                This note has outgrown its drawer —
                <span :style="{ fontVariantNumeric: 'tabular-nums' }">{{ grouped(charCount) }}</span>
                of {{ grouped(LIMIT) }} characters a single note can hold in this browser. Every word is still on screen and nothing has been thrown away; trim the note and saving picks up where it left off.
              </p>
            </div>
          </div>
        </div>

        <div class="p-[3px]" :style="{ border: '1px solid ' + brand.primaryColor }">
          <div class="bg-white px-5 sm:px-10 py-8 sm:py-10" :style="{ border: '1px solid ' + brand.accentColor }">
            <div class="mx-auto max-w-[66ch]">

              <!-- Title -->
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
                :style="{ borderColor: brand.accentColor, color: brand.primaryColor, fontFamily: brand.fontHeading, outlineColor: brand.primaryColor }"
              />
              <p v-if="isUntitled" class="mt-2 text-[12px]" :style="{ opacity: 0.6 }">
                Left blank, this note is filed as “Untitled” — it still saves and still appears in your list.
              </p>

              <!-- Ornamental rule -->
              <div class="my-8 space-y-[3px]" aria-hidden="true">
                <div class="flex items-center gap-3">
                  <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
                  <span class="h-1.5 w-1.5 rotate-45" :style="{ backgroundColor: brand.primaryColor }"></span>
                  <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
                </div>
              </div>

              <!-- Body -->
              <div class="flex items-baseline justify-between gap-4">
                <Label
                  for="note-body"
                  class="block text-[11px] uppercase tracking-[0.28em]"
                  :style="{ color: brand.neutralColor }"
                >
                  Note
                </Label>
                <span class="text-[11px] tracking-[0.1em]" :style="{ opacity: 0.6 }">Plain text only</span>
              </div>
              <Textarea
                id="note-body"
                v-model="body"
                rows="14"
                placeholder="Start writing. Everything you type is kept on this device as you go."
                class="mt-3 w-full resize-none rounded-none border-0 bg-transparent px-0 py-1 text-[15px] leading-[1.75] focus:outline focus:outline-2 focus:outline-offset-4"
                :style="{ color: brand.primaryColor, fontFamily: brand.fontBody, outlineColor: brand.primaryColor, minHeight: '320px' }"
              />

              <p v-if="!body" class="text-[12px]" :style="{ opacity: 0.6 }">
                This note is empty. Anything you write here saves itself — bold, headings and lists are dropped, by design.
              </p>
              <p
                v-else-if="nearLimit"
                class="text-[12px]"
                :style="{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }"
              >
                {{ grouped(LIMIT - charCount) }} characters left before this note stops saving.
              </p>
            </div>

            <!-- Frame footer -->
            <div class="mt-8">
              <div class="h-px w-full" :style="{ backgroundColor: brand.accentColor }"></div>
              <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                  class="text-[12px] tracking-[0.08em] order-2 sm:order-1"
                  :style="{ opacity: 0.7, fontVariantNumeric: 'tabular-nums' }"
                >
                  {{ grouped(wordCount) }} words · {{ grouped(charCount) }} / {{ grouped(LIMIT) }} characters
                </p>

                <p
                  class="order-1 sm:order-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]"
                  :style="{ color: status === 'error' ? brand.primaryColor : brand.neutralColor, fontVariantNumeric: 'tabular-nums' }"
                  aria-live="polite"
                >
                  <IconAlertCircle v-if="status === 'error'" class="h-4 w-4" aria-hidden="true" />
                  <IconCheckCircle v-else-if="status === 'saved'" class="h-4 w-4" aria-hidden="true" />
                  <IconClock
                    v-else
                    class="h-4 w-4 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {{ statusText }}
                </p>

                <Button
                  id="delete-note-btn"
                  class="order-3 inline-flex items-center justify-center gap-2 px-4 py-2 text-[12px] uppercase tracking-[0.18em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
                  :style="{ backgroundColor: 'transparent', color: brand.primaryColor, border: '1px solid ' + brand.primaryColor, outlineColor: brand.primaryColor }"
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
          There is no save button — edits are written to this browser a moment after you stop typing.
        </p>

        <!-- Switcher -->
        <section class="mt-12">
          <div class="space-y-[3px]" aria-hidden="true">
            <div class="h-px w-full" :style="{ backgroundColor: brand.primaryColor, opacity: 0.35 }"></div>
            <div class="flex items-center gap-3">
              <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
              <span class="h-2 w-2 rotate-45" :style="{ backgroundColor: brand.accentColor }"></span>
              <span class="h-px flex-1" :style="{ backgroundColor: brand.accentColor }"></span>
            </div>
          </div>

          <h2
            class="mt-6 text-center text-[12px] uppercase tracking-[0.32em]"
            :style="{ fontFamily: brand.fontHeading, color: brand.neutralColor }"
          >
            Also in this notebook
          </h2>

          <ul v-if="otherNotes.length" class="mt-5">
            <li
              v-for="n in otherNotes"
              :key="n.id"
              :style="{ borderTop: '1px solid ' + brand.accentColor }"
            >
              <button
                type="button"
                class="group flex w-full items-center gap-4 px-2 py-4 text-left transition-colors duration-200 motion-reduce:transition-none hover:bg-white focus:outline focus:outline-2 focus:outline-offset-[-2px]"
                :style="{ outlineColor: brand.primaryColor }"
                @click="openNote(n.id)"
              >
                <span class="min-w-0 flex-1">
                  <span
                    class="block truncate text-[15px] uppercase tracking-[0.1em]"
                    :style="{ fontFamily: brand.fontHeading, opacity: n.title.trim() ? 1 : 0.5 }"
                  >
                    {{ n.title.trim() || 'Untitled' }}
                  </span>
                  <span class="mt-1 block truncate text-[13px]" :style="{ opacity: 0.65 }">
                    {{ n.body.split('\n')[0] || 'No text yet' }}
                  </span>
                </span>
                <span
                  class="hidden sm:block shrink-0 text-[12px] tracking-[0.08em]"
                  :style="{ opacity: 0.6, fontVariantNumeric: 'tabular-nums' }"
                >
                  {{ shortLabel(n.updated_at) }}
                </span>
                <IconChevronRight
                  class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  :style="{ color: brand.neutralColor }"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>

          <div v-else class="mt-5 p-[3px]" :style="{ border: '1px solid ' + brand.accentColor }">
            <div class="bg-white py-8" :style="{ border: '1px solid ' + brand.accentColor }">
              <Empty
                title="This is your only note"
                description="Nothing else is stored in this browser yet. Start another one from the list and it will appear here."
              >
                <template #action>
                  <Button
                    class="px-5 py-2.5 text-[12px] uppercase tracking-[0.2em] rounded-none transition-opacity duration-200 motion-reduce:transition-none hover:opacity-85 focus:outline focus:outline-2 focus:outline-offset-2"
                    :style="{ backgroundColor: brand.primaryColor, color: brand.accentColor, outlineColor: brand.primaryColor }"
                    @click="navigate('notes')"
                  >
                    Go to all notes
                  </Button>
                </template>
              </Empty>
            </div>
          </div>

          <div class="mt-8 text-center">
            <Button
              class="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.2em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
              :style="{ backgroundColor: 'transparent', color: brand.primaryColor, border: '1px solid ' + brand.accentColor, outlineColor: brand.primaryColor }"
              @click="navigate('notes')"
            >
              <IconArrowLeft class="h-4 w-4" aria-hidden="true" />
              Back to all notes
            </Button>
          </div>
        </section>
      </section>
    </div>

    <!-- Delete confirmation -->
    <div
      v-if="showDelete"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      :style="{ backgroundColor: 'rgba(18, 32, 28, 0.55)' }"
      @click.self="closeDelete"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        class="w-full max-w-md p-[3px] shadow-2xl"
        :style="{ border: '1px solid ' + brand.accentColor, backgroundColor: brand.primaryColor }"
      >
        <div
          class="bg-white px-6 py-8 text-center"
          :style="{ border: '1px solid ' + brand.accentColor, backgroundColor: brand.backgroundColor }"
        >
          <div class="flex items-center justify-center gap-3" aria-hidden="true">
            <span class="h-px w-10" :style="{ backgroundColor: brand.accentColor }"></span>
            <span class="h-2 w-2 rotate-45" :style="{ backgroundColor: brand.primaryColor }"></span>
            <span class="h-px w-10" :style="{ backgroundColor: brand.accentColor }"></span>
          </div>

          <h2
            id="delete-dialog-title"
            class="mt-5 text-lg uppercase tracking-[0.2em]"
            :style="{ fontFamily: brand.fontHeading }"
          >
            Delete this note?
          </h2>
          <p id="delete-dialog-desc" class="mx-auto mt-3 max-w-[40ch] text-[14px] leading-relaxed" :style="{ opacity: 0.78 }">
            “{{ displayTitle }}” will be erased from this browser for good. Notes live only on this device, so there is no backup to bring it back from.
          </p>

          <div class="mt-7 flex flex-col-reverse sm:flex-row gap-3 sm:justify-center">
            <Button
              id="keep-note-btn"
              class="px-5 py-3 text-[12px] uppercase tracking-[0.2em] rounded-none transition-colors duration-200 motion-reduce:transition-none hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-2"
              :style="{ backgroundColor: 'transparent', color: brand.primaryColor, border: '1px solid ' + brand.primaryColor, outlineColor: brand.primaryColor }"
              @click="closeDelete"
            >
              Keep note
            </Button>
            <Button
              class="inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.2em] rounded-none transition-opacity duration-200 motion-reduce:transition-none hover:opacity-85 focus:outline focus:outline-2 focus:outline-offset-2"
              :style="{ backgroundColor: brand.primaryColor, color: brand.accentColor, outlineColor: brand.primaryColor }"
              @click="confirmDelete"
            >
              <IconTrash class="h-4 w-4" aria-hidden="true" />
              Delete for good
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
