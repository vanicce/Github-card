<script setup>
import { useCardStore } from "../stores/useCardStore";
import RepoList from "../components/RepoList.vue";

const store = useCardStore();
</script>

<template>
  <section class="mx-auto w-full max-w-xl px-4 py-10 md:py-14">
    <p v-if="store.status === 'loading'" class="text-center text-muted" role="status">Buscando repositórios…</p>

    <div v-else-if="!store.login" class="py-16 text-center">
      <h1 class="font-display text-4xl md:text-5xl">Repositórios</h1>
      <p class="mt-3 text-muted">Busque um usuário para ver os repositórios.</p>
      <router-link to="/" class="mt-8 inline-flex h-12 items-center rounded-full bg-ember px-6 font-medium text-ink">Buscar um nome</router-link>
    </div>

    <template v-else>
      <div class="mb-8 flex items-center gap-3">
        <img class="h-14 w-14 rounded-full object-cover" :src="store.pic" alt="" crossorigin="anonymous" />
        <div>
          <h1 class="font-display text-4xl leading-none">@{{ store.login }}</h1>
          <router-link class="text-sm text-ember" :to="{ name: 'card', params: { user: store.login } }">Ver cartão</router-link>
        </div>
      </div>
      <p v-if="store.repoError" class="text-muted" role="alert">{{ store.repoError }}</p>
      <p v-else-if="store.repoList.length === 0" class="text-muted">Nenhum repositório público.</p>
      <RepoList v-else :repos="store.repoList" />
    </template>
  </section>
</template>
