// 如果狀態被放到元件外部、獨立 JavaScript 模組，或使用 Pinia，便可能成為共用狀態。

import { ref } from 'vue'

export const sharedCount = ref(0)