const USERNAME = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export function usernameError(value) {
  const name = String(value ?? "").trim();
  if (!name) return "Digite um nome de usuário.";
  if (!USERNAME.test(name)) {
    return "Use apenas letras, números e hífens simples.";
  }
  return "";
}
