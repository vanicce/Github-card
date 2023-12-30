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
    class="border border-zinc-300 rounded-xl font-Prompt w-2/4"
    @click="showModal = true">Share</button>
  <Transition>
    <Async-comp v-if="showModal" />
  </Transition>
</template>
