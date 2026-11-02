<script setup>
import { computed, onUnmounted, ref } from "vue";
import html2canvas from "html2canvas";
import { useRetroStore } from "../stores/useRetroStore";
import { deltaLabel, percentLabel } from "../compare.js";
import { formatCount } from "../format.js";

const store = useRetroStore();
const downloadMessage = ref("");
let downloadTimer;

const showing = computed(() => store.status === "ready" || (store.status === "loading" && store.login));

const chips = {
  up: "bg-[#d6ff4a] text-black",
  down: "bg-[#ff5d73] text-black",
  flat: "bg-white/15 text-white",
};

function row(metric) {
  return {
    value: formatCount(metric.current),
    delta: deltaLabel(metric.diff),
    direction: metric.direction,
    previous: `${formatCount(metric.previous)} em ${store.story.previousYear}`,
    percent: percentLabel(metric.percent),
  };
}

onUnmounted(() => clearTimeout(downloadTimer));

async function capture() {
  const element = document.querySelector("#year-card");
  if (!element) return;
  try {
    const canvas = await html2canvas(element, { useCORS: true, backgroundColor: "#141414" });
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `${store.login || "github"}_${store.story?.year || "ano"}`;
    link.click();
    downloadMessage.value = "Imagem salva";
  } catch {
    downloadMessage.value = "Não foi possível salvar";
  }
  clearTimeout(downloadTimer);
  downloadTimer = setTimeout(() => {
    downloadMessage.value = "";
  }, 2500);
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-5 py-14">
    <p v-if="store.notice && showing" class="mb-6 text-center text-[15px] text-white/70" role="alert">{{ store.notice }}</p>

    <div v-if="store.status === 'loading' && !store.login" class="flex flex-1 items-center" role="status">
      <p class="text-[17px] text-white/70">Comparando os dois anos…</p>
    </div>

    <div v-else-if="store.status === 'error'" class="flex flex-1 flex-col items-center justify-center text-center" role="alert">
      <h1 class="text-4xl font-semibold tracking-tight">Sem card para esse nome.</h1>
      <p class="mt-3 text-[17px] text-white/70">{{ store.errorMessage }}</p>
      <router-link to="/" class="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-[15px] text-black">Tentar outro nome</router-link>
    </div>

    <template v-else-if="showing && store.story">
      <article id="year-card" class="w-full max-w-sm rounded-[28px] bg-[#141414] px-7 py-8 text-left text-white">
        <div class="flex items-center gap-4">
          <img class="h-16 w-16 rounded-full object-cover" :src="store.avatar" :alt="`Foto de ${store.login}`" crossorigin="anonymous" />
          <div class="min-w-0">
            <a class="block truncate text-[22px] font-semibold tracking-tight hover:underline" :href="store.story.url" target="_blank" rel="noopener noreferrer">
              {{ store.story.name || `@${store.story.login}` }}
            </a>
            <p class="text-[13px] text-white/60">@{{ store.story.login }}</p>
          </div>
        </div>
        <p class="mt-6 text-[13px] uppercase tracking-[0.16em] text-white/50">{{ store.story.year }} contra {{ store.story.previousYear }}</p>

        <div class="mt-5 space-y-5">
          <div>
            <p class="text-[12px] uppercase tracking-[0.14em] text-white/45">Repositórios</p>
            <div class="mt-1 flex items-end justify-between gap-3">
              <p class="text-5xl font-semibold tracking-tight">{{ row(store.story.repos).value }}</p>
              <div class="text-right">
                <p class="rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[row(store.story.repos).direction]">{{ row(store.story.repos).delta }}</p>
                <p v-if="row(store.story.repos).percent" class="mt-1 text-[13px] font-semibold" :class="store.story.repos.direction === 'down' ? 'text-[#ff5d73]' : 'text-[#d6ff4a]'">{{ row(store.story.repos).percent }}</p>
              </div>
            </div>
            <p class="mt-1 text-[13px] text-white/55">{{ row(store.story.repos).previous }}</p>
          </div>
          <div>
            <p class="text-[12px] uppercase tracking-[0.14em] text-white/45">Estrelas</p>
            <div class="mt-1 flex items-end justify-between gap-3">
              <p class="text-5xl font-semibold tracking-tight">{{ row(store.story.stars).value }}</p>
              <div class="text-right">
                <p class="rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[row(store.story.stars).direction]">{{ row(store.story.stars).delta }}</p>
                <p v-if="row(store.story.stars).percent" class="mt-1 text-[13px] font-semibold" :class="store.story.stars.direction === 'down' ? 'text-[#ff5d73]' : 'text-[#d6ff4a]'">{{ row(store.story.stars).percent }}</p>
              </div>
            </div>
            <p class="mt-1 text-[13px] text-white/55">{{ row(store.story.stars).previous }}</p>
          </div>
          <div>
            <p class="text-[12px] uppercase tracking-[0.14em] text-white/45">Maior repositório</p>
            <div class="mt-1 flex items-end justify-between gap-3">
              <p class="truncate text-[28px] font-semibold tracking-tight">{{ store.story.highlight?.name || "Nenhum" }}</p>
              <div class="shrink-0 text-right">
                <p class="rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[store.story.topStars.direction]">{{ deltaLabel(store.story.topStars.diff) }}</p>
                <p v-if="percentLabel(store.story.topStars.percent)" class="mt-1 text-[13px] font-semibold" :class="store.story.topStars.direction === 'down' ? 'text-[#ff5d73]' : 'text-[#d6ff4a]'">{{ percentLabel(store.story.topStars.percent) }}</p>
              </div>
            </div>
            <p class="mt-1 text-[13px] text-white/55">
              {{ store.story.previousHighlight ? `${store.story.previousHighlight.name} em ${store.story.previousYear}` : `Nenhum em ${store.story.previousYear}` }}
            </p>
          </div>
        </div>
        <p v-if="store.story.language || store.story.previousLanguage" class="mt-6 text-[15px]">
          <template v-if="store.story.language && store.story.language === store.story.previousLanguage">
            {{ store.story.language }}
            <span class="text-white/50"> · a mesma de {{ store.story.previousYear }}</span>
          </template>
          <template v-else>
            {{ store.story.language || "Sem linguagem" }}
            <span class="text-white/50"> · {{ store.story.previousLanguage || "nenhuma" }} em {{ store.story.previousYear }}</span>
          </template>
        </p>
        <p v-if="store.story.partial" class="mt-4 text-[12px] text-white/40">Estrelas dos 100 repositórios com mais estrelas em cada ano.</p>
      </article>
      <button type="button" class="mt-6 h-11 rounded-full bg-[#d6ff4a] px-6 text-[15px] font-medium text-black" @click="capture">Baixar</button>
      <p v-if="downloadMessage" class="mt-3 text-center text-sm text-white/70" role="status">{{ downloadMessage }}</p>
    </template>
  </div>
</template>
