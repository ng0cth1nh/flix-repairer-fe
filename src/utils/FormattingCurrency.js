export function formatCurrency(price) {
  return removeCommas(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export function removeCommas(price) {
  return price.includes(',') ? price.split(',').join('') : price;
}
