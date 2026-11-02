<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRetroStore } from "../stores/useRetroStore";
import SearchField from "./SearchField.vue";

const store = useRetroStore();
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
  <header class="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 px-5 py-3">
      <router-link to="/" class="order-1 text-[15px] font-semibold tracking-tight">Card</router-link>
      <div v-if="route.name !== 'Home'" class="order-2 w-full md:ml-auto md:max-w-sm">
        <SearchField input-id="search" />
      </div>
    </div>
  </header>
</template>
