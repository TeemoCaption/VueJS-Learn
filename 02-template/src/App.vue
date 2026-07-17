<script setup>
// 第一小節-Attribute Binding
import temp01 from './components/Temp01.vue'
import example01 from './components/Example01.vue'
// 第二小節-Directive
import temp02 from './components/Temp02.vue'
import example02 from './components/Example02.vue';
// 第三小節-響應式狀態
import temp03 from './components/Temp03.vue';
import example03 from './components/Example03.vue';
// 第四小節-DOM 更新時機與 nextTick()
import temp04 from './components/Temp04.vue';
import example04 from './components/Example04.vue';
</script>

<template>
  <temp01 />
  <hr>
  <example01 />
  <hr>
  <temp02 />
  <hr>
  <example02 />
  <hr>
  <temp03 />
  <main>
    <example03 />
  </main>
  <hr>
  <temp04 />
  <hr>
  <example04 />
</template>

<style scoped></style>
