<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

// 不讓透傳 Attributes 自動加到根元素
// 因為等等要自己決定要傳給 <a> 還是 <RouterLink>
defineOptions({
    inheritAttrs: false
})

// 繼承 RouterLink 原本所有 props
// 並額外增加 inactiveClass
const props = defineProps({
    // 繼承 RouterLink 的所有 props
    ...RouterLink.props,

    // 自訂：非啟用狀態時使用的 CSS class
    inactiveClass: String
})

// 判斷目前的 to 是不是外部網址
const isExternalLink = computed(() => {
    return (
        typeof props.to === 'string' &&
        // 檢查是否以 http 或 https 開頭
        props.to.startsWith('http')
    )
})
</script>

<template>
    <!--
    如果是外部網址：
    使用普通 <a>，而不是 RouterLink
  -->
    <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
        <slot />
    </a>

    <!--
    如果是 Vue Router 內部網址：
    使用 RouterLink
  -->
    <!--custom 是為了讓 RouterLink 可以自訂樣式-->
    <RouterLink v-else v-bind="$props" custom v-slot="{ isActive, href, navigate }">
        <a v-bind="$attrs" :href="href" @click="navigate" :class="isActive ? activeClass : inactiveClass">
            <slot />
        </a>
    </RouterLink>
</template>