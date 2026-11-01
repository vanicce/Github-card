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
  const notice = ref("");
  const repoList = ref([]);
  const repoError = ref("");
  const repoPage = ref(0);
  const repoHasMore = ref(false);
  const repoLoading = ref(false);
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
    repoPage.value = 0;
    repoHasMore.value = false;
    repoLoading.value = false;
  }

  function fail(message) {
    clearProfile();
    notice.value = "";
    status.value = "error";
    errorMessage.value = message;
  }

  function reportFailure(message) {
    if (login.value) {
      status.value = "ready";
      notice.value = message;
      errorMessage.value = "";
      return;
    }
    fail(message);
  }

  function mapRepos(data) {
    return (Array.isArray(data) ? data : []).map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description ?? "",
      language: repo.language ?? "",
      stars: repo.stargazers_count ?? 0,
      url: repo.html_url,
    }));
  }

  async function loadRepos(loginName, id, { append = false } = {}) {
    const page = append ? repoPage.value + 1 : 1;
    repoLoading.value = true;
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(loginName)}/repos?sort=updated&per_page=6&page=${page}`
      );
      if (id !== requestId) return;

      if (response.status === 403 || response.status === 429) {
        if (!append) repoList.value = [];
        repoHasMore.value = false;
        repoError.value = "Limite do GitHub atingido. Tente de novo mais tarde.";
        return;
      }

      if (!response.ok) {
        if (!append) repoList.value = [];
        repoHasMore.value = false;
        repoError.value = "Não foi possível carregar os repositórios.";
        return;
      }

      const data = await response.json();
      if (id !== requestId) return;

      const mapped = mapRepos(data);
      const next = append ? repoList.value.concat(mapped) : mapped;
      repoList.value = next;
      repoPage.value = page;
      repoHasMore.value = mapped.length === 6 && next.length < repos.value;
      repoError.value = "";
    } catch {
      if (id !== requestId) return;
      if (!append) repoList.value = [];
      repoHasMore.value = false;
      repoError.value = "Não foi possível carregar os repositórios.";
    } finally {
      if (id === requestId) repoLoading.value = false;
    }
  }

  async function loadMoreRepos() {
    if (!login.value || !repoHasMore.value || repoLoading.value) return;
    await loadRepos(login.value, requestId, { append: true });
  }

  async function loadUser(username, { force = false } = {}) {
    const name = String(username ?? "").trim();
    const invalid = usernameError(name);
    if (invalid) {
      requestId += 1;
      reportFailure(invalid);
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
    notice.value = "";
    repoError.value = "";

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(name)}`
      );
      if (id !== requestId) return false;

      if (response.status === 404) {
        reportFailure("Usuário não encontrado.");
        return false;
      }

      if (response.status === 403 || response.status === 429) {
        reportFailure("Limite do GitHub atingido. Tente de novo mais tarde.");
        return false;
      }

      if (!response.ok) {
        reportFailure("Não foi possível carregar este perfil.");
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

      notice.value = "";
      status.value = "ready";
      return true;
    } catch {
      if (id !== requestId) return false;
      reportFailure("Não foi possível consultar o GitHub. Tente de novo.");
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
    notice,
    repoList,
    repoError,
    repoHasMore,
    repoLoading,
    loadUser,
    loadMoreRepos,
  };
});
