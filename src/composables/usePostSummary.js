import {
    computed,
    toValue
} from 'vue'

/**
 * 根據文章資料產生摘要。
 *
 * @param {
 *   object |
 *   import('vue').Ref<object | null> |
 *   (() => object | null)
 * } postSource
 *
 * @param {number} maximumLength
 */
export function usePostSummary(
    postSource,
    maximumLength = 60
) {
    const summary = computed(() => {
        const post = toValue(postSource)

        if (!post?.body) {
            return ''
        }

        if (post.body.length <= maximumLength) {
            return post.body
        }

        return `${post.body.slice(0, maximumLength)}…`
    })

    const characterCount = computed(() => {
        const post = toValue(postSource)

        return post?.body?.length ?? 0
    })

    return {
        summary,
        characterCount
    }
}