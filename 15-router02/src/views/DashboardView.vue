<!-- src/views/DashboardView.vue -->

<script setup>
// 從 Vue 匯入 ref
// 用來建立響應式資料
import { ref } from 'vue'

// 從 Vue Router 匯入 Composition API 版本的導航守衛
import {
    onBeforeRouteUpdate,
    onBeforeRouteLeave
} from 'vue-router'

/*
  使用者正在編輯的個人簡介。

  ref() 建立響應式資料。
*/
const profileText = ref('')

/*
  紀錄是否存在尚未儲存的修改。

  false
  → 沒有未儲存資料

  true
  → 有資料還沒儲存
*/
const hasUnsavedChanges = ref(false)

/*
  當輸入框內容發生變化時執行。
*/
function handleInput() {
    // 標記目前存在尚未儲存的修改
    hasUnsavedChanges.value = true
}

/*
  模擬儲存資料。
*/
function saveProfile() {
    /*
      真實專案可能會在這裡：
  
      await axios.put(...)
      await fetch(...)
      呼叫後端 API
  
      現在先單純模擬儲存成功。
    */

    // 儲存完成，所以不再有未儲存修改
    hasUnsavedChanges.value = false

    alert('資料已儲存')
}

/*
  onBeforeRouteUpdate

  當目前 Route 發生改變，
  但是 DashboardView 元件仍然被重複使用時執行。

  例如：
  /users/1
  →
  /users/2

  元件沒有被重新建立，
  但是 Route 資訊發生改變。
*/
onBeforeRouteUpdate((to, from) => {
    console.log('Dashboard Route 更新')

    console.log('原本：', from.fullPath)

    console.log('新的：', to.fullPath)
})

/*
  onBeforeRouteLeave

  當使用者準備離開 Dashboard 時執行。

  如果資料尚未儲存，
  就詢問使用者是否確定離開。
*/
onBeforeRouteLeave((to, from) => {
    /*
      如果沒有尚未儲存的修改，
      就直接允許導航繼續。
    */
    if (!hasUnsavedChanges.value) {
        return
    }

    /*
      如果有尚未儲存的修改，
      跳出瀏覽器確認視窗。
    */
    const answer = window.confirm(
        '資料尚未儲存，確定要離開嗎？'
    )

    /*
      如果使用者選擇取消：
  
      answer === false
  
      return false
      → 取消這次導航
      → 留在 Dashboard
    */
    if (!answer) {
        return false
    }

    /*
      如果使用者按下確定，
      沒有回傳 false，
      導航就會繼續。
    */
})
</script>

<template>
    <div>
        <h2>會員中心</h2>

        <p>
            如果你看到這個畫面，代表你已經通過導覽守衛。
        </p>

        <hr />

        <h3>編輯個人資料</h3>

        <!--
      v-model 綁定 profileText。

      在 template 裡使用 ref 時，
      Vue 會自動解包，所以不用寫 profileText.value。

      @input 代表每當輸入內容改變，
      就執行 handleInput()。
    -->
        <textarea v-model="profileText" @input="handleInput" placeholder="請輸入個人簡介"></textarea>

        <br />

        <!-- 儲存目前修改 -->
        <button @click="saveProfile">
            儲存資料
        </button>

        <!--
      如果有尚未儲存的修改，
      顯示提示文字。
    -->
        <p v-if="hasUnsavedChanges">
            目前有尚未儲存的修改
        </p>
    </div>
</template>

<style scoped>
h2 {
    margin-bottom: 10px;
}

textarea {
    width: 300px;
    height: 100px;
    margin-bottom: 10px;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}
</style>