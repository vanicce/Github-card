<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCardStore } from "../stores/useCardStore";
import { usernameError } from "../username.js";

defineProps({
  inputId: { type: String, required: true },
  size: { type: String, default: "compact" },
});

const store = useCardStore();
const route = useRoute();
const router = useRouter();
const draft = ref("");
const message = ref("");

async function submit() {
  const name = draft.value.trim();
  const invalid = usernameError(name);
  if (invalid) {
    message.value = invalid;
    return;
  }

  message.value = "";
  draft.value = "";

  if (route.name === "card" && route.params.user === name) {
    await store.loadUser(name, { force: true });
    return;
  }

  await router.push({ name: "card", params: { user: name } });
}
</script>

<template>
  <form class="w-full" @submit.prevent="submit">
    <div :class="size === 'hero' ? 'flex flex-col gap-3 sm:flex-row sm:items-center' : 'flex items-center gap-2'">
      <label class="sr-only" :for="inputId">Nome de usuário do GitHub</label>
      <input
        :id="inputId"
        v-model="draft"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        spellcheck="false"
        placeholder="nome de usuário"
        :aria-invalid="message ? 'true' : 'false'"
        :aria-describedby="message ? `${inputId}-error` : undefined"
        :class="size === 'hero'
          ? 'h-12 w-full rounded-full border border-black/10 bg-white px-5 text-[17px] text-ink outline-none placeholder:text-muted'
          : 'h-9 w-full rounded-full bg-canvas px-4 text-sm text-ink outline-none placeholder:text-muted'"
      />
      <button
        type="submit"
        :class="size === 'hero'
          ? 'h-12 shrink-0 rounded-full bg-ink px-6 text-[17px] text-white transition hover:bg-black'
          : 'h-9 shrink-0 rounded-full bg-ink px-4 text-sm text-white transition hover:bg-black'"
      >
        Buscar
      </button>
    </div>
    <p v-if="message" :id="`${inputId}-error`" class="mt-3 text-center text-sm text-muted" role="alert">{{ message }}</p>
  </form>
</template>
