<script setup>
const firstName = "Alice"
const lastName = "Chen"
const score = 90

function hello() {
  return "Hello Vue!"
}
// 可以存取物件
const user = {
  name: "Alice",
  age: 20
}
// 可以存取陣列
const fruits = [
  "Apple",
  "Banana",
  "Orange"
]

const name = '小明'
const message = '<strong>{{ name }}</strong>'
const imageUrl = '/images/cat.jpg'
const userId = 25
const isLoggedIn = true

const filename = 'avatar.png'
// 回傳圖片路徑
function getImagePath(name) {
  return `/images/${name}`
}

const elementTitle = null
const isDisabled = true
const isRequired = true
const isReadOnly = false

</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <!-- 這邊的 firstName 和 lastName 是在 script 中定義的變數 -->
  {{ firstName + " " + lastName }}
  <br>
  <!-- 呼叫 hello() -->
  {{ hello() }}
  <br>
  <!-- 可以用三元運算子 -->
  {{ score >= 60 ? "及格" : "不及格" }}
  <br>
  <!-- 可以存取物件的屬性 -->
  {{ user.name }}
  <br>
  <!-- 可以存取陣列的元素 -->
  {{ fruits[0] }}
  <br>
  <!-- v-html 會將字串當作 HTML 解析 -->
  <p v-html="message"></p>
  <br>
  <!-- v-bind 可以綁定屬性 -->
  <img :src="imageUrl" alt="cat">
  <br>
  <!-- v-bind 也可以綁定 href -->
  <a :href="'/users/' + userId">
    查看使用者
  </a>
  <br>
  <!-- 也可以用字串模板 -->
  <a :href="`/users/${userId}`">
    查看使用者
  </a>

  <br>
  <!-- 也可以用條件判斷 -->
  <a :href="isLoggedIn ? '/profile' : '/login'">
    個人頁面
  </a>
  <br>
  <!-- 也可以用函數 -->
  <img :src="getImagePath(filename)" alt="avatar">
  <!-- 也可以用條件判斷 -->
  <div :title="elementTitle">
    把滑鼠移到這裡
  </div>
  <!-- 布林屬性 -->
  <button :disabled="isDisabled">
    按鈕
  </button>
  <br>
  <input
    type="text"
    :required="isRequired"
    :readonly="isReadOnly"
  >
</template>

<style scoped></style>
