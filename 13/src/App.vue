<script setup>
import { ref } from 'vue'

// 控制卡片是否顯示
const showMessage = ref(true)

function toggleMessage() {
  showMessage.value = !showMessage.value
}
</script>

<template>
  <main class="container">
    <h1>深層級 Transition</h1>

    <button @click="toggleMessage">
      {{ showMessage ? '隱藏訊息' : '顯示訊息' }}
    </button>

    <!--
      總時間：
      延遲 250ms + 動畫 300ms = 550ms
    -->
    <Transition name="nested" :duration="{ enter: 550, leave: 300 }">
      <section v-if="showMessage" class="outer">
        <div class="inner">
          Hello
        </div>
      </section>
    </Transition>
  </main>
</template>

<style scoped>
.container {
  width: min(600px, 90%);
  margin: 60px auto;
  text-align: center;
}

button {
  margin-bottom: 24px;
  padding: 10px 20px;
  cursor: pointer;
}

.outer {
  padding: 20px;
  border-radius: 12px;
  background-color: #eeeeee;
}

.inner {
  padding: 24px;
  border-radius: 10px;
  background-color: #ffffff;
}

/*
  Transition class 在 outer 上，
  但透過後代選擇器控制 inner。
*/
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/*
  進入時延遲 0.25 秒，
  製造稍晚出現的效果。
*/
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

/*
  進入起點與離開終點。
*/
.nested-enter-from .inner,
.nested-leave-to .inner {
  opacity: 0;
  transform: translateX(30px);
}
</style>