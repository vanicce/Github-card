<script setup>
import SearchField from "../components/SearchField.vue";
</script>

<template>
  <section class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
    <p class="text-xs uppercase tracking-[0.22em] text-ember">Um cartão para guardar</p>
    <h1 class="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">Seu GitHub, em forma de cartão.</h1>
    <p class="mt-5 max-w-xl text-base text-muted md:text-lg">Busque um usuário. Compartilhe o cartão ou salve a imagem.</p>
    <div class="mt-8 w-full max-w-xl text-left">
      <SearchField input-id="home-username" size="hero" />
    </div>
  </section>
</template>
