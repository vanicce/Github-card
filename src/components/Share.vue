<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useShareStore } from "../stores/useShareStore.js";

const store = useShareStore();
const { showModal, copied } = storeToRefs(store);
const url = window.location.href;
const linkField = ref(null);
let copiedTimer;

function close() {
  showModal.value = false;
}

function onKeydown(event) {
  if (event.key === "Escape") close();
}

async function copy() {
  try {
    await navigator.clipboard.writeText(url);
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    linkField.value?.focus();
    linkField.value?.select();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  linkField.value?.focus();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  clearTimeout(copiedTimer);
});
</script>

<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm" @click.self="close">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      class="w-full max-w-sm rounded-[20px] bg-white p-6 text-ink shadow-card"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="share-title" class="text-xl font-semibold tracking-tight">Compartilhar</h2>
          <p class="mt-1 text-sm text-muted">Quem abrir o link vê este cartão.</p>
        </div>
        <button type="button" class="grid h-8 w-8 place-items-center rounded-full text-xl leading-none text-muted hover:bg-canvas" aria-label="Fechar" @click="close">×</button>
      </div>
      <input
        ref="linkField"
        readonly
        :value="url"
        class="mt-5 w-full rounded-xl bg-canvas px-4 py-3 text-sm"
        aria-label="Link do cartão"
        @focus="linkField?.select()"
      />
      <button type="button" class="mt-3 h-11 w-full rounded-full bg-ink text-[15px] text-white transition hover:bg-black" @click="copy">
        {{ copied ? "Copiado" : "Copiar link" }}
      </button>
    </div>
  </div>
</template>
