export const calculateDiscountedPrice = (price, promoCode) => {
  console.log('calculateDiscountedPrice:', { price, promoCode });
  
  if (!promoCode) return price;
  
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) return price;

  // Compatibilité camelCase et snake_case
  const value = promoCode.discountValue ?? promoCode.discount_value;
  if (!value) return price;

  if (promoCode.discountType === 'percentage' || promoCode.discount_type === 'percentage') {
    return numericPrice * (1 - value / 100);
  } else {
    return Math.max(0, numericPrice - value);
  }
};

export const formatPrice = (price) => {
  return `${parseFloat(price).toFixed(2)}€`;
}; 