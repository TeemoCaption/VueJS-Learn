export async function getPost(id) {
    // 模擬 API 等待 1 秒
    await new Promise(resolve => {
        setTimeout(resolve, 1000)
    })

    // 模擬 API 回傳資料
    return {
        id,
        title: `文章 ${id}`,
        body: `這是第 ${id} 篇文章的內容。`
    }
}