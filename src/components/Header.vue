<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCardStore } from "../stores/useCardStore";
import { useShareStore } from "../stores/useShareStore";
import SearchField from "./SearchField.vue";

const store = useCardStore();
const shareStore = useShareStore();
const route = useRoute();

function onKeydown(event) {
  if (event.ctrlKey && event.key.toLowerCase() === "i") {
    document.querySelector("#search, #home-username")?.focus();
    event.preventDefault();
  }
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));

watch(
  () => route.fullPath,
  () => {
    shareStore.showModal = false;
  }
);

watch(
  () => route.params.user,
  (user) => {
    if (route.name === "card" && typeof user === "string") {
      store.loadUser(user);
    }
  },
  { immediate: true }
);
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-line/80 bg-ink/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
      <router-link to="/" class="order-1 flex items-center gap-2">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-paper font-display text-lg leading-none text-ink" aria-hidden="true">G</span>
        <span class="font-display text-xl">GitHub Card</span>
      </router-link>
      <nav class="order-2 ml-auto flex items-center gap-4 text-sm md:order-3">
        <router-link
          to="/repos"
          class="hover:text-paper"
          :class="route.name === 'repos' ? 'text-ember' : 'text-paper/75'"
        >Repositórios</router-link>
        <router-link
          v-if="store.login"
          id="card"
          :to="{ name: 'card', params: { user: store.login } }"
          class="hover:text-paper"
          :class="route.name === 'card' ? 'text-ember' : 'text-paper/75'"
        >Cartão</router-link>
      </nav>
      <div v-if="route.name !== 'Home'" class="order-3 w-full md:order-2 md:w-auto md:min-w-[18rem] md:flex-1">
        <SearchField input-id="search" />
      </div>
    </div>
  </header>
</template>
