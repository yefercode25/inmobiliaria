export const formatPrice = (price: string): string => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));
};
