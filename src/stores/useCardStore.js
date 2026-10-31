import { defineStore } from "pinia";
import { ref } from "vue";
import { usernameError } from "../username.js";

const EMPTY_PIC = "/profilepic.jpg";

export const useCardStore = defineStore("card", () => {
  const searchInput = ref("");
  const login = ref("");
  const pic = ref(EMPTY_PIC);
  const bio = ref("");
  const followers = ref(0);
  const following = ref(0);
  const repos = ref(0);
  const blog = ref("");
  const url = ref("");
  const status = ref("idle");
  const errorMessage = ref("");
  const repoList = ref([]);
  const repoError = ref("");
  let requestId = 0;

  function clearProfile() {
    login.value = "";
    pic.value = EMPTY_PIC;
    bio.value = "";
    followers.value = 0;
    following.value = 0;
    repos.value = 0;
    blog.value = "";
    url.value = "";
    repoList.value = [];
    repoError.value = "";
  }

  function fail(message) {
    clearProfile();
    status.value = "error";
    errorMessage.value = message;
  }

  async function loadRepos(loginName, id) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(loginName)}/repos?sort=updated&per_page=6`
      );
      if (id !== requestId) return;

      if (response.status === 403 || response.status === 429) {
        repoList.value = [];
        repoError.value = "GitHub rate limit reached. Try again later.";
        return;
      }

      if (!response.ok) {
        repoList.value = [];
        repoError.value = "Could not load repositories.";
        return;
      }

      const data = await response.json();
      if (id !== requestId) return;

      repoList.value = (Array.isArray(data) ? data : []).map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description ?? "",
        language: repo.language ?? "",
        stars: repo.stargazers_count ?? 0,
        url: repo.html_url,
      }));
      repoError.value = "";
    } catch {
      if (id !== requestId) return;
      repoList.value = [];
      repoError.value = "Could not load repositories.";
    }
  }

  async function loadUser(username, { force = false } = {}) {
    const name = String(username ?? "").trim();
    const invalid = usernameError(name);
    if (invalid) {
      requestId += 1;
      fail(invalid);
      return false;
    }

    if (
      !force &&
      status.value === "ready" &&
      login.value.toLowerCase() === name.toLowerCase()
    ) {
      return true;
    }

    const id = ++requestId;
    status.value = "loading";
    errorMessage.value = "";
    repoError.value = "";

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(name)}`
      );
      if (id !== requestId) return false;

      if (response.status === 404) {
        fail("User not found.");
        return false;
      }

      if (response.status === 403 || response.status === 429) {
        fail("GitHub rate limit reached. Try again later.");
        return false;
      }

      if (!response.ok) {
        fail("Could not load this profile.");
        return false;
      }

      const userData = await response.json();
      if (id !== requestId) return false;

      login.value = userData.login ?? name;
      pic.value = userData.avatar_url || EMPTY_PIC;
      bio.value = userData.bio ?? "";
      followers.value = userData.followers ?? 0;
      following.value = userData.following ?? 0;
      repos.value = userData.public_repos ?? 0;
      blog.value = userData.blog ?? "";
      url.value = userData.html_url ?? "";

      await loadRepos(login.value, id);
      if (id !== requestId) return false;

      status.value = "ready";
      return true;
    } catch {
      if (id !== requestId) return false;
      fail("Could not reach GitHub. Try again.");
      return false;
    }
  }

  return {
    searchInput,
    login,
    pic,
    bio,
    followers,
    following,
    repos,
    blog,
    url,
    status,
    errorMessage,
    repoList,
    repoError,
    loadUser,
  };
});
