<script setup>
import { reactive } from "vue";

let searchInput = "";

const state = reactive({
  pic: "./public/profilepic.jpg",
  bio: "sua bio",
  login: "seu nome",
});

const defineUser = () => {
  if (searchInput == "") {
    window.alert("pesquise um nome de usuário");
  } else {
    let user = searchInput;

    const promisse = fetch(`https://api.github.com/users/${user}`);

    promisse
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const { bio, avatar_url, login } = res;
        state.bio = bio;
        (state.pic = avatar_url), (state.login = login);
      });
  }
};
</script>

<template>
  <div class="h-screen w-full flex justify-center items-center bg-blue flex-col">
    <h1 class="text-6xl p-5 text-navy">Find Your Github Card</h1>
    <div class="justify-center items-center p-3 rounded-md bg-sea max-w-xs m-2">
      <div class="flex justify-center">
        <input class="p-1 border border-solid border-slate-700 rounded-md " type="search" v-model="searchInput" />
        <button class="border- border-solid border-slate-700 p-1 rounded-md w-16" @click="defineUser">search</button>
      </div>
      <div class="flex justify-center">
        <img class="rounded-full w-64 h-64 m-4 select-none" v-bind:src="state.pic" alt="" />
      </div>
      <h2 class="text-3xl text-navy">{{ state.login }}</h2>
      <p class="text-navy" >{{ state.bio }}</p>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@300&display=swap");

</style>
