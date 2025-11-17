// 가격 계산 유틸리티 함수

export const calculateItemPrice = (basePrice, selectedOptions) => {
  const optionsPrice = (selectedOptions || []).reduce(
    (sum, opt) => sum + (opt.price || opt.optionPrice || 0),
    0
  );
  return basePrice + optionsPrice;
};

export const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

