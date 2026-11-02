<script setup>
import SearchField from "../components/SearchField.vue";
</script>

<template>
  <section class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
    <h1 class="text-[40px] font-semibold leading-[1.05] tracking-tight md:text-6xl">A retrospectiva de um GitHub.</h1>
    <p class="mt-4 max-w-md text-[17px] leading-relaxed text-muted">Busque uma pessoa. O relato usa o perfil, os repositórios e a atividade pública recente.</p>
    <div class="mt-8 w-full max-w-md">
      <SearchField input-id="home-username" size="hero" />
    </div>
  </section>
</template>
