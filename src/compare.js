import { formatCount } from "./format.js";

export function compareMetric(current, previous) {
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const percent = previous > 0 ? Math.round((diff / previous) * 100) : null;
  return { current, previous, diff, direction, percent };
}

export function deltaLabel(diff) {
  if (diff > 0) return `+${formatCount(diff)}`;
  return formatCount(diff);
}

export function percentLabel(percent) {
  if (percent === null || percent === 0) return "";
  if (percent > 0) return `+${formatCount(percent)}%`;
  return `${formatCount(percent)}%`;
}

export function deltaPhrase(diff, year) {
  if (diff === 0) return `Igual a ${year}`;
  const amount = formatCount(Math.abs(diff));
  if (diff > 0) return `${amount} a mais que ${year}`;
  return `${amount} a menos que ${year}`;
}

export function summarizeYear(repos, totalCount = repos.length) {
  const stars = repos.reduce((sum, repo) => sum + (Number(repo.stars) || 0), 0);
  const counts = new Map();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  }
  let language = "";
  let best = 0;
  for (const [name, count] of counts) {
    if (count > best) {
      language = name;
      best = count;
    }
  }
  const first = repos[0];
  return {
    count: totalCount,
    stars,
    partial: totalCount > repos.length,
    language,
    top: first
      ? {
          name: first.name,
          stars: Number(first.stars) || 0,
          url: first.url || "",
          description: first.description || "",
        }
      : null,
  };
}

function languageDetail(current, previous, previousYear) {
  if (current && previous && current === previous) return `A mesma de ${previousYear}.`;
  if (current && previous) return `Em ${previousYear} era ${previous}.`;
  if (current) return `Não aparecia em ${previousYear}.`;
  return `Em ${previousYear} era ${previous}.`;
}

function slide(fields) {
  return {
    delta: "",
    direction: "flat",
    percent: "",
    previous: "",
    detail: "",
    footnote: "",
    href: "",
    ...fields,
  };
}

export function buildComparison({ user, current, previous, year, previousYear }) {
  const repos = compareMetric(current.count, previous.count);
  const stars = compareMetric(current.stars, previous.stars);
  const topStars = compareMetric(current.top?.stars || 0, previous.top?.stars || 0);
  const partial = Boolean(current.partial || previous.partial);
  const starFootnote = partial
    ? "Soma dos 100 repositórios com mais estrelas em cada ano."
    : "Estrelas que esses repositórios têm hoje.";

  const slides = [
    slide({
      id: "cover",
      tone: "ink",
      kicker: `${year} contra ${previousYear}`,
      value: user.name || `@${user.login}`,
      detail: `@${user.login}`,
      footnote: "A comparação usa os repositórios públicos criados em cada ano.",
    }),
    slide({
      id: "repos",
      tone: "violet",
      kicker: "Repositórios criados",
      value: formatCount(repos.current),
      delta: deltaLabel(repos.diff),
      direction: repos.direction,
      percent: percentLabel(repos.percent),
      previous: `${formatCount(repos.previous)} em ${previousYear}`,
      detail: deltaPhrase(repos.diff, previousYear),
    }),
    slide({
      id: "stars",
      tone: "green",
      kicker: "Estrelas desses repositórios",
      value: formatCount(stars.current),
      delta: deltaLabel(stars.diff),
      direction: stars.direction,
      percent: percentLabel(stars.percent),
      previous: `${formatCount(stars.previous)} em ${previousYear}`,
      detail: deltaPhrase(stars.diff, previousYear),
      footnote: starFootnote,
    }),
    slide({
      id: "highlight",
      tone: "blue",
      kicker: `Maior de ${year}`,
      value: current.top?.name || "Nenhum",
      delta: current.top || previous.top ? deltaLabel(topStars.diff) : "",
      direction: topStars.direction,
      percent: percentLabel(topStars.percent),
      previous: previous.top ? `${previous.top.name} em ${previousYear}` : `Nenhum em ${previousYear}`,
      detail: current.top
        ? `${formatCount(current.top.stars)} estrelas. ${deltaPhrase(topStars.diff, previousYear)}.`
        : `Nenhum repositório criado em ${year}.`,
      href: current.top?.url || "",
    }),
  ];

  if (current.language || previous.language) {
    const changed = Boolean(current.language && previous.language && current.language !== previous.language);
    slides.push(
      slide({
        id: "language",
        tone: "amber",
        kicker: "Linguagem principal",
        value: current.language || "Sem linguagem",
        delta: changed ? "mudou" : current.language && current.language === previous.language ? "igual" : "",
        direction: changed ? "shift" : "flat",
        previous: previous.language ? `${previous.language} em ${previousYear}` : `Nenhuma em ${previousYear}`,
        detail: languageDetail(current.language, previous.language, previousYear),
      })
    );
  }

  slides.push(slide({ id: "card", tone: "ink", kicker: "O card", value: `${year}` }));

  return {
    login: user.login,
    name: user.name || "",
    avatar: user.avatar,
    url: user.url,
    year,
    previousYear,
    repos,
    stars,
    topStars,
    language: current.language,
    previousLanguage: previous.language,
    highlight: current.top,
    previousHighlight: previous.top,
    partial,
    slides,
  };
}
