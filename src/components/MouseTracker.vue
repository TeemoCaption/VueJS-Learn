<script setup>
import { ref } from 'vue'

// 記錄滑鼠相對於追蹤區域左上角的 X 座標。
const x = ref(0)

// 記錄滑鼠相對於追蹤區域左上角的 Y 座標。
const y = ref(0)

// 記錄滑鼠是否目前位於追蹤區域中。
const isInside = ref(false)

/**
 * 當滑鼠在追蹤區域中移動時執行。
 *
 * @param {MouseEvent} event 瀏覽器提供的滑鼠事件物件
 */
function handleMouseMove(event) {
    /*
      currentTarget 代表綁定 @mousemove 的元素。
  
      getBoundingClientRect() 可以取得該元素：
      - 距離瀏覽器左側的位置
      - 距離瀏覽器頂部的位置
      - 寬度
      - 高度
    */
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    /*
      event.clientX 是滑鼠相對於瀏覽器視窗左側的位置。
  
      減掉 rect.left 後，
      就能得到滑鼠相對於追蹤區域左側的位置。
    */
    x.value = Math.round(event.clientX - rect.left)

    /*
      event.clientY 是滑鼠相對於瀏覽器視窗頂部的位置。
  
      減掉 rect.top 後，
      就能得到滑鼠相對於追蹤區域頂部的位置。
    */
    y.value = Math.round(event.clientY - rect.top)
}

/**
 * 滑鼠進入追蹤區域時執行。
 */
function handleMouseEnter() {
    isInside.value = true
}

/**
 * 滑鼠離開追蹤區域時執行。
 */
function handleMouseLeave() {
    isInside.value = false
}
</script>

<template>
    <!--
    這個 div 是事件監聽範圍。

    MouseTracker 不決定裡面要顯示什麼，
    真正的畫面會由父元件透過插槽提供。
  -->
    <div class="mouse-tracker" @mousemove="handleMouseMove" @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!--
      將 MouseTracker 內部的資料
      透過 Slot Props 傳給父元件。

      父元件可以取得：
      - x：滑鼠 X 座標
      - y：滑鼠 Y 座標
      - isInside：滑鼠是否在區域內
    -->
        <slot :x="x" :y="y" :is-inside="isInside" />
    </div>
</template>

<style scoped>
/*
  MouseTracker 只設定追蹤範圍必要的基本尺寸。

  真正的視覺內容仍然由父元件的插槽決定。
*/
.mouse-tracker {
    position: relative;

    width: 100%;
    min-height: 360px;
}
</style>