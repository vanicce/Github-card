<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCardStore } from "../stores/useCardStore";
import { useShareStore } from "../stores/useShareStore";
import { usernameError } from "../username.js";

const store = useCardStore();
const shareStore = useShareStore();
const route = useRoute();
const router = useRouter();
const searchError = ref("");

function onKeydown(event) {
  if (event.ctrlKey && event.key === "i") {
    document.querySelector("#search")?.focus();
    event.preventDefault();
  }
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));

async function defineUser() {
  const name = store.searchInput.trim();
  const invalid = usernameError(name);
  if (invalid) {
    searchError.value = invalid;
    return;
  }

  searchError.value = "";
  store.searchInput = "";
  document.querySelector("#search")?.blur();

  if (route.name === "card" && route.params.user === name) {
    await store.loadUser(name, { force: true });
    return;
  }

  await router.push({ name: "card", params: { user: name } });
}

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
  <div class="w-full border bg-zinc-50">
    <div class="flex items-center h-16">
      <router-link to="/" class="hover:underline hidden md:block px-5">GitHub</router-link>
      <form class="flex w-full mx-3" @submit.prevent="defineUser">
        <label class="sr-only" for="search">GitHub username</label>
        <input
          id="search"
          class="p-1 border border-solid border-zinc-300 focus:border-neutral-600 rounded-l-md outline-none appearance-none bg-transparent w-full"
          placeholder="search a username..."
          type="search"
          autocomplete="off"
          v-model="store.searchInput"
          :aria-invalid="searchError ? 'true' : 'false'"
          :aria-describedby="searchError ? 'search-error' : undefined"
        />
        <button id="searchBtn" class="border border-l-0 p-1 rounded-r-md border-zinc-300" type="submit">search</button>
      </form>
      <router-link to="/repos" class="hidden md:block underline px-4">repos</router-link>
      <router-link
        v-if="store.login"
        id="card"
        :to="{ name: 'card', params: { user: store.login } }"
        class="underline hidden md:block px-5"
      >card</router-link>
    </div>
    <p v-if="searchError" id="search-error" class="px-5 pb-2 font-Prompt text-sm text-red-700" role="alert">{{ searchError }}</p>
  </div>
</template>
