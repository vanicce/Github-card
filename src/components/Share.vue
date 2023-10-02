<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useShareStore } from "../stores/useShareStore.js";

const store = useShareStore()
const { showModal } = storeToRefs(store)

const state = reactive({
  url: window.location
})

const copy = async () => {
  store.copied = true

  setTimeout(() => {
    store.copied = false
  }, 1500);

  await navigator.clipboard.writeText(state.url)
}

</script>

<template>
  <div class="flex h-screen w-screen justify-center items-center fixed left-0 top-0 text-ctp-lavender">
    <div class="flex justify-between flex-col bg-ctp-base p-11 m-2 w-full sm:w-2/4 border rounded-md">
      <div class="flex justify-end">
        <button @click="showModal = false">
          <img class="fill-white" src="../assets/x-symbol.svg" width="25" height="25">
        </button>
      </div>
      <div class="flex flex-col md:flex-row md:justify-evenly justify-center items-center">
        <h1 class="text-xl ">share:</h1>
        <p class="flex items-center justify-between border border-solid rounded-md border-white w-full sm:w-3/4 p-2 m-2 font-Prompt">{{
          state.url }}
          <button class="border border-white px-4 py-2 rounded-md bg-ctp-blue text-black" @click="copy()">
            copy
            <!-- <img src="../assets/copy-svgrepo-com (1).svg" width="25" height="25"> -->
          </button>
        </p>
      </div>
      <div v-if="store.copied" class="flex items-center justify-center">
        <p class="font-Prompt">Copied to clipboard!</p>
      </div>
    </div>
  </div>
</template>
