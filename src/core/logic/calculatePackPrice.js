export function calculatePackPrice(items) {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const subtotal = (item.precioUnit || 0) * (item.cantidad || 1);
    return total + subtotal;
  }, 0);
}
