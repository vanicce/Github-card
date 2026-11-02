const numberFormat = new Intl.NumberFormat("pt-BR");

export function formatCount(value) {
  return numberFormat.format(Number(value) || 0);
}

export function formatStars(value) {
  const count = Number(value) || 0;
  const label = count === 1 ? "estrela" : "estrelas";
  return `${formatCount(count)} ${label}`;
}
