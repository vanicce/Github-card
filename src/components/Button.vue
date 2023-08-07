<script setup>
import { ref } from 'vue';
import Share from "./Share.vue";
import { storeToRefs } from 'pinia'
import { useShareStore } from "../stores/useShareStore.js"

const store = useShareStore()
const { showModal } = storeToRefs(store)

</script>

<template>
  <Share v-if="showModal"/>
  <div class="flex w-full px-4 mb-2 justify-center">
    <button class="border border-solid rounded-md bg-ctp-base font-Prompt border-ctp-text p-3 w-72 md:w-full max-w-xs" @click="showModal = true">Share</button>
  </div>
</template>
