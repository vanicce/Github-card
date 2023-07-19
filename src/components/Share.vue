<script setup>
import { ref, reactive } from 'vue'

  const state = reactive({
    url: window.location
  })

  const copy = async () => {
    const copiedMessage = document.querySelector('#copied')
    copiedMessage.classList.remove('hidden')

    setTimeout(() => {
      copiedMessage.classList.add('hidden')
    }, 2000);

   await navigator.clipboard.writeText(state.url)
  }
</script>

<template>
  <div class="flex h-screen w-screen justify-center items-center fixed left-0 top-0" id="modal">
    <div class="bg-blue p-11 m-2 w-full sm:w-2/4 border rounded-md">
      <div class="flex flex-col md:flex-row md:justify-evenly justify-center items-center">
        <h1 @click="showModal = false">Share:</h1>
        <p class="border border-solid rounded-md border-white w-full sm:w-3/4 p-2 m-2 font-Prompt" id="copyUrl">{{ state.url }}</p>
        <button class="border p-2 px-5 rounded-md font-Prompt" @click="copy" >Copy</button>
      </div>
      <div class="flex items-center justify-center">
        <p class="hidden font-Prompt" id="copied">Copied to clipboard!</p>
      </div>
    </div>
  </div>
</template>
