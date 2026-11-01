<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCardStore } from "../stores/useCardStore";
import { usernameError } from "../username.js";

const props = defineProps({
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
    <div :class="size === 'hero' ? 'flex flex-col gap-3 sm:flex-row' : 'flex gap-2'">
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
          ? 'h-14 w-full rounded-full bg-paper px-5 text-lg text-ink outline-none placeholder:text-ink/40'
          : 'h-11 w-full rounded-full border border-line bg-transparent px-4 text-paper outline-none placeholder:text-muted'"
      />
      <button
        type="submit"
        :class="size === 'hero'
          ? 'h-14 shrink-0 rounded-full bg-ember px-7 font-medium text-ink transition hover:brightness-110'
          : 'h-11 shrink-0 rounded-full bg-ember px-4 text-sm font-medium text-ink transition hover:brightness-110'"
      >
        Buscar
      </button>
    </div>
    <p v-if="message" :id="`${inputId}-error`" class="mt-2 text-sm text-ember" role="alert">{{ message }}</p>
  </form>
</template>
