<script setup>
// import Wrapper from '../components/wrapper.vue';
import { defineAsyncComponent } from 'vue';

const Card = defineAsyncComponent(() =>
  import('../components/Card.vue')
)
</script>

<template>
  <Card />
</template>
