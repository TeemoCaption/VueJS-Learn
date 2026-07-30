// 使用 provide/inject 時，建議使用 Symbol 作為鍵
// 這樣可以避免當專案變大時，鍵名衝突

// 建立唯一的 Symbol 作為注入鍵
// 即使其他地方也建立名為 userContext 的 Symbol，兩者仍不相同
export const userContextKey = Symbol('userContext')