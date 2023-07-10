<script setup>
  import { ref } from 'vue';

  const url = window.location

  const showModal = () => {
    const myModal = document.querySelector('#modal')

    myModal.classList.remove('invisible')

    myModal.classList.add('visible')

    window.onclick = (e) => {
      if(e.target == myModal){
        myModal.classList.add('invisible')
        myModal.classList.remove('visible')
      }
    }
  }

  const copy = () => {
    const url = window.location
    navigator.clipboard.writeText(url)
  }
</script>

<template>
  <div class="flex w-screen justify-center">
    <button class="border border-solid rounded-md bg-sea text-navy font-Prompt border-blue p-3 w-72 md:w-3/5 max-w-xs" @click="showModal">Share</button>
  </div>
  <div class="flex h-screen w-screen justify-center invisible items-center fixed left-0 top-0" id="modal">
    <div class="bg-blue flex flex-col justify-center items-center p-11 w-3/4 md:w-2/4 md:flex-row md:justify-evenly border rounded-md">
      <h1>Share:</h1>
      <p class="border border-solid border-red-950 md:w-2/4 p-2" id="copyUrl">{{ url }}</p>
      <button class="border p-2 px-5 rounded-md" @click="copy" >Copy</button>
    </div>
  </div>
</template>
