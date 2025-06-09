export const calculateDiscountedPrice = (price, promoCode) => {
  console.log('calculateDiscountedPrice:', { price, promoCode });
  
  if (!promoCode) return price;
  
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) return price;

  if (promoCode.discountType === 'percentage') {
    const discountedPrice = numericPrice * (1 - promoCode.discount_value / 100);
    return discountedPrice.toFixed(2);
  } else {
    const discountedPrice = Math.max(0, numericPrice - promoCode.discount_value);
    return discountedPrice.toFixed(2);
  }
};

export const formatPrice = (price) => {
  return `${parseFloat(price).toFixed(2)}€`;
}; 