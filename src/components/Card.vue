<script setup>
import { reactive } from "vue";
import Button from "./Button.vue";

const state = reactive({
  searchInput: "",
  login: "your name",
  pic: "/profilepic.jpg",
  bio: "your bio",
  followers: 0,
  following: 0,
  repos: 0,
});

const defineUser = async () => {
  if (state.searchInput === "") {
    window.alert("write a username");
    return
  }
  const response = await fetch(`https://api.github.com/users/${state.searchInput}`);
  try {
    if (!response.ok) {
      throw Error()
    }

    const userData = await response.json()
    console.log(userData);
    const { bio, avatar_url, login, followers, following, public_repos, blog } = userData

    state.pic = avatar_url;
    state.login = login;
    state.bio = bio;
    state.followers = followers;
    state.following = following;
    state.repos = public_repos
    state.blog = blog

    state.url = `https://github.com/${login}`

  } catch (error) {
    if (response.status === 404) {
      window.alert("user not finded")
      return
    }
    window.alert(`an error in requisiton ocurred: ${response.status} ${response.statusText}`)
  }
};

</script>

<template>
  <div
    class="flex flex-col justify-center items-center p-3 rounded-md border-ctp-text border bg-ctp-base max-w-xs md:w-3/5 m-2 text-ctp-lavender">
    <div class="px-0 flex justify-center w-full">
      <input
        class="p-1 border border-solid border-ctp-text rounded-l-md outline-none appearance-none bg-transparent w-full"
        placeholder="search a username..." type="search" v-model="state.searchInput" @keydown.enter="defineUser" />
      <button class="border border-ctp-text border-l-0 p-1 rounded-r-md" @click="defineUser">search</button>
    </div>
    <img class="rounded-full w-56 h-56 md:w-64 md:h-64 m-4" :src="state.pic" alt="foto de perfil do github" />
    <a class="underline text-2xl md:text-3xl font-Prompt" :href="state.url" target="_blank">@{{ state.login }}</a>
    <div class="flex">
      <p class="text-base md:text-base  mt-2 font-Prompt">followers: {{ state.followers }}</p>
      <p class="text-base mt-2 mx-2">&#x2022</p>
      <p class="text-base md:text-base  mt-2 font-Prompt">following: {{ state.following }}</p>
    </div>
    <p>repos: {{ state.repos }}</p>
    <a class="underline" :href="state.blog" target="_blank">{{ state.blog }}</a>
    <p class="text-sm md:text-base mt-2 font-Prompt self-start">{{ state.bio }}</p>
  </div>
  <Button />
</template>

