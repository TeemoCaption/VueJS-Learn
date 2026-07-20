<template>
    <h1>第三小節-可寫入的 Computed</h1>
    <div>
        <h2>可寫入的 Computed</h2>

        <p>姓氏：{{ lastName }}</p>
        <p>名字：{{ firstName }}</p>
        <p>完整姓名：{{ fullName }}</p>

        <button @click="changeName">
            修改完整姓名
        </button>
    </div>
    <br>
    <div>
        <label>
            完整姓名：
            <!-- v-model 用來綁定資料，讓資料可以雙向同步 -->
            <input v-model="fullName">
        </label>
        <p>姓氏：{{ lastName }}</p>
        <p>名字：{{ firstName }}</p>
        <p>完整姓名：{{ fullName }}</p>
    </div>
    <br>
    <div>
        <h2>商品價格</h2>
        <label>
            顯示價格：
            <input v-model="formattedPrice">
        </label>

        <p>原始價格：{{ price }}</p>
        <p>格式化價格：{{ formattedPrice }}</p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const firstName = ref('ChenYen')
const lastName = ref('Yang')

const fullName = computed({
    // getter：別人向我要資料
    get() {
        return `${lastName.value} ${firstName.value}`
    },
    // setter：別人交給我一個新資料

    set(newValue) {
        // trim 用來移除字串前後的空白，split 用來分割字串(/\s+/ 使用一個或多個空白字元切割)
        const nameParts = newValue.trim().split(/\s+/)
        // 取出第一個元素作為姓氏，其餘元素組成名字
        lastName.value = nameParts[0] ?? ''
        // 將其餘元素用空格連接起來
        firstName.value = nameParts.slice(1).join(' ')
    }
})

// 常見錯誤：
// 1：在 Setter 中修改自己，例如：`fullName.value = newValue`
// 2：並不是看到 computed 就要寫 get 和 set。

function changeName() {
    fullName.value = 'Wang XiaoMing'
}

const price = ref(500)

const formattedPrice = computed({
    get() {
        return `$${price.value}`
    },

    set(newValue) {
        const numericValue = Number(
            // replace 用來替換字串中的內容，這裡是把 $ 符號移除
            newValue.replace('$', '')
        )

        // 如果數字不是 NaN，才更新價格
        if (!Number.isNaN(numericValue)) {
            price.value = numericValue
        }
    }
})
</script>
<style scoped></style>