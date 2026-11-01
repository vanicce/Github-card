<script setup>
import { computed } from "vue";
import { useCardStore } from "../stores/useCardStore";
import Card from "../components/Card.vue";
import RepoList from "../components/RepoList.vue";

const store = useCardStore();
const preview = computed(() => store.repoList.slice(0, 3));
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-10 md:py-14">
    <div v-if="store.status === 'loading'" class="w-full max-w-sm animate-pulse rounded-[28px] bg-paper p-6" role="status">
      <div class="mx-auto h-36 w-36 rounded-full bg-ink/10"></div>
      <div class="mx-auto mt-6 h-7 w-36 rounded-full bg-ink/10"></div>
      <div class="mx-auto mt-3 h-4 w-52 rounded-full bg-ink/10"></div>
      <span class="sr-only">Buscando perfil…</span>
    </div>

    <div v-else-if="store.status === 'error'" class="max-w-md text-center" role="alert">
      <h1 class="font-display text-4xl leading-tight md:text-5xl">Sem cartão para esse nome.</h1>
      <p class="mt-3 text-muted">{{ store.errorMessage }}</p>
      <router-link to="/" class="mt-8 inline-flex h-12 items-center rounded-full bg-ember px-6 font-medium text-ink">Tentar outro nome</router-link>
    </div>

    <template v-else-if="store.status === 'ready'">
      <Card />
      <section class="mt-12 w-full">
        <div class="mb-4 flex items-end justify-between gap-3">
          <h2 class="font-display text-3xl">Trabalho recente</h2>
          <router-link v-if="store.repoList.length" to="/repos" class="text-sm text-ember">Ver todos</router-link>
        </div>
        <p v-if="store.repoError" class="text-sm text-muted" role="alert">{{ store.repoError }}</p>
        <p v-else-if="preview.length === 0" class="text-sm text-muted">Nenhum repositório público.</p>
        <RepoList v-else :repos="preview" />
      </section>
    </template>

    <p v-else class="text-muted">Busque um nome de usuário.</p>
  </div>
</template>
