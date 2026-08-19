<script setup>
import { ref } from 'vue'

import {
  useRouter,
  isNavigationFailure,
  NavigationFailureType
} from 'vue-router'

const router = useRouter()

// 顯示導航結果
const message = ref('')

// 顯示失敗導航的來源位置
const fromPath = ref('')

// 顯示失敗導航的目標位置
const toPath = ref('')

// 嘗試前往 Admin
async function goToAdmin() {
  // 清空上一次結果
  message.value = ''
  fromPath.value = ''
  toPath.value = ''

  // 嘗試導航到 /admin
  const failure =
    await router.push('/admin')

  // 判斷是不是 aborted 類型
  if (
    isNavigationFailure(
      failure,
      NavigationFailureType.aborted
    )
  ) {
    message.value =
      '導航被中止：目前沒有 Admin 權限。'

    // failure.from：
    // 這次失敗導航的起始位置
    fromPath.value =
      failure.from.path

    // failure.to：
    // 這次失敗導航原本要去的位置
    toPath.value =
      failure.to.path

    return
  }

  message.value = '導航成功。'
}
</script>

<template>
  <main>
    <h1>首頁</h1>

    <button @click="goToAdmin">
      前往 Admin
    </button>

    <p v-if="message">
      {{ message }}
    </p>

    <div v-if="fromPath && toPath">
      <p>
        原本位置：
        {{ fromPath }}
      </p>

      <p>
        目標位置：
        {{ toPath }}
      </p>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}

button {
  margin-bottom: 12px;
}
</style>