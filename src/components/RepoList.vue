<script setup>
defineProps({
  repos: { type: Array, required: true },
});
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="repo in repos" :key="repo.id">
      <a
        class="block rounded-2xl border border-line bg-white/5 px-4 py-3 transition hover:border-ember/80"
        :href="repo.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="flex items-baseline justify-between gap-3">
          <span class="font-medium">{{ repo.name }}</span>
          <span class="shrink-0 text-sm text-muted">★ {{ repo.stars }}</span>
        </span>
        <span v-if="repo.description" class="mt-1 block text-sm leading-relaxed text-muted">{{ repo.description }}</span>
        <span v-if="repo.language" class="mt-2 block text-xs uppercase tracking-[0.16em] text-ember">{{ repo.language }}</span>
      </a>
    </li>
  </ul>
</template>
