<script setup>
import { storeToRefs } from "pinia";
import { useShareStore } from "../stores/useShareStore.js";
import Share from "./Share.vue";

const store = useShareStore();
const { showModal } = storeToRefs(store);
</script>

<template>
  <button
    type="button"
    class="h-12 w-full rounded-full bg-ember font-medium text-ink transition hover:brightness-110"
    @click="showModal = true"
  >Compartilhar</button>
  <Share v-if="showModal" />
</template>
