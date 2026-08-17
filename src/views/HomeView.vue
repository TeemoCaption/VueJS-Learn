<template>
  <main>
    <div class="space">
      上方其他內容
    </div>

    <!-- Router 要捲動到的目標 -->
    <section id="main">
      <h1>主要內容</h1>
      <p>這裡是主要內容。</p>
    </section>
  </main>
</template>

<style scoped>
.space {
  height: 1000px;
}

#main {
  /* 定義這個元素需要的滾動偏移距離 */
  scroll-margin-top: 80px;
}
</style>