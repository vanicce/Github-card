<script setup>
import { useCardStore } from '../stores/useCardStore';

const store = useCardStore()

const defineUser = async () => {
  if (store.searchInput === "") {
    window.alert("write a username");
    return
  }

  const response = await fetch(`https://api.github.com/users/${store.searchInput}`);
  try {
    if (!response.ok) {
      throw Error()
    }

    const userData = await response.json()
    const { bio, avatar_url, login, followers, following, public_repos, blog } = userData

    store.pic = avatar_url;
    store.login = login;
    store.bio = bio;
    store.followers = followers;
    store.following = following;
    store.repos = public_repos
    store.blog = blog

    store.url = `https://github.com/${login}`

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
  <div class="flex fixed md:static 2xl:absolute items-center top-0 left-0 w-full h-16 bg-ctp-mantle text-ctp-mauve">
    <p class="hidden md:block px-5">GitHub</p>
    <input
      class="p-1 border border-solid border-ctp-text rounded-l-md outline-none appearance-none bg-transparent w-full "
      placeholder="search a username..." type="search" v-model="store.searchInput" @keydown.enter="defineUser" />
    <button class="border border-ctp-text border-l-0 p-1 rounded-r-md" @click="defineUser">search</button>
    <button class="underline px-4">repos</button>
    <button class="underline px-4">card</button>
  </div>
</template>
