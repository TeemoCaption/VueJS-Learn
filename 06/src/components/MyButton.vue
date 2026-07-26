<template>
    <!-- Vue 永遠把透傳 Attribute 放到「根元素（Root Element）」上。 -->
    <div class="wrapper">
        <!-- 這裡 v-bind="$attrs" 會把所有透傳的 Attribute 都綁定到 button 上 -->
        <!-- 這是官方推薦做法，這樣就可以自己指定要綁定到哪個元素 -->
        <button class="btn" style="font-size:20px" v-bind="$attrs">
            {{ title }}
        </button>
    </div>
</template>

<script setup>
// 如果某個屬性已經被宣告成 props，它就不屬於透傳 Attribute。
defineProps({
    title: String
})

// 關閉自動繼承（Attribute 不會自動繼承到根元素）
// 那 Attribute 去哪了？沒有消失！Vue 幫我們放到一個特殊物件：$attrs
// 它裡面包含所有沒有被 Props 接收的 Attribute，例如父元件。
// $attrs 就是一個收集所有透傳 Attributes 的物件。
defineOptions({
    inheritAttrs: false
})
</script>

<style scoped></style>