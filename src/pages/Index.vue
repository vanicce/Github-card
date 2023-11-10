<script setup>
  import { useCardStore } from '../stores/useCardStore';

  const store = useCardStore()
</script>

<template>
  <h1 class="text-3xl md:text-5xl 2xl:text-6xl p-3 text-ctp-lavender font-Prompt">Find Your GitHub Card</h1>
  <router-link :to="{ params: { user: store.login}, name: 'card'}" class="bg-ctp-mauve px-4 py-3 rounded-md font-Prompt font-bold">Start</router-link>
</template>
