import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardStore = defineStore("card", () => {
  searchInput: "",
  login: "your name",
  pic: "/profilepic.jpg",
  bio: "your bio",
  followers: 0,
  following: 0,
  repos: 0,
});
