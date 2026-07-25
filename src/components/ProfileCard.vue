<script setup>
import { computed } from 'vue'

// 這個元件允許父元件傳入一個名為 name 的 Prop。
// 宣告之後，就可以直接在 Template 使用
// defineProps(['name'])
// 也可以同時傳入多個 Props，建議使用物件寫法
// 接收 Props 的兩種使用方式：
// 第一種：直接在 Template 使用
// 第二種：用變數接住 Props
const props = defineProps({
  'name': String,
  'job': String,
  'age': Number,
  'isOnline': Boolean
})

const introduction = computed(() => {
  return `${props.name} 今年 ${props.age} 歲`
})

console.log(props.name)
console.log(props.age)
</script>

<template>
  <article class="profile-card">
    <h2>{{ name }}</h2>

    <p>職業：{{ job }}</p>

    <p>年齡：{{ age }}</p>

    <p>
      狀態：
      {{ isOnline ? '在線' : '離線' }}
    </p>
  </article>
  <p>{{ introduction }}</p>
</template>

<style scoped>
.profile-card {
  width: 280px;
  padding: 20px;
  border: 1px solid #cccccc;
  border-radius: 10px;
}

.profile-card h2 {
  margin-top: 0;
}
</style>
