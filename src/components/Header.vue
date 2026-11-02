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

function navClass(name) {
  return route.name === name ? "text-ink" : "text-muted hover:text-ink";
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-black/10 bg-white/80 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 px-5 py-3">
      <router-link to="/" class="order-1 text-[15px] font-semibold tracking-tight">GitHub Card</router-link>
      <nav class="order-2 ml-auto flex items-center gap-5 text-[13px] md:order-3">
        <router-link to="/repos" :class="navClass('repos')">Repositórios</router-link>
        <router-link
          v-if="store.login"
          id="card"
          :to="{ name: 'card', params: { user: store.login } }"
          :class="navClass('card')"
        >Cartão</router-link>
      </nav>
      <div v-if="route.name !== 'Home'" class="order-3 w-full md:order-2 md:max-w-sm md:flex-1">
        <SearchField input-id="search" />
      </div>
    </div>
  </header>
</template>
