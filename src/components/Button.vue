<script setup>
import { ref } from 'vue';
import Share from "./Share.vue";

const showModal = ref(false)
</script>

<template>
  <Share v-show="showModal"/>
  <div class="flex w-screen justify-center">
    <button class="border border-solid rounded-md bg-sea text-navy font-Prompt border-blue p-3 w-72 md:w-3/5 max-w-xs" @click="showModal = !showModal">Share</button>
  </div>
</template>
