import { defineStore } from "pinia";
import { ref } from "vue";
import { usernameError } from "../username.js";
import { buildComparison, summarizeYear } from "../compare.js";

const EMPTY_PIC = "/profilepic.jpg";

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
      reportFailure("Não foi possível comparar esses anos.");
      return null;
    }
    const data = await response.json();
    if (id !== requestId) return null;
    return data;
  }

  async function searchYear(name, year, id) {
    const query = `user:${name} fork:false created:${year}-01-01..${year}-12-31`;
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=100`
    );
    const data = await readJson(response, id);
    if (!data) return null;
    const items = Array.isArray(data.items) ? data.items : [];
    return summarizeYear(
      items.map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        stars: repo.stargazers_count || 0,
        url: repo.html_url || "",
      })),
      Number(data.total_count) || items.length
    );
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
    const year = new Date().getFullYear();
    const previousYear = year - 1;

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(name)}`);
      const userData = await readJson(response, id);
      if (!userData) return false;

      const loginName = userData.login || name;
      const [current, previous] = await Promise.all([
        searchYear(loginName, year, id),
        searchYear(loginName, previousYear, id),
      ]);
      if (!current || !previous || id !== requestId) return false;

      const next = buildComparison({
        user: {
          login: loginName,
          name: userData.name || "",
          avatar: userData.avatar_url || EMPTY_PIC,
          url: userData.html_url || "",
        },
        current,
        previous,
        year,
        previousYear,
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
