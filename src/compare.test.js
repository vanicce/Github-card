import assert from "node:assert/strict";
import test from "node:test";
import { buildComparison, compareMetric, deltaLabel, deltaPhrase, summarizeYear } from "./compare.js";

test("marks the difference up, down, and flat", () => {
  assert.equal(compareMetric(5, 2).direction, "up");
  assert.equal(compareMetric(5, 2).diff, 3);
  assert.equal(compareMetric(5, 2).percent, 150);
  assert.equal(compareMetric(2, 5).direction, "down");
  assert.equal(compareMetric(2, 5).percent, -60);
  assert.equal(compareMetric(4, 0).percent, null);
  assert.equal(compareMetric(3, 3).direction, "flat");
  assert.equal(deltaLabel(3), "+3");
  assert.equal(deltaLabel(-2), "-2");
  assert.equal(deltaLabel(0), "0");
  assert.equal(deltaPhrase(3, 2025), "3 a mais que 2025");
  assert.equal(deltaPhrase(-1, 2025), "1 a menos que 2025");
  assert.equal(deltaPhrase(0, 2025), "Igual a 2025");
});

test("builds a year comparison and keeps the delta on each number", () => {
  const story = buildComparison({
    year: 2026,
    previousYear: 2025,
    user: { login: "ada", name: "Ada", avatar: "", url: "https://github.com/ada" },
    current: summarizeYear(
      [
        { name: "novo", stars: 10, language: "Go", url: "https://github.com/ada/novo", description: "" },
        { name: "outro", stars: 2, language: "Go", url: "", description: "" },
      ],
      2
    ),
    previous: summarizeYear(
      [{ name: "velho", stars: 4, language: "Python", url: "", description: "" }],
      1
    ),
  });

  assert.equal(story.repos.diff, 1);
  assert.equal(story.stars.diff, 8);
  assert.equal(story.topStars.diff, 6);
  assert.equal(story.highlight.name, "novo");
  assert.equal(story.language, "Go");
  assert.equal(story.previousLanguage, "Python");
  assert.equal(story.slides.find((slide) => slide.id === "repos").delta, "+1");
  assert.equal(story.slides.find((slide) => slide.id === "stars").detail, "8 a mais que 2025");
  assert.equal(story.slides.find((slide) => slide.id === "language").delta, "mudou");
  assert.equal(story.slides.at(-1).id, "card");
});

test("says when the star sum only covers the top 100", () => {
  const year = summarizeYear([{ name: "a", stars: 5, language: "Rust", url: "", description: "" }], 120);
  assert.equal(year.partial, true);
  assert.equal(year.stars, 5);
  const story = buildComparison({
    year: 2026,
    previousYear: 2025,
    user: { login: "ada", name: "", avatar: "", url: "" },
    current: year,
    previous: summarizeYear([], 0),
  });
  assert.match(story.slides.find((slide) => slide.id === "stars").footnote, /100/);
  assert.equal(story.slides.some((slide) => slide.id === "language"), true);
});
