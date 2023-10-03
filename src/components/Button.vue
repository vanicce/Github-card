<script setup>
import Share from "./Share.vue";
import { storeToRefs } from 'pinia'
import { useShareStore } from "../stores/useShareStore.js"

const store = useShareStore()
const { showModal } = storeToRefs(store)

</script>

<template>
  <Share v-if="showModal" />
  <div class="flex w-full justify-center text-ctp-lavender">
    <button class="border border-solid rounded-md bg-ctp-base font-Prompt border-ctp-text p-3 w-4/5 md:max-w-sm"
      @click="showModal = true">Share</button>
  </div>
</template>
