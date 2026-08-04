<script setup>
import { computed, ref } from 'vue'

const username = ref('')
const showInput = ref(true)

const highlightColor = ref('lightyellow')
const textColor = ref('green')
const fontSize = ref('20px')

// 根據輸入長度決定提示背景顏色
const messageColor = computed(() => {
  return username.value.length >= 3
    ? 'lightgreen'
    : 'lightyellow'
})

// 自動聚焦指令
const vFocus = {
  mounted(el) {
    el.focus()
  }
}

// 觀察指令生命週期
const vTrack = {
  created(el) {
    console.log('1. created：元素已建立', el)
  },

  beforeMount(el) {
    console.log('2. beforeMount：元素即將掛載', el)
  },

  mounted(el) {
    console.log('3. mounted：元素已掛載', el)
  },

  beforeUpdate(el) {
    console.log('4. beforeUpdate：元素即將更新', el)
  },

  updated(el) {
    console.log('5. updated：元素已更新', el)
  },

  beforeUnmount(el) {
    console.log('6. beforeUnmount：元素即將卸載', el)
  },

  unmounted(el) {
    console.log('7. unmounted：元素已卸載', el)
  }
}

// 套用高亮樣式
function applyHighlight(el, binding) {
  // 根據參數決定修改背景色或文字色
  if (binding.arg === 'background') {
    el.style.backgroundColor = binding.value
  }

  if (binding.arg === 'text') {
    el.style.color = binding.value
  }

  // 根據修飾符套用粗體
  el.style.fontWeight = binding.modifiers.bold
    ? 'bold'
    : 'normal'

  // 根據修飾符套用斜體
  el.style.fontStyle = binding.modifiers.italic
    ? 'italic'
    : 'normal'
}

// 高亮指令
// 使用自訂指令函式簡寫。
// 此函式會在 mounted 與 updated 時執行。
const vHighlight = (el, binding) => {
  if (binding.arg === 'background') {
    el.style.backgroundColor = binding.value
  }

  if (binding.arg === 'text') {
    el.style.color = binding.value
  }

  if (binding.modifiers.bold) {
    el.style.fontWeight = 'bold'
  }

  if (binding.modifiers.italic) {
    el.style.fontStyle = 'italic'
  }
}

// 自訂樣式指令
const vStyle = {
  mounted(el, binding) {
    el.style[binding.arg] = binding.value
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.style[binding.arg] = binding.value
    }
  }
}
</script>

<template>
  <main class="container">
    <h1>會員資料</h1>

    <!-- 全域自訂指令 v-focus。 -->
    <input v-focus type="text" placeholder="請輸入姓名" />

    <!-- 全域自訂指令 v-highlight。 -->
    <p v-highlight:background.bold.italic="highlightColor">
      這段文字有背景色、粗體與斜體。
    </p>

    <p v-highlight:text.bold="textColor">
      這段文字有文字顏色與粗體。
    </p>

    <button @click="highlightColor = 'lightgreen'">
      背景改成綠色
    </button>

    <button @click="textColor = 'blue'">
      文字改成藍色
    </button>
  </main>
</template>

<style scoped>
.container {
  width: 420px;
  margin: 60px auto;
}

input {
  width: 100%;
  box-sizing: border-box;
  margin: 16px 0;
  padding: 8px;
}

p {
  padding: 12px;
}

button {
  margin-right: 8px;
  padding: 8px 12px;
}

.controls {
  margin-top: 20px;
}
</style>