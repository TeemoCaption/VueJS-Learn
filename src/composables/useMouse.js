import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 追蹤目前滑鼠在頁面上的座標。
 *
 * 命名慣例：
 * 組合式函數通常以 use 開頭。
 */
export function useMouse() {
    // 每次呼叫 useMouse()，都會建立新的響應式狀態。
    const x = ref(0)
    const y = ref(0)

    /**
     * 更新滑鼠座標。
     *
     * @param {MouseEvent} event 滑鼠事件物件
     */
    function updateMousePosition(event) {
        x.value = event.pageX
        y.value = event.pageY
    }

    // 使用這個組合式函數的元件掛載後，
    // 才開始監聽瀏覽器事件。
    onMounted(() => {
        window.addEventListener('mousemove', updateMousePosition)
    })

    // 元件卸載時必須清除事件監聽器。
    // 若元件已經被移除，監聽器卻仍存在，瀏覽器仍可能繼續保留相關資源。
    onUnmounted(() => {
        window.removeEventListener('mousemove', updateMousePosition)
    })

    // 回傳 ref，讓元件保持響應性。
    return {
        x,
        y
    }
}