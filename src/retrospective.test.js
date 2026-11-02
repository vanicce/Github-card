import assert from "node:assert/strict";
import test from "node:test";
import { buildRetrospective, fullYears } from "./retrospective.js";

const now = new Date("2026-11-01T12:00:00Z");

function user(overrides = {}) {
  return {
    login: "octocat",
    name: "The Octocat",
    avatar: "https://example.com/a.png",
    url: "https://github.com/octocat",
    createdAt: "2011-01-25T00:00:00Z",
    followers: 1000,
    ...overrides,
  };
}

test("counts full years without rounding up before the anniversary", () => {
  assert.equal(fullYears(new Date("2011-01-25T00:00:00Z"), now), 15);
  assert.equal(fullYears(new Date("2026-12-01T00:00:00Z"), now), 0);
});

test("builds a retrospective from public repos and recent events", () => {
  const retro = buildRetrospective({
    now,
    complete: true,
    user: user(),
    repos: [
      { name: "hello", fork: false, stars: 10, language: "JavaScript", created: "2026-02-01T00:00:00Z", pushed: "2026-03-01T00:00:00Z", description: "Oi", url: "https://github.com/octocat/hello" },
      { name: "old", fork: false, stars: 40, language: "JavaScript", created: "2012-01-01T00:00:00Z", pushed: "2024-01-01T00:00:00Z", description: "", url: "https://github.com/octocat/old" },
      { name: "copy", fork: true, stars: 999, language: "Python", created: "2026-01-01T00:00:00Z", pushed: "2026-01-02T00:00:00Z", description: "", url: "" },
    ],
    events: [
      { type: "PushEvent", commits: 3, createdAt: "2026-10-01T00:00:00Z" },
      { type: "PushEvent", commits: 0, createdAt: "2026-10-02T00:00:00Z" },
      { type: "PullRequestEvent", action: "opened", createdAt: "2026-10-28T00:00:00Z" },
      { type: "PullRequestEvent", action: "closed", createdAt: "2026-10-29T00:00:00Z" },
      { type: "IssuesEvent", action: "opened", createdAt: "2026-10-30T00:00:00Z" },
    ],
  });

  assert.equal(retro.originals, 2);
  assert.equal(retro.forks, 1);
  assert.equal(retro.stars, 50);
  assert.equal(retro.language, "JavaScript");
  assert.equal(retro.highlight.name, "old");
  assert.equal(retro.createdThisYear, 1);
  assert.equal(retro.activeThisYear, 1);
  assert.equal(retro.activity.commits, 4);
  assert.equal(retro.activity.pullRequests, 1);
  assert.equal(retro.activity.issues, 1);
  assert.deepEqual(
    retro.slides.map((slide) => slide.id),
    ["cover", "years", "followers", "repos", "stars", "language", "highlight", "year", "activity", "card"]
  );
  assert.equal(retro.slides.find((slide) => slide.id === "years").title, "15 anos");
  assert.equal(retro.slides.find((slide) => slide.id === "stars").title, "50");
  assert.match(retro.slides.find((slide) => slide.id === "highlight").detail, /40 estrelas/);
});

test("says when the reading stopped before the full account", () => {
  const retro = buildRetrospective({
    now,
    complete: false,
    user: user({ followers: 0, createdAt: "2026-06-01T00:00:00Z" }),
    repos: [],
    events: [],
  });

  assert.equal(retro.slides.find((slide) => slide.id === "years").title, "Entrou este ano");
  assert.match(retro.slides.find((slide) => slide.id === "repos").footnote, /Lidos os 0/);
  assert.equal(retro.slides.some((slide) => slide.id === "language"), false);
  assert.equal(retro.slides.some((slide) => slide.id === "activity"), false);
});
