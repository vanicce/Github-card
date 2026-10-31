<script setup>
import { useCardStore } from "../stores/useCardStore";

const store = useCardStore();
</script>

<template>
  <section class="w-full max-w-xl px-4">
    <h1 class="text-3xl md:text-5xl p-3 font-Prompt text-center">Repositories</h1>
    <p v-if="store.status === 'loading'" class="font-Prompt text-center" role="status">Loading repositories…</p>
    <p v-else-if="!store.login" class="font-Prompt text-center">Search for a username to see repositories.</p>
    <p v-else-if="store.repoError" class="font-Prompt text-center" role="alert">{{ store.repoError }}</p>
    <p v-else-if="store.repoList.length === 0" class="font-Prompt text-center">No public repositories.</p>
    <ul v-else class="flex flex-col gap-3">
      <li v-for="repo in store.repoList" :key="repo.id" class="border border-zinc-300 rounded-xl p-3">
        <a class="font-Prompt text-lg underline" :href="repo.url" target="_blank" rel="noopener noreferrer">{{ repo.name }}</a>
        <p v-if="repo.description" class="font-Prompt mt-1">{{ repo.description }}</p>
        <p class="font-Prompt mt-2 text-sm">
          <span v-if="repo.language">{{ repo.language }} · </span>
          <span>{{ repo.stars }} stars</span>
        </p>
      </li>
    </ul>
  </section>
</template>
