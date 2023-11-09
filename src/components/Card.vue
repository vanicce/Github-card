<script setup>
import Button from "./Button.vue";
import { useCardStore } from "../stores/useCardStore.js";
import html2canvas from "html2canvas"

const store = useCardStore()

const capture = async () => {
  const element = document.querySelector('#conteudo');

  await html2canvas(element, {
    useCORS: true
  }).then((canvas) => {
    let capturedImage = canvas.toDataURL();
    let link = document.createElement('a')
    link.href = capturedImage
    link.download = "your_github_card"

    link.click()
  });
}

</script>

<template>
  <div id="conteudo"
    class="flex flex-col justify-center items-center p-3 rounded-md border-ctp-text border bg-ctp-base w-4/5 max-w-sm m-2 text-ctp-lavender">
    <img id='img' class="rounded-full w-56 h-56 md:w-64 md:h-64 m-4" :src="store.pic" alt="foto de perfil do github" />
    <a class="hover:underline text-2xl md:text-3xl font-Prompt" :href="store.url" target="_blank">@{{ store.login }}</a>
    <div class="flex">
      <p class="text-base md:text-base mt-2 font-Prompt">followers: {{ store.followers }}</p>
      <p class="text-base mt-2 mx-2">&#x2022</p>
      <p class="text-base md:text-base mt-2 font-Prompt">following: {{ store.following }}</p>
    </div>
    <p class="text-base font-Prompt">repos: {{ store.repos }}</p>
    <a class="font-Prompt underline" :href="store.blog" target="_blank">{{ store.blog }}</a>
    <p class="text-sm md:text-base my-2 font-Prompt self-start">{{ store.bio }}</p>
  </div>
  <!-- <div class="flex w-4/5 md:w-2/4 lg:w-2/5 xl:w-1/5"> -->
  <div class="flex justify-between w-4/5 max-w-sm">
    <Button />
    <button
      class="border border-solid rounded-md bg-ctp-base text-ctp-lavender font-Prompt border-ctp-text p-3 w-[49%]"
      @click="capture">
      Download
    </button>
  </div>
</template>
