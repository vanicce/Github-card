<script setup>
import { reactive } from "vue";

let searchInput = "";

const state = reactive({
  pic: "/profilepic.jpg",
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
        const { bio, avatar_url, login, followers, following, public_repos, name  } = res;
        state.pic = avatar_url;
        state.login = login;
        state.name = name;
        state.bio = bio;
        state.followers = followers;
        state.following = following;
        state.repos = public_repos;
      });
  }
};
</script>

<template>
  <div class="flex justify-center items-center bg-blue flex-col h-full sm:h-screen md:w-screen">
    <h1 class="text-5xl md:text-6xl p-3 text-navy font-Prompt">Find Your Github Card</h1>
    <div class="flex flex-col justify-center items-center p-3 rounded-md bg-sea w-72 max-w-xs md:w-3/5 m-2">
      <div class="flex justify-center">
        <input class="p-1 border border-solid border-slate-700 rounded-l-md w-full" type="search" v-model="searchInput" />
        <button class="border border-solid border-slate-700 border-l-0 p-1 rounded-r-md  w-16" @click="defineUser">search</button>
      </div>
      <img class="rounded-full w-64 h-64 m-4 select-none" v-bind:src="state.pic" alt="" />
      <h2 class="text-2xl md:text-3xl text-navy font-Prompt">@{{ state.login }}</h2>
      <div class="flex">
        <p class="text-base md:text-base text-navy mt-2 font-Prompt">followers: {{ state.followers }}</p>
        <p class="text-base mt-2 mx-2 text-navy">&#x2022</p>
        <p class="text-base md:text-base text-navy mt-2 font-Prompt">following: {{ state.following }}</p>
      </div>
      <p class="text-sm md:text-base text-navy mt-2 font-Prompt self-start" >{{ state.bio }}</p>
    </div>
  </div>
</template>

<style>
</style>
