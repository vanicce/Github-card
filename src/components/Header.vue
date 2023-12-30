<script setup>
import { useCardStore } from '../stores/useCardStore';
import router from '../router/index'

const store = useCardStore()

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {
    if (event.key === 'i') {
      document.querySelector('input').focus()
      event.preventDefault()
    }
  }
})

const defineUser = async () => {
  const routerPath = router.currentRoute.value.params.user
  document.querySelector('input').blur()

  if (store.searchInput === "" && routerPath === 'your name') {
    window.alert("write a username");
    return
  }
  console.log('oiii');
  const response = await fetch(`https://api.github.com/users/${store.searchInput || routerPath}`);
  try {
    if (!response.ok) {
      throw Error()
    }

    const userData = await response.json()
    const { bio, avatar_url, login, followers, following, public_repos, blog, html_url } = userData

    store.pic = avatar_url;
    store.login = login;
    store.bio = bio;
    store.followers = followers;
    store.following = following;
    store.repos = public_repos
    store.blog = blog

    store.url = html_url

  } catch (error) {
    response.status === 404 ? (
      alert("user not finded")
    ) : (
      alert(`an error in requisiton ocurred: ${response.status} ${response.statusText}`)
    )
  } finally {
    router.push({ name: 'card', params: { user: store.login } })
    store.searchInput = ''
  }
};

setTimeout(() => {
  const routerPath = router.currentRoute.value.params.user

  const url = (() => {
    if (routerPath != "your name" && routerPath != undefined) {
      defineUser()
    }
  })()

}, 1000)
</script>

<template>
  <div class="flex items-center top-0 left-0 w-full h-16 border bg-zinc-50">
    <router-link to="/" class="hover:underline hidden md:block px-5">GitHub</router-link>
    <div class="flex w-full mx-3">
      <input
      class="p-1 border border-solid border-zinc-300 rounded-l-md outline-none appearance-none bg-transparent w-full"
      placeholder="search a username..." type="search" v-model="store.searchInput" @keydown.enter="defineUser"
      />
      <button id="searchBtn" class="border border-l-0 p-1 rounded-r-md border-zinc-300" @click="defineUser">search</button>
    </div>
    <router-link to="/repos" class="hidden md:block underline px-4">repos</router-link>
    <router-link id="card" :to="{ params: { user: store.login }, name: 'card' }" class="underline hidden md:block px-5">card</router-link>
  </div>
</template>
