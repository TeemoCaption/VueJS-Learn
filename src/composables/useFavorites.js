import {
    ref,
    computed,
    watch,
    toValue
} from 'vue'

/**
 * 管理文章收藏狀態。
 *
 * @param {
 *   number |
 *   import('vue').Ref<number> |
 *   (() => number)
 * } currentPostId
 */
export function useFavorites(currentPostId) {
    const storageKey = 'favorite-posts'

    // 儲存收藏文章編號。
    const favorites = ref([])

    /**
     * 從 localStorage 讀取收藏資料。
     */
    function loadFavorites() {
        const savedValue =
            localStorage.getItem(storageKey)

        if (!savedValue) {
            favorites.value = []
            return
        }

        try {
            const parsedValue = JSON.parse(savedValue)

            // 確認解析結果是陣列，
            // 避免 localStorage 中的錯誤內容破壞程式。
            favorites.value = Array.isArray(parsedValue)
                ? parsedValue
                : []
        } catch {
            favorites.value = []
        }
    }

    /**
     * 儲存收藏資料。
     */
    function saveFavorites() {
        localStorage.setItem(
            storageKey,
            JSON.stringify(favorites.value)
        )
    }

    // 建立 composable 時先讀取一次。
    loadFavorites()

    // 收藏清單改變時，自動儲存。
    watch(
        favorites,
        () => {
            saveFavorites()
        },
        {
            deep: true
        }
    )

    // 判斷目前文章是否已收藏。
    const isFavorite = computed(() => {
        const resolvedPostId = toValue(currentPostId)

        return favorites.value.includes(resolvedPostId)
    })

    /**
     * 切換目前文章的收藏狀態。
     */
    function toggleFavorite() {
        const resolvedPostId = toValue(currentPostId)

        if (favorites.value.includes(resolvedPostId)) {
            favorites.value = favorites.value.filter(
                (id) => id !== resolvedPostId
            )

            return
        }

        favorites.value.push(resolvedPostId)
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite
    }
}