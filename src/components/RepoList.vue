<script setup>
import { formatStars } from "../format.js";

defineProps({
  repos: { type: Array, required: true },
});
</script>

<template>
  <ul class="overflow-hidden rounded-2xl bg-white shadow-card">
    <li v-for="repo in repos" :key="repo.id" class="border-b border-black/5 last:border-b-0">
      <a
        class="flex items-center justify-between gap-4 px-4 py-3.5 transition hover:bg-black/[0.02]"
        :href="repo.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="min-w-0">
          <span class="block truncate text-[15px] font-medium">{{ repo.name }}</span>
          <span v-if="repo.description" class="mt-0.5 block truncate text-[13px] text-muted">{{ repo.description }}</span>
          <span v-if="repo.language" class="mt-0.5 block text-[13px] text-muted">{{ repo.language }}</span>
        </span>
        <span class="shrink-0 text-[13px] text-muted">{{ formatStars(repo.stars) }}</span>
      </a>
    </li>
  </ul>
</template>
