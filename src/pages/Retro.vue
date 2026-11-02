<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import html2canvas from "html2canvas";
import { useRetroStore } from "../stores/useRetroStore";
import { deltaLabel, deltaPhrase, percentLabel } from "../compare.js";
import { formatCount } from "../format.js";

const store = useRetroStore();
const index = ref(0);
const downloadMessage = ref("");
let downloadTimer;

const slides = computed(() => store.story?.slides || []);
const slide = computed(() => slides.value[index.value] || null);
const showing = computed(() => store.status === "ready" || (store.status === "loading" && store.login));

const tones = {
  ink: "bg-[#09090b]",
  violet: "bg-[#24043f]",
  green: "bg-[#03281c]",
  blue: "bg-[#041426]",
  amber: "bg-[#2a1404]",
};

const chips = {
  up: "bg-[#d6ff4a] text-black",
  down: "bg-[#ff5d73] text-black",
  shift: "bg-white text-black",
  flat: "bg-white/15 text-white",
};

watch(
  () => store.login,
  () => {
    index.value = 0;
    downloadMessage.value = "";
  }
);

function move(step) {
  const next = index.value + step;
  if (next < 0 || next >= slides.value.length) return;
  index.value = next;
  downloadMessage.value = "";
}

function onKeydown(event) {
  const tag = event.target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (event.key === "ArrowRight") move(1);
  if (event.key === "ArrowLeft") move(-1);
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  clearTimeout(downloadTimer);
});

function row(metric) {
  return {
    value: formatCount(metric.current),
    delta: deltaLabel(metric.diff),
    direction: metric.direction,
    previous: `${formatCount(metric.previous)} em ${store.story.previousYear}`,
    phrase: deltaPhrase(metric.diff, store.story.previousYear),
    percent: percentLabel(metric.percent),
  };
}

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
  <div class="flex flex-1 flex-col" :class="slide ? tones[slide.tone] : 'bg-[#09090b]'">
    <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8">
      <p v-if="store.notice && showing" class="mb-6 text-center text-[15px] text-white/70" role="alert">{{ store.notice }}</p>

      <div v-if="store.status === 'loading' && !store.login" class="flex flex-1 items-center justify-center" role="status">
        <p class="text-[17px] text-white/70">Comparando os dois anos…</p>
      </div>

      <div v-else-if="store.status === 'error'" class="flex flex-1 flex-col items-center justify-center text-center" role="alert">
        <h1 class="text-4xl font-semibold tracking-tight">Sem comparação para esse nome.</h1>
        <p class="mt-3 text-[17px] text-white/70">{{ store.errorMessage }}</p>
        <router-link to="/" class="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-[15px] text-black">Tentar outro nome</router-link>
      </div>

      <template v-else-if="showing && slide && store.story">
        <p class="text-center text-[13px] text-white/50">{{ index + 1 }} de {{ slides.length }}</p>

        <section class="flex flex-1 flex-col items-center justify-center py-10 text-center" aria-live="polite">
          <template v-if="slide.id === 'card'">
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
                    <p class="rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[row(store.story.repos).direction]">{{ row(store.story.repos).delta }}</p>
                  </div>
                  <p class="mt-1 text-[13px] text-white/55">{{ row(store.story.repos).previous }}</p>
                </div>
                <div>
                  <p class="text-[12px] uppercase tracking-[0.14em] text-white/45">Estrelas</p>
                  <div class="mt-1 flex items-end justify-between gap-3">
                    <p class="text-5xl font-semibold tracking-tight">{{ row(store.story.stars).value }}</p>
                    <p class="rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[row(store.story.stars).direction]">{{ row(store.story.stars).delta }}</p>
                  </div>
                  <p class="mt-1 text-[13px] text-white/55">{{ row(store.story.stars).previous }}</p>
                </div>
                <div>
                  <p class="text-[12px] uppercase tracking-[0.14em] text-white/45">Maior repositório</p>
                  <div class="mt-1 flex items-end justify-between gap-3">
                    <p class="truncate text-[28px] font-semibold tracking-tight">{{ store.story.highlight?.name || "Nenhum" }}</p>
                    <p class="shrink-0 rounded-full px-3 py-1 text-[18px] font-semibold" :class="chips[store.story.topStars.direction]">{{ deltaLabel(store.story.topStars.diff) }}</p>
                  </div>
                  <p class="mt-1 text-[13px] text-white/55">
                    {{ store.story.previousHighlight ? `${store.story.previousHighlight.name} em ${store.story.previousYear}` : `Nenhum em ${store.story.previousYear}` }}
                  </p>
                </div>
              </div>
              <p v-if="store.story.language || store.story.previousLanguage" class="mt-6 text-[15px]">
                {{ store.story.language || "Sem linguagem" }}
                <span class="text-white/50"> · {{ store.story.previousLanguage || "nenhuma" }} em {{ store.story.previousYear }}</span>
              </p>
            </article>
          </template>

          <template v-else>
            <p class="text-[13px] uppercase tracking-[0.16em] text-white/55">{{ slide.kicker }}</p>
            <h1 class="mt-4 max-w-3xl text-6xl font-semibold tracking-tight md:text-8xl">
              <a v-if="slide.href" class="hover:underline" :href="slide.href" target="_blank" rel="noopener noreferrer">{{ slide.value }}</a>
              <template v-else>{{ slide.value }}</template>
            </h1>
            <p
              v-if="slide.delta"
              class="mt-6 rounded-full px-5 py-2 text-3xl font-semibold tracking-tight md:text-5xl"
              :class="chips[slide.direction]"
            >{{ slide.delta }}</p>
            <p v-if="slide.percent" class="mt-3 text-2xl font-semibold" :class="slide.direction === 'down' ? 'text-[#ff5d73]' : 'text-[#d6ff4a]'">{{ slide.percent }}</p>
            <p v-if="slide.previous" class="mt-4 text-[17px] text-white/60">{{ slide.previous }}</p>
            <p v-if="slide.detail && slide.id !== 'cover'" class="mt-2 max-w-md text-[17px] text-white/80">{{ slide.detail }}</p>
            <p v-else-if="slide.detail" class="mt-3 text-[20px] text-white/70">{{ slide.detail }}</p>
            <p v-if="slide.footnote" class="mt-4 max-w-md text-[13px] text-white/45">{{ slide.footnote }}</p>
          </template>
        </section>

        <div class="flex items-center justify-between gap-3">
          <button type="button" class="h-11 rounded-full px-4 text-[15px] text-white disabled:opacity-30" :disabled="index === 0" @click="move(-1)">Anterior</button>
          <div class="flex items-center gap-1.5" role="tablist" aria-label="Quadros da comparação">
            <button
              v-for="(item, itemIndex) in slides"
              :key="item.id"
              type="button"
              role="tab"
              class="h-1.5 rounded-full"
              :class="itemIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30'"
              :aria-label="`Quadro ${itemIndex + 1}`"
              :aria-selected="itemIndex === index"
              @click="index = itemIndex"
            ></button>
          </div>
          <button v-if="slide.id === 'card'" type="button" class="h-11 rounded-full bg-[#d6ff4a] px-5 text-[15px] font-medium text-black" @click="capture">Baixar</button>
          <button v-else type="button" class="h-11 rounded-full bg-white px-5 text-[15px] text-black disabled:opacity-30" :disabled="index === slides.length - 1" @click="move(1)">Próximo</button>
        </div>
        <p v-if="downloadMessage" class="mt-3 text-center text-sm text-white/70" role="status">{{ downloadMessage }}</p>
      </template>
    </div>
  </div>
</template>
