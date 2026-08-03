/**
 * 將數字格式化為新臺幣。
 *
 * 這只是一般 JavaScript 函數，
 * 沒有使用 Vue 的 ref、computed 或生命週期鉤子。
 */
export function formatPrice(price) {
  // Intl.NumberFormat 是 JavaScript 的原生 API，用於格式化數字。
  // 第一個參數是語言環境，'zh-TW' 表示繁體中文（台灣）。
  // 第二個參數是選項物件，用於指定格式化的方式。 currency 表示貨幣格式，TWD 表示新臺幣。
  // maximumFractionDigits: 0 表示不顯示小數點。
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0
  }).format(price)
}