<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usernameError } from "../username.js";

const router = useRouter();
const username = ref("");
const message = ref("");

async function start() {
  const invalid = usernameError(username.value);
  if (invalid) {
    message.value = invalid;
    return;
  }

  message.value = "";
  await router.push({ name: "card", params: { user: username.value.trim() } });
}
</script>

<template>
  <form class="flex flex-col items-center w-full max-w-md px-4" @submit.prevent="start">
    <h1 class="text-3xl md:text-5xl 2xl:text-6xl p-3 font-Prompt text-center">Find Your GitHub Card</h1>
    <label class="sr-only" for="home-username">GitHub username</label>
    <input
      id="home-username"
      v-model="username"
      class="p-2 border border-solid border-zinc-300 focus:border-neutral-600 rounded-md outline-none bg-transparent w-full font-Prompt"
      placeholder="search a username..."
      type="search"
      autocomplete="off"
    />
    <p v-if="message" class="mt-2 font-Prompt text-red-700 text-center" role="alert">{{ message }}</p>
    <button type="submit" class="mt-4 px-5 py-3 rounded-lg font-Prompt font-bold border border-zinc-300 hover:scale-110 transition-transform">Start</button>
  </form>
</template>
