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
    class="h-11 w-full rounded-full bg-ink text-[15px] text-white transition hover:bg-black"
    @click="showModal = true"
  >Compartilhar</button>
  <Share v-if="showModal" />
</template>
