// 匯出自訂指令物件。
export const focus = {
    mounted(el) {
        // 元素掛載後自動取得焦點。
        el.focus()
    }
}