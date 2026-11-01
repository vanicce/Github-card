<script setup>
import Button from "./Button.vue";
import { useCardStore } from "../stores/useCardStore.js";
import html2canvas from "html2canvas";
import { useShareStore } from "../stores/useShareStore";

const shareStore = useShareStore();
const store = useCardStore();

function website(blog) {
  if (!blog) return "";
  if (/^https?:\/\//i.test(blog)) return blog;
  return `https://${blog}`;
}

const capture = () => {
  const element = document.querySelector("#conteudo");
  if (!element) return;

  html2canvas(element, { useCORS: true, backgroundColor: "#ffffff" }).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `${store.login || "github"}_card`;
    link.click();
  });
};
</script>

<template>
  <article
    id="conteudo"
    class="w-full max-w-sm rounded-[28px] bg-white px-8 pb-8 pt-10 text-center shadow-card transition"
    :class="shareStore.showModal ? 'blur-sm' : ''"
  >
    <img
      id="img"
      class="mx-auto h-28 w-28 rounded-full object-cover"
      :src="store.pic"
      :alt="`Foto de perfil de ${store.login}`"
      crossorigin="anonymous"
    />
    <a class="mt-5 block text-[28px] font-semibold tracking-tight hover:underline" :href="store.url" target="_blank" rel="noopener noreferrer">@{{ store.login }}</a>
    <p v-if="store.bio" class="mt-2 text-[15px] leading-relaxed text-muted">{{ store.bio }}</p>
    <a
      v-if="store.blog"
      class="mt-2 block break-all text-[15px] text-[#0071e3]"
      :href="website(store.blog)"
      target="_blank"
      rel="noopener noreferrer"
    >{{ store.blog }}</a>
    <dl class="mt-8 grid grid-cols-3">
      <div>
        <dd class="text-[22px] font-semibold tracking-tight">{{ store.followers }}</dd>
        <dt class="mt-1 text-[12px] text-muted">Seguidores</dt>
      </div>
      <div class="border-x border-black/10">
        <dd class="text-[22px] font-semibold tracking-tight">{{ store.following }}</dd>
        <dt class="mt-1 text-[12px] text-muted">Seguindo</dt>
      </div>
      <div>
        <dd class="text-[22px] font-semibold tracking-tight">{{ store.repos }}</dd>
        <dt class="mt-1 text-[12px] text-muted">Repositórios</dt>
      </div>
    </dl>
  </article>
  <div class="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
    <Button />
    <button
      type="button"
      class="h-11 rounded-full bg-white text-[15px] text-ink shadow-card transition hover:bg-black/[0.03]"
      @click="capture"
    >Baixar</button>
  </div>
</template>
