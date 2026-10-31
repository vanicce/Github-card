const USERNAME = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export function usernameError(value) {
  const name = String(value ?? "").trim();
  if (!name) return "Enter a GitHub username.";
  if (!USERNAME.test(name)) {
    return "Use letters, numbers, and single hyphens only.";
  }
  return "";
}
