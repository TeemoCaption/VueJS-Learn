<script setup>
import MyButton from './components/MyButton.vue'

// 事件也會透傳
function clickButton() {
  console.log('按鈕被點擊')
}
</script>

<template>
  <!-- 透傳屬性：根本沒有寫 class 和 id，但 Vue 自己幫我加上去了。幾乎所有一般 HTML 屬性都可以透傳
；class 和 style 也會透傳，不是覆蓋，而是合併! -->
  <MyButton @click="clickButton" class="red" id="loginBtn" title="登入" style="color:red" />

</template>

<style scoped></style>
