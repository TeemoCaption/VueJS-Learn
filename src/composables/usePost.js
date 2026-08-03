import {
    ref,
    watchEffect,
    toValue
} from 'vue'

import {
    getPostById
} from '../services/postService.js'

export function usePost(postId) {
    const post = ref(null)
    const error = ref(null)
    const isLoading = ref(false)

    watchEffect((onCleanup) => {
        const resolvedPostId = toValue(postId)

        const controller = new AbortController()

        onCleanup(() => {
            controller.abort()
        })

        post.value = null
        error.value = null
        isLoading.value = true

        getPostById(
            resolvedPostId,
            controller.signal
        )
            .then((result) => {
                post.value = result
            })
            .catch((requestError) => {
                if (requestError.name === 'AbortError') {
                    return
                }

                error.value =
                    requestError instanceof Error
                        ? requestError
                        : new Error('發生未知錯誤')
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    isLoading.value = false
                }
            })
    })

    return {
        post,
        error,
        isLoading
    }
}