import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardStore = defineStore("card", () => {
  const searchInput = ref("");
  const login = ref("your name");
  const pic = ref("../src/assets/profilepic.jpg");
  const bio = ref("your bio");
  const followers = ref(0);
  const following = ref(0);
  const repos = ref(0);

  return { searchInput, login, pic, bio, followers, following, repos };
});
