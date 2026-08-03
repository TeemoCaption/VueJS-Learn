import {
    ref,
    watchEffect,
    toValue
} from 'vue'

/**
 * 支援響應式 URL，並在 URL 改變時取消舊請求。
 *
 * @param {
 *   string |
 *   import('vue').Ref<string> |
 *   (() => string)
 * } url
 */
export function useFetch(url) {
    const data = ref(null)
    const error = ref(null)
    const isLoading = ref(false)

    watchEffect((onCleanup) => {  // onCleanup 是一個函式，用來註冊清理函數。
        // 必須在 watchEffect 的同步執行階段讀取。
        // Vue 才能追蹤 ref 或 getter 裡的響應式依賴。

        /*
        toValue(url) 會做這件事：
        - 如果 url 是普通字串，直接回傳字串。
        - 如果 url 是 ref，讀取它的.value。
        - 如果 url 是 getter，執行這個函式。
        */
        const resolvedUrl = toValue(url)

        // 每次 effect 執行都建立新的控制器。
        // AbortController 用來取消（Abort）一個正在進行中的非同步操作。
        const controller = new AbortController()

        // 下一次 effect 執行前，取消本次尚未完成的請求。
        // 避免快速切換可能發生競態條件（Race Condition）。
        onCleanup(() => {
            controller.abort()
        })

        data.value = null
        error.value = null
        isLoading.value = true

        fetch(resolvedUrl, {  // fetch 會返回一個 Promise。
            signal: controller.signal
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `請求失敗，HTTP 狀態碼：${response.status}`
                    )
                }

                return response.json()
            })
            .then((json) => {
                data.value = json
            })
            .catch((requestError) => {  // catch 會在請求失敗時執行。
                // URL 改變而主動取消的請求不視為真正錯誤。
                if (requestError.name === 'AbortError') {
                    return
                }

                error.value =
                    requestError instanceof Error
                        ? requestError
                        : new Error('發生未知錯誤')
            })
            .finally(() => {  // finally 會在 then 或 catch 之後執行，無論成功或失敗。
                // 只有未被取消的請求才結束載入狀態。
                // controller.signal.aborted 會回傳一個布林值，用來檢查請求是否被取消。
                if (!controller.signal.aborted) {
                    isLoading.value = false
                }
            })
    })

    return {
        data,
        error,
        isLoading
    }
}
