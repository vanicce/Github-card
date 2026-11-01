<script setup>
import { computed } from "vue";
import { useCardStore } from "../stores/useCardStore";
import Card from "../components/Card.vue";
import RepoList from "../components/RepoList.vue";

const store = useCardStore();
const preview = computed(() => store.repoList.slice(0, 3));
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-col items-center px-5 py-14">
    <div v-if="store.status === 'loading'" class="w-full max-w-sm animate-pulse rounded-[28px] bg-white p-8 shadow-card" role="status">
      <div class="mx-auto h-28 w-28 rounded-full bg-canvas"></div>
      <div class="mx-auto mt-6 h-6 w-32 rounded-full bg-canvas"></div>
      <div class="mx-auto mt-3 h-4 w-44 rounded-full bg-canvas"></div>
      <span class="sr-only">Buscando perfil…</span>
    </div>

    <div v-else-if="store.status === 'error'" class="max-w-md py-10 text-center" role="alert">
      <h1 class="text-4xl font-semibold tracking-tight">Sem cartão para esse nome.</h1>
      <p class="mt-3 text-[17px] text-muted">{{ store.errorMessage }}</p>
      <router-link to="/" class="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] text-white">Tentar outro nome</router-link>
    </div>

    <template v-else-if="store.status === 'ready'">
      <Card />
      <section class="mt-14 w-full">
        <div class="mb-3 flex items-baseline justify-between gap-3 px-1">
          <h2 class="text-xl font-semibold tracking-tight">Repositórios</h2>
          <router-link v-if="store.repoList.length" to="/repos" class="text-[13px] text-[#0071e3]">Ver todos</router-link>
        </div>
        <p v-if="store.repoError" class="text-sm text-muted" role="alert">{{ store.repoError }}</p>
        <p v-else-if="preview.length === 0" class="text-sm text-muted">Nenhum repositório público.</p>
        <RepoList v-else :repos="preview" />
      </section>
    </template>

    <p v-else class="text-muted">Busque um nome de usuário.</p>
  </div>
</template>
