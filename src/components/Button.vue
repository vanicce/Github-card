<script setup>
import { storeToRefs } from 'pinia'
import { useShareStore } from "../stores/useShareStore.js"
import { defineAsyncComponent } from "vue";

const AsyncComp = defineAsyncComponent(() =>
  import("./Share.vue")
)

const store = useShareStore()
const { showModal } = storeToRefs(store)

</script>

<template>
  <button
    class="border border-solid rounded-md bg-ctp-base font-Prompt border-ctp-text text-ctp-lavender w-[49%]"
    @click="showModal = true">Share</button>
  <Transition>
    <Async-comp v-if="showModal" />
  </Transition>
</template>
