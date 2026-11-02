import { formatCount, formatStars } from "./format.js";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const dayFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function fullYears(from, to) {
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const beforeAnniversary =
    to.getUTCMonth() < from.getUTCMonth() ||
    (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() < from.getUTCDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameYear(value, year) {
  const date = parseDate(value);
  return date ? date.getUTCFullYear() === year : false;
}

function topLanguage(repos) {
  const counts = new Map();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  }
  let best = null;
  for (const [language, count] of counts) {
    if (!best || count > best.count) best = { language, count };
  }
  return best;
}

function eventTime(events) {
  const dates = events.map((event) => parseDate(event.createdAt)).filter(Boolean);
  if (!dates.length) return "";
  const sorted = dates.sort((a, b) => a - b);
  return `${dayFormat.format(sorted[0])} – ${dayFormat.format(sorted[sorted.length - 1])}`;
}

function recentActivity(events) {
  let commits = 0;
  let pullRequests = 0;
  let issues = 0;
  for (const event of events) {
    if (event.type === "PushEvent") {
      const size = Number(event.commits);
      commits += Number.isFinite(size) && size > 0 ? size : 1;
    } else if (event.type === "PullRequestEvent" && event.action === "opened") {
      pullRequests += 1;
    } else if (event.type === "IssuesEvent" && event.action === "opened") {
      issues += 1;
    }
  }
  return { commits, pullRequests, issues, windowLabel: eventTime(events) };
}

function repoSentence(count) {
  return count === 1 ? "1 repositório novo" : `${formatCount(count)} repositórios novos`;
}

export function buildRetrospective({ user, repos, events = [], complete = true, now = new Date() }) {
  const joined = parseDate(user.createdAt) || now;
  const year = now.getUTCFullYear();
  const years = fullYears(joined, now);
  const originals = repos.filter((repo) => !repo.fork);
  const forks = repos.length - originals.length;
  const stars = originals.reduce((sum, repo) => sum + (Number(repo.stars) || 0), 0);
  const language = topLanguage(originals);
  const highlight = [...originals].sort((a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name))[0] || null;
  const createdThisYear = originals.filter((repo) => sameYear(repo.created, year)).length;
  const activeThisYear = originals.filter((repo) => sameYear(repo.pushed, year)).length;
  const activity = recentActivity(events);
  const partial = complete ? "" : `Lidos os ${formatCount(repos.length)} repositórios atualizados por último. A conta tem mais.`;

  const slides = [
    {
      id: "cover",
      kicker: "Retrospectiva",
      title: user.name || `@${user.login}`,
      detail: user.name ? `@${user.login}` : "O que esta conta deixa público no GitHub.",
    },
    {
      id: "years",
      kicker: `No GitHub desde ${dateFormat.format(joined)}`,
      title: years === 0 ? "Entrou este ano" : years === 1 ? "1 ano" : `${formatCount(years)} anos`,
      detail: years === 0 ? "A conta ainda está no primeiro ano." : "Tempo desde a criação da conta.",
    },
    {
      id: "followers",
      kicker: "Seguidores",
      title: formatCount(user.followers || 0),
      detail:
        user.followers === 0
          ? "Ninguém acompanha esta conta ainda."
          : user.followers === 1
            ? "Uma pessoa acompanha esta conta."
            : "Pessoas acompanhando esta conta.",
    },
    {
      id: "repos",
      kicker: "Repositórios originais",
      title: formatCount(originals.length),
      detail: forks
        ? forks === 1
          ? "A conta também tem 1 fork."
          : `A conta também tem ${formatCount(forks)} forks.`
        : "Todos são repositórios originais.",
      footnote: partial,
    },
    {
      id: "stars",
      kicker: "Estrelas recebidas",
      title: formatCount(stars),
      detail: stars === 1 ? "Uma estrela nos repositórios originais." : "Somadas nos repositórios originais.",
      footnote: partial,
    },
  ];

  if (language) {
    slides.push({
      id: "language",
      kicker: "Linguagem que mais aparece",
      title: language.language,
      detail: `Em ${formatCount(language.count)} ${language.count === 1 ? "repositório original" : "repositórios originais"}.`,
    });
  }

  if (highlight) {
    slides.push({
      id: "highlight",
      kicker: "Repositório em destaque",
      title: highlight.name,
      detail: [formatStars(highlight.stars), highlight.description].filter(Boolean).join(" · "),
      href: highlight.url,
    });
  }

  slides.push({
    id: "year",
    kicker: `Em ${year}`,
    title: createdThisYear === 0 ? "Nenhum repositório novo" : repoSentence(createdThisYear),
    detail:
      activeThisYear === 0
        ? "Nenhum repositório original teve envio neste ano."
        : activeThisYear === 1
          ? "1 repositório original teve envio neste ano."
          : `${formatCount(activeThisYear)} repositórios originais tiveram envio neste ano.`,
  });

  if (events.length) {
    const parts = [];
    if (activity.pullRequests) {
      parts.push(
        activity.pullRequests === 1 ? "1 pull request aberto" : `${formatCount(activity.pullRequests)} pull requests abertos`
      );
    }
    if (activity.issues) {
      parts.push(activity.issues === 1 ? "1 issue aberta" : `${formatCount(activity.issues)} issues abertas`);
    }
    slides.push({
      id: "activity",
      kicker: activity.windowLabel ? `Atividade pública · ${activity.windowLabel}` : "Atividade pública recente",
      title: activity.commits === 1 ? "1 commit" : `${formatCount(activity.commits)} commits`,
      detail: parts.length
        ? `${parts.join(" e ")}. A API pública só devolve a janela recente.`
        : "A API pública só devolve a janela recente, não o ano inteiro.",
    });
  }

  slides.push({
    id: "card",
    kicker: "Para guardar",
    title: user.name || `@${user.login}`,
    detail: "O retrato desta retrospectiva.",
  });

  return {
    login: user.login,
    name: user.name || "",
    avatar: user.avatar,
    url: user.url,
    year,
    years,
    followers: user.followers || 0,
    originals: originals.length,
    forks,
    stars,
    language: language?.language || "",
    highlight,
    createdThisYear,
    activeThisYear,
    activity,
    partial,
    slides,
  };
}
