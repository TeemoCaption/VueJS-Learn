<script setup>
import { computed } from 'vue'
import {
    RouterLink,
    useLink
} from 'vue-router'

// 接收 RouterLink 本身支援的 props
// 例如：to、replace 等
const props = defineProps({
    ...RouterLink.props,

    // 額外加入自己的設定
    inactiveClass: {
        type: String,
        default: 'inactive'
    }
})

// useLink() 會根據傳進來的 props
// 建立與 RouterLink 相同的路由連結邏輯
const {
    // 解析完成的目標路由
    route,

    // 連結真正對應的 href
    href,

    // 是否與目前路由匹配
    isActive,

    // 是否與目前路由完全匹配
    isExactActive,

    // 執行導航的函式
    navigate
} = useLink(props)

// 根據是否為目前路由決定 CSS class
const linkClass = computed(() => {
    return isActive.value
        ? 'active'
        : props.inactiveClass
})
</script>

<template>
    <!--
    href：
    讓瀏覽器知道真正的連結位置

    navigate：
    交給 Vue Router 執行 SPA 導航
  -->
    <a :href="href" :class="linkClass" @click="navigate">
        <!-- 顯示父元件傳進來的文字 -->
        <slot />

        <!-- 完全符合目前路由時顯示 -->
        <span v-if="isExactActive">
            （目前頁面）
        </span>
    </a>

    <!--
    route 是解析完成的目標路由資訊
    這裡只是為了方便學習觀察
  -->
    <small>
        目標路徑：{{ route.path }}
    </small>
</template>

<style scoped>
a {
    display: inline-block;
    margin-right: 16px;
    text-decoration: none;
}

.active {
    font-weight: bold;
    text-decoration: underline;
}

.inactive {
    opacity: 0.6;
}

small {
    display: block;
    margin-bottom: 12px;
}
</style>