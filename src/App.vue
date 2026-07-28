<script setup>
import MyButton from './components/MyButton.vue'
import MyLayout from './components/MyLayout.vue'
import BaseInput from './components/BaseInput.vue'

// 事件也會透傳
function clickButton() {
  console.log('按鈕被點擊')
}

function handleFocus() {
  console.log('輸入框取得焦點')
}
</script>

<template>
  <!-- 透傳屬性：根本沒有寫 class 和 id，但 Vue 自己幫我加上去了。幾乎所有一般 HTML 屬性都可以透傳
；class 和 style 也會透傳，不是覆蓋，而是合併! -->
  <MyButton @click="clickButton" class="red" id="loginBtn" title="登入" style="color:red" />
  <br>
  <MyLayout class="red" id="layout" />
  <br>
  <BaseInput @focus="handleFocus" disabled label="帳號" id="username" type="text" placeholder="請輸入帳號" />
  <BaseInput label="密碼" id="password" type="password" placeholder="請輸入密碼" minlength="8" />
</template>

<style scoped>
.form-input {
  padding: 8px 12px;
  border: 1px solid #999;
  border-radius: 6px;
}
</style>
