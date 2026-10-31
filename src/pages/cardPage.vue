<script setup>
import { useCardStore } from "../stores/useCardStore";
import Card from "../components/Card.vue";

const store = useCardStore();
</script>

<template>
  <p v-if="store.status === 'loading'" class="text-lg font-Prompt p-3" role="status">Loading profile…</p>
  <p v-else-if="store.status === 'error'" class="text-lg font-Prompt p-3 text-center" role="alert">{{ store.errorMessage }}</p>
  <Card v-else-if="store.status === 'ready'" />
  <p v-else class="text-lg font-Prompt p-3 text-center">Search for a GitHub username.</p>
</template>
