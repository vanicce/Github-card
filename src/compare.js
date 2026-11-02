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

export function buildComparison({ user, current, previous, year, previousYear }) {
  return {
    login: user.login,
    name: user.name || "",
    avatar: user.avatar,
    url: user.url,
    year,
    previousYear,
    repos: compareMetric(current.count, previous.count),
    stars: compareMetric(current.stars, previous.stars),
    topStars: compareMetric(current.top?.stars || 0, previous.top?.stars || 0),
    language: current.language,
    previousLanguage: previous.language,
    highlight: current.top,
    previousHighlight: previous.top,
    partial: Boolean(current.partial || previous.partial),
  };
}
