<script setup>
import { computed } from "vue";
import { useCardStore } from "../stores/useCardStore";
import RepoList from "../components/RepoList.vue";

const store = useCardStore();
const recentLabel = computed(() => {
  if (store.repoList.length > 6) return "Mais recentes";
  if (store.repoList.length === 6) return "6 mais recentes";
  return "";
});
</script>

<template>
  <section class="mx-auto w-full max-w-lg px-5 py-14">
    <p v-if="store.status === 'loading' && !store.login" class="text-center text-muted" role="status">Buscando repositórios…</p>

    <div v-else-if="!store.login" class="py-16 text-center">
      <h1 class="text-4xl font-semibold tracking-tight">Repositórios</h1>
      <p class="mt-3 text-[17px] text-muted">Busque um usuário para ver os repositórios.</p>
      <router-link to="/" class="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] text-white">Buscar um nome</router-link>
    </div>

    <template v-else>
      <div class="mb-8 flex items-center gap-3">
        <img class="h-12 w-12 rounded-full object-cover" :src="store.pic" alt="" crossorigin="anonymous" />
        <div>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight">@{{ store.login }}</h1>
          <p v-if="recentLabel" class="mt-1 text-[13px] text-muted">{{ recentLabel }}</p>
          <router-link class="text-[13px] text-[#0071e3]" :to="{ name: 'card', params: { user: store.login } }">Ver cartão</router-link>
        </div>
      </div>
      <p v-if="store.repoError" class="text-muted" role="alert">{{ store.repoError }}</p>
      <p v-else-if="store.repoList.length === 0" class="text-muted">Nenhum repositório público.</p>
      <template v-else>
        <RepoList :repos="store.repoList" />
        <button
          v-if="store.repoHasMore"
          type="button"
          class="mt-4 w-full text-[13px] text-[#0071e3] disabled:opacity-40"
          :disabled="store.repoLoading"
          @click="store.loadMoreRepos()"
        >{{ store.repoLoading ? "Buscando…" : "Carregar mais" }}</button>
      </template>
    </template>
  </section>
</template>
