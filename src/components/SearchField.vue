<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRetroStore } from "../stores/useRetroStore";
import { usernameError } from "../username.js";

defineProps({
  inputId: { type: String, required: true },
  size: { type: String, default: "compact" },
});

const store = useRetroStore();
const route = useRoute();
const router = useRouter();
const draft = ref("");
const message = ref("");
const loading = computed(() => store.status === "loading");

const feedback = computed(() => {
  if (message.value) return message.value;
  if (route.name === "retro") return "";
  if (store.notice) return store.notice;
  if (route.name === "Home" && store.status === "error") return store.errorMessage;
  return "";
});

watch(
  () => store.status,
  (status) => {
    if (status === "error" && route.name === "retro" && typeof route.params.user === "string") {
      draft.value = route.params.user;
    }
  }
);

async function submit() {
  if (loading.value) return;

  const name = draft.value.trim();
  const invalid = usernameError(name);
  if (invalid) {
    message.value = invalid;
    return;
  }

  message.value = "";
  const ok = await store.loadUser(name, { force: true });
  if (!ok) return;

  draft.value = "";
  if (route.name !== "retro" || route.params.user !== store.login) {
    await router.push({ name: "retro", params: { user: store.login } });
  }
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
        :aria-invalid="feedback ? 'true' : 'false'"
        :aria-describedby="feedback ? `${inputId}-error` : undefined"
        :class="size === 'hero'
          ? 'h-12 w-full rounded-full border border-white/15 bg-white/10 px-5 text-[17px] text-white outline-none placeholder:text-white/40'
          : 'h-9 w-full rounded-full bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40'"
      />
      <button
        type="submit"
        :disabled="loading"
        :class="size === 'hero'
          ? 'h-12 shrink-0 rounded-full bg-white px-6 text-[17px] text-black transition hover:bg-[#d6ff4a] disabled:opacity-40'
          : 'h-9 shrink-0 rounded-full bg-white px-4 text-sm text-black transition hover:bg-[#d6ff4a] disabled:opacity-40'"
      >
        {{ loading ? "Buscando…" : "Buscar" }}
      </button>
    </div>
    <p v-if="feedback" :id="`${inputId}-error`" class="mt-3 text-center text-sm text-white/70" role="alert">{{ feedback }}</p>
  </form>
</template>
