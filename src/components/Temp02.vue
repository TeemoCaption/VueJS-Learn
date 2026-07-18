<template>
    <h1>第二小節-列表渲染</h1>
    <ul>
        <!-- v-for 渲染陣列，in 也可以改成 of -->
        <li v-for="student in students">
            {{ student }}
        </li>
    </ul>
    <br>
    <!-- 渲染物件陣列，key 用來幫助 Vue 追蹤每個元素的唯一性 -->
    <template v-for="product in products" :key="product.id">
        <h2>{{ product.name }}</h2>
        <p>價格：NT$ {{ product.price }}</p>
    </template>
    <br>
    <ul>
        <!-- 取得陣列索引 index，v-for 可以接受兩個參數，第一個是元素，第二個是索引 -->
        <!-- index 從 1 開始 -->
        <li v-for="(student, index) in students">
            {{ index + 1 }}：{{ student }}
            <button @click="removeStudent(index)">刪除</button>
        </li>
    </ul>
    <br>
    <!--巢狀 v-for -->
    <section v-for="classroom in classes" :key="classroom.id">
        <h2>{{ classroom.name }}</h2>

        <ul>
            <li v-for="student in classroom.students" :key="student">
                {{ student }}
            </li>
        </ul>
    </section>
    <br>
    <!-- v-for 也可以直接接收整數。 -->
    <span v-for="number in 5">
        {{ number }}
    </span>

</template>

<script setup>
import { ref } from 'vue'

const students = ref([
    '小明',
    '小美',
    '小華'
])

const products = ref([
    {
        id: 1,
        name: '鍵盤',
        price: 1200
    },
    {
        id: 2,
        name: '滑鼠',
        price: 800
    },
    {
        id: 3,
        name: '螢幕',
        price: 6500
    }
])

const classes = ref([
    {
        id: 1,
        name: '甲班',
        students: ['小明', '小美']
    },
    {
        id: 2,
        name: '乙班',
        students: ['小華', '小安']
    }
])

function removeStudent(index) {
    // 刪除指定索引的元素
    students.value.splice(index, 1)
}
</script>

<style scoped></style>