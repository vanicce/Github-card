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

  const copy = () => {
    const copiedMessage = document.querySelector('#copied')
    copiedMessage.classList.remove('hidden')

    setTimeout(() => {
      copiedMessage.classList.add('hidden')
    }, 2000);

    const url = window.location
    navigator.clipboard.writeText(url)
  }
</script>

<template>
  <div class="flex w-screen justify-center">
    <button class="border border-solid rounded-md bg-sea text-navy font-Prompt border-blue p-3 w-72 md:w-3/5 max-w-xs" @click="showModal">Share</button>
  </div>
  <div class="flex h-screen w-screen justify-center invisible items-center fixed left-0 top-0" id="modal">
    <div class="bg-blue p-11 m-2 w-full sm:w-2/4 border rounded-md">
      <div class="flex flex-col md:flex-row md:justify-evenly justify-center items-center">
        <h1>Share:</h1>
        <p class="border border-solid rounded-md border-white w-full sm:w-3/4 p-2 m-2 font-Prompt" id="copyUrl">{{ url }}</p>
        <button class="border p-2 px-5 rounded-md font-Prompt" @click="copy" >Copy</button>
      </div>
      <div class="flex items-center justify-center">
        <p class="hidden font-Prompt" id="copied">Copied to clipboard!</p>
      </div>
    </div>
  </div>
</template>
