<script setup>
  import { useCardStore } from '../stores/useCardStore';

  const store = useCardStore()
</script>

<template>
  <h1 class="text-3xl md:text-5xl 2xl:text-6xl p-3 font-Prompt text-center">Find Your GitHub Card</h1>
  <router-link :to="{ params: { user: store.login}, name: 'card'}" class="px-5 py-3 rounded-lg font-Prompt font-bold border border-zinc-300 hover:scale-110 transition-transform">Start</router-link>
</template>
