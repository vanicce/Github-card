<script setup>
import Button from "./Button.vue";
import { useCardStore } from "../stores/useCardStore.js";
import html2canvas from "html2canvas"

const store = useCardStore()

const capture = () => {
  const element = document.querySelector('#conteudo');

   html2canvas(element, {
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
    class="flex flex-col justify-center items-center p-2 rounded-2xl border w-4/5 max-w-sm m-2">
    <img id='img' class="rounded-2xl mb-3" :src="store.pic" alt="foto de perfil do github" />
    <a class="hover:underline text-2xl md:text-3xl font-Prompt" :href="store.url" target="_blank">@{{ store.login }}</a>
    <div class="flex">
      <p class="text-base mt-2 font-Prompt">followers: {{ store.followers }}</p>
      <p class="text-md mt-2 mx-2">&#x2022</p>
      <p class="text-md mt-2 font-Prompt">following: {{ store.following }}</p>
    </div>
    <p class="text-md font-Prompt">repos: {{ store.repos }}</p>
    <a class="text-md font-Prompt underline" :href="store.blog" target="_blank">{{ store.blog }}</a>
    <p class="text-md my-2 font-Prompt self-center">{{ store.bio }}</p>
  </div>
  <div class="flex justify-between w-4/5 max-w-sm">
    <Button />
    <button class="border border-solid rounded-md font-Prompt p-3 w-[49%]"
      @click="capture">
      Download
    </button>
  </div>
</template>
