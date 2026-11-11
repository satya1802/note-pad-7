<script lang="ts">
import type { RouteRecordRaw } from "vue-router";

import Notes from "@/screens/Notes.vue";
import NoteDetail from "@/screens/NoteDetail.vue";

// Screens marked bare (shown before sign-in, or hidden from the menu) render on their own.
export const routes: RouteRecordRaw[] = [
  { path: "/notes", component: Notes },
  { path: "/notes/:id", component: NoteDetail },
  { path: "/note-detail", redirect: "/notes" },
  { path: "/:pathMatch(.*)*", redirect: "/notes" },
];
</script>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
const bare = computed(() => route.meta.bare === true);

function linkClass(path: string): string {
  const active = path === "/" ? route.path === "/" : route.path.startsWith(path);
  return [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    active ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");
}
</script>

<template>
  <RouterView v-if="bare" />
  <div v-else class="flex min-h-screen">
    <aside
      class="w-56 shrink-0 border-r p-4"
      style="background-color: var(--brand-surface); border-color: var(--brand-border)"
    >
      <p class="mb-4 px-3 text-sm font-semibold" style="font-family: var(--brand-font-heading)">
        {{ "note pad 7" }}
      </p>
      <nav aria-label="App menu" class="flex flex-col gap-1">
        <RouterLink to="/notes" :class="linkClass('/notes')">
          {{ "Notes" }}
        </RouterLink>
      </nav>
    </aside>
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
