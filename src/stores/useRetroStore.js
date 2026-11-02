import { defineStore } from "pinia";
import { ref } from "vue";
import { usernameError } from "../username.js";
import { buildRetrospective } from "../retrospective.js";

const EMPTY_PIC = "/profilepic.jpg";
const MAX_REPO_PAGES = 3;

export const useRetroStore = defineStore("retro", () => {
  const login = ref("");
  const avatar = ref(EMPTY_PIC);
  const story = ref(null);
  const status = ref("idle");
  const errorMessage = ref("");
  const notice = ref("");
  let requestId = 0;

  function clearStory() {
    login.value = "";
    avatar.value = EMPTY_PIC;
    story.value = null;
  }

  function fail(message) {
    clearStory();
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

  async function readJson(response, id) {
    if (id !== requestId) return null;
    if (response.status === 404) {
      reportFailure("Usuário não encontrado.");
      return null;
    }
    if (response.status === 403 || response.status === 429) {
      reportFailure("Limite do GitHub atingido. Tente de novo mais tarde.");
      return null;
    }
    if (!response.ok) {
      reportFailure("Não foi possível ler este GitHub.");
      return null;
    }
    const data = await response.json();
    if (id !== requestId) return null;
    return data;
  }

  async function loadRepos(name, id) {
    const repos = [];
    for (let page = 1; page <= MAX_REPO_PAGES; page += 1) {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(name)}/repos?per_page=100&page=${page}&sort=updated`
      );
      const data = await readJson(response, id);
      if (!data) return null;
      const batch = Array.isArray(data) ? data : [];
      repos.push(
        ...batch.map((repo) => ({
          name: repo.name,
          description: repo.description || "",
          language: repo.language || "",
          stars: repo.stargazers_count || 0,
          fork: Boolean(repo.fork),
          created: repo.created_at,
          pushed: repo.pushed_at,
          url: repo.html_url,
        }))
      );
      if (batch.length < 100) return { repos, complete: true };
    }
    return { repos, complete: false };
  }

  async function loadEvents(name, id) {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(name)}/events/public?per_page=100`
    );
    if (id !== requestId) return null;
    if (!response.ok) return [];
    const data = await response.json();
    if (id !== requestId) return null;
    return (Array.isArray(data) ? data : []).map((event) => ({
      type: event.type,
      action: event.payload?.action || "",
      commits: event.payload?.size ?? event.payload?.commits?.length ?? 0,
      createdAt: event.created_at,
    }));
  }

  async function loadUser(username, { force = false } = {}) {
    const name = String(username ?? "").trim();
    const invalid = usernameError(name);
    if (invalid) {
      requestId += 1;
      reportFailure(invalid);
      return false;
    }

    if (!force && status.value === "ready" && login.value.toLowerCase() === name.toLowerCase()) {
      return true;
    }

    const id = ++requestId;
    status.value = "loading";
    errorMessage.value = "";
    notice.value = "";

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(name)}`);
      const userData = await readJson(response, id);
      if (!userData) return false;

      const repoResult = await loadRepos(userData.login || name, id);
      if (!repoResult || id !== requestId) return false;
      const events = await loadEvents(userData.login || name, id);
      if (!events || id !== requestId) return false;

      const next = buildRetrospective({
        user: {
          login: userData.login || name,
          name: userData.name || "",
          avatar: userData.avatar_url || EMPTY_PIC,
          url: userData.html_url || "",
          createdAt: userData.created_at,
          followers: userData.followers || 0,
        },
        repos: repoResult.repos,
        events,
        complete: repoResult.complete,
        now: new Date(),
      });

      if (id !== requestId) return false;
      login.value = next.login;
      avatar.value = next.avatar;
      story.value = next;
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
    login,
    avatar,
    story,
    status,
    errorMessage,
    notice,
    loadUser,
  };
});
