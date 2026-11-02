<script setup>
import { computed } from "vue";
import SearchField from "../components/SearchField.vue";

const year = computed(() => new Date().getFullYear());
const previousYear = computed(() => year.value - 1);
</script>

<template>
  <section class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
    <p class="text-[13px] uppercase tracking-[0.18em] text-white/50">Card</p>
    <h1 class="mt-4 text-6xl font-semibold leading-none tracking-tight md:text-8xl">
      <span class="block">{{ year }}</span>
      <span class="block text-[#d6ff4a]">contra</span>
      <span class="block">{{ previousYear }}.</span>
    </h1>
    <p class="mt-6 max-w-md text-[17px] leading-relaxed text-white/70">Busque um nome. O card mostra os números e a diferença para o ano passado.</p>
    <div class="mt-8 w-full max-w-md">
      <SearchField input-id="home-username" size="hero" />
    </div>
  </section>
</template>
