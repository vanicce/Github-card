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
  <div class="flex w-screen justify-center">
    <button class="border border-solid rounded-md bg-ctp-base text-ctp- font-Prompt border-ctp-text p-3 w-72 md:w-3/5 max-w-xs" @click="showModal = true">Share</button>
  </div>
</template>
