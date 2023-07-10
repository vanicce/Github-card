<script setup>
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
</script>

<template>
  <div class="flex w-screen justify-center">
    <button class="border border-solid rounded-md bg-sea text-navy font-Prompt border-red-900 p-3 w-3/4 md:w-1/4" @click="showModal">Share</button>
  </div>
  <div class="flex h-screen w-screen justify-center invisible items-center fixed left-0 top-0" id="modal">
    <div class="bg-yellow-50 flex flex-col justify-center items-center p-11 w-3/4 md:w-2/4 md:flex-row md:justify-evenly">
      <h1>Compartilhe:</h1>
      <p class="border border-solid border-red-950 md:w-2/4">{{ url }}</p>
      <p>Link</p>
    </div>
  </div>
</template>
