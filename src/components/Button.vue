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
  <div class="flex w-full justify-center text-ctp-lavender">
    <button class="border border-solid rounded-md bg-ctp-base font-Prompt border-ctp-text p-3 w-4/5 max-w-sm"
      @click="showModal = true">Share</button>
    <Transition>
      <Async-comp v-if="showModal" />
    </Transition>
  </div>
</template>
