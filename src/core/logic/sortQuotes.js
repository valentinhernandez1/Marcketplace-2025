export function sortQuotes(quotes, criterio) {
  if (!Array.isArray(quotes)) return [];

  switch (criterio) {
    case "precio":
      return [...quotes].sort((a, b) => a.precio - b.precio);

    case "plazo":
      return [...quotes].sort((a, b) => a.plazoDias - b.plazoDias);

    case "rating":
      return [...quotes].sort(
        (a, b) => (b.ratingProveedorMock || 0) - (a.ratingProveedorMock || 0)
      );

    default:
      return quotes;
  }
}
