<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import html2canvas from "html2canvas";
import { useRetroStore } from "../stores/useRetroStore";
import { formatCount } from "../format.js";

const store = useRetroStore();
const index = ref(0);
const downloadMessage = ref("");
let downloadTimer;

const slides = computed(() => store.story?.slides || []);
const slide = computed(() => slides.value[index.value] || null);
const showing = computed(() => store.status === "ready" || (store.status === "loading" && store.login));

watch(
  () => store.login,
  () => {
    index.value = 0;
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

async function capture() {
  const element = document.querySelector("#retro-card");
  if (!element) return;
  try {
    const canvas = await html2canvas(element, { useCORS: true, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `${store.login || "github"}_retrospectiva`;
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
  <div class="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-10">
    <p v-if="store.notice && showing" class="mb-6 text-center text-[15px] text-muted" role="alert">{{ store.notice }}</p>

    <div v-if="store.status === 'loading' && !store.login" class="flex flex-1 items-center justify-center" role="status">
      <p class="text-[17px] text-muted">Lendo o GitHub…</p>
    </div>

    <div v-else-if="store.status === 'error'" class="flex flex-1 flex-col items-center justify-center text-center" role="alert">
      <h1 class="text-4xl font-semibold tracking-tight">Sem retrospectiva para esse nome.</h1>
      <p class="mt-3 text-[17px] text-muted">{{ store.errorMessage }}</p>
      <router-link to="/" class="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] text-white">Tentar outro nome</router-link>
    </div>

    <template v-else-if="showing && slide">
      <p class="text-center text-[13px] text-muted">{{ index + 1 }} de {{ slides.length }}</p>

      <section class="flex flex-1 flex-col items-center justify-center py-12 text-center" aria-live="polite">
        <p class="text-[13px] uppercase tracking-[0.14em] text-muted">{{ slide.kicker }}</p>

        <article
          v-if="slide.id === 'card' && store.story"
          id="retro-card"
          class="mt-6 w-full max-w-sm rounded-[28px] bg-white px-8 py-10 text-center shadow-card"
        >
          <img
            class="mx-auto h-20 w-20 rounded-full object-cover"
            :src="store.avatar"
            :alt="`Foto de ${store.login}`"
            crossorigin="anonymous"
          />
          <a class="mt-4 block text-[28px] font-semibold tracking-tight hover:underline" :href="store.story.url" target="_blank" rel="noopener noreferrer">
            {{ store.story.name || `@${store.story.login}` }}
          </a>
          <p v-if="store.story.name" class="text-[15px] text-muted">@{{ store.story.login }}</p>
          <dl class="mt-8 grid grid-cols-2 gap-y-6">
            <div>
              <dd class="text-[22px] font-semibold tracking-tight">{{ formatCount(store.story.years) }}</dd>
              <dt class="mt-1 text-[12px] text-muted">{{ store.story.years === 1 ? "ano" : "anos" }}</dt>
            </div>
            <div>
              <dd class="text-[22px] font-semibold tracking-tight">{{ formatCount(store.story.followers) }}</dd>
              <dt class="mt-1 text-[12px] text-muted">seguidores</dt>
            </div>
            <div>
              <dd class="text-[22px] font-semibold tracking-tight">{{ formatCount(store.story.originals) }}</dd>
              <dt class="mt-1 text-[12px] text-muted">repositórios</dt>
            </div>
            <div>
              <dd class="text-[22px] font-semibold tracking-tight">{{ formatCount(store.story.stars) }}</dd>
              <dt class="mt-1 text-[12px] text-muted">estrelas</dt>
            </div>
          </dl>
          <p v-if="store.story.language" class="mt-8 text-[15px]">{{ store.story.language }}</p>
          <p v-if="store.story.highlight" class="mt-1 text-[13px] text-muted">{{ store.story.highlight.name }}</p>
          <p class="mt-6 text-[13px] text-muted">{{ store.story.year }}</p>
        </article>

        <template v-else>
          <h1 class="mt-4 max-w-xl text-5xl font-semibold tracking-tight md:text-6xl">
            <a v-if="slide.href" class="hover:underline" :href="slide.href" target="_blank" rel="noopener noreferrer">{{ slide.title }}</a>
            <template v-else>{{ slide.title }}</template>
          </h1>
          <p class="mt-4 max-w-md text-[17px] leading-relaxed text-muted">{{ slide.detail }}</p>
          <p v-if="slide.footnote" class="mt-4 max-w-md text-[13px] text-muted">{{ slide.footnote }}</p>
        </template>
      </section>

      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          class="h-11 rounded-full px-4 text-[15px] text-ink disabled:opacity-30"
          :disabled="index === 0"
          @click="move(-1)"
        >Anterior</button>
        <div class="flex items-center gap-1.5" role="tablist" aria-label="Quadros da retrospectiva">
          <button
            v-for="(item, itemIndex) in slides"
            :key="item.id"
            type="button"
            class="h-1.5 rounded-full transition"
            :class="itemIndex === index ? 'w-6 bg-ink' : 'w-1.5 bg-black/20'"
            :aria-label="`Quadro ${itemIndex + 1}`"
            :aria-selected="itemIndex === index"
            role="tab"
            @click="index = itemIndex"
          ></button>
        </div>
        <button
          v-if="slide.id === 'card'"
          type="button"
          class="h-11 rounded-full bg-ink px-5 text-[15px] text-white"
          @click="capture"
        >Baixar</button>
        <button
          v-else
          type="button"
          class="h-11 rounded-full bg-ink px-5 text-[15px] text-white disabled:opacity-30"
          :disabled="index === slides.length - 1"
          @click="move(1)"
        >Próximo</button>
      </div>
      <p v-if="downloadMessage" class="mt-3 text-center text-sm text-muted" role="status">{{ downloadMessage }}</p>
    </template>
  </div>
</template>
