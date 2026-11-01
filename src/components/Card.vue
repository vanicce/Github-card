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

  html2canvas(element, { useCORS: true, backgroundColor: "#f4efe4" }).then((canvas) => {
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
    class="w-full max-w-sm overflow-hidden rounded-[28px] bg-paper text-ink shadow-card transition"
    :class="shareStore.showModal ? 'blur-sm' : ''"
  >
    <div class="bg-[#efe4d4] px-6 pb-2 pt-8">
      <img
        id="img"
        class="mx-auto h-36 w-36 rounded-full object-cover ring-4 ring-paper"
        :src="store.pic"
        :alt="`Foto de perfil de ${store.login}`"
        crossorigin="anonymous"
      />
    </div>
    <div class="px-6 pb-6 pt-4 text-center">
      <a class="block font-display text-4xl leading-none hover:underline" :href="store.url" target="_blank" rel="noopener noreferrer">@{{ store.login }}</a>
      <p v-if="store.bio" class="mt-3 text-sm leading-relaxed text-ink/75">{{ store.bio }}</p>
      <a
        v-if="store.blog"
        class="mt-2 block break-all text-sm underline decoration-ember underline-offset-4"
        :href="website(store.blog)"
        target="_blank"
        rel="noopener noreferrer"
      >{{ store.blog }}</a>
      <dl class="mt-5 grid grid-cols-3 gap-2 border-t border-ink/10 pt-4">
        <div>
          <dt class="text-[11px] uppercase tracking-wider text-ink/55">Seguidores</dt>
          <dd class="font-display text-2xl">{{ store.followers }}</dd>
        </div>
        <div>
          <dt class="text-[11px] uppercase tracking-wider text-ink/55">Seguindo</dt>
          <dd class="font-display text-2xl">{{ store.following }}</dd>
        </div>
        <div>
          <dt class="text-[11px] uppercase tracking-wider text-ink/55">Repositórios</dt>
          <dd class="font-display text-2xl">{{ store.repos }}</dd>
        </div>
      </dl>
    </div>
  </article>
  <div class="mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
    <Button />
    <button
      type="button"
      class="h-12 rounded-full border border-paper/30 font-medium transition hover:border-paper"
      @click="capture"
    >Baixar</button>
  </div>
</template>
