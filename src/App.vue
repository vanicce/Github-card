<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Wrapper from "./components/Wrapper.vue";
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col">
    <Header />
    <Wrapper>
      <router-view />
    </Wrapper>
    <Footer />
  </div>
</template>
