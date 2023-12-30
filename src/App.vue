<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Wrapper from './components/Wrapper.vue'
</script>

<template>
  <Header />
  <Wrapper>
    <router-view class="min-h-[100dvh]"/>
  </Wrapper>
  <Footer />
</template>
