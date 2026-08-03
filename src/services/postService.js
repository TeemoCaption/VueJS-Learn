/**
 * 根據文章編號取得文章。
 *
 * 此檔案只負責 API 請求，
 * 不依賴 Vue 的 ref 或 watchEffect。
 */
export async function getPostById(
    postId,
    signal
) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            signal
        }
    )

    if (!response.ok) {
        throw new Error(
            `文章載入失敗：${response.status}`
        )
    }

    return response.json()
}