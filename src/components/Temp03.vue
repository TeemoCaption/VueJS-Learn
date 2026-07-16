<template>
    <h1>第三小節-響應式狀態</h1>
    <main>
        <h1>使用者資料</h1>

        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>

        <button @click="changeName">
            修改姓名
        </button>

        <button @click="increaseAge">
            年齡加一
        </button>
        <p>第二位使用者：{{ user02.name }}</p>
    </main>
    <main>
        <!-- reactive() 也可以處理陣列-->
        <h1>水果清單</h1>

        <p>{{ fruits }}</p>

        <button @click="addFruit">
            新增水果
        </button>

        <button @click="removeFruit">
            移除水果
        </button>
        <button @click="changeFirstFruit">
            修改第一個水果
        </button>
    </main>
    <main>
        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
        <p>城市：{{ user.city }}</p>

        <button @click="replaceUserData">
            更新資料
        </button>
    </main>
    <main>
        <p>姓名：{{ name }}</p>
        <p>年齡：{{ age }}</p>
        <button @click="changeName02">
            修改姓名
        </button>
        <button @click="increaseAge02">
            年齡加一
        </button>
    </main>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue'

// 宣告響應式狀態(如果資料屬於同一個使用者物件)，與 ref 的差別是
// reactive 本身就是 Vue 回傳的響應式 Proxy 物件，Proxy 會知道有人讀取了 name
// 只能接收物件類型，例如：普通物件陣列MapSet
// 注意，不要直接替換整個 reactive() 物件
const user = reactive({
    name: 'Alice',
    age: 20
})

function increaseAge() {
    user.age++
}

function changeName() {
    user.name = 'Bob'
}

// 原始物件
const rawUser = {
    name: 'Alice'
}

// 修改後，仍然可被 proxy 追蹤
const user02 = reactive(rawUser)

// 會輸出 false，原因是：rawUser 是原始物件，user02 是 Proxy 代理物件
console.log(user02 === rawUser)

// 一次更新多個屬性
function replaceUserData() {
    // Object.assign() 修改的是原本的 Proxy 物件，因此可以維持響應性。
    Object.assign(user, {
        name: 'Bob',
        age: 30,
        city: '高雄'
    })
}

// 解構 reactive() 可能失去響應性
const user03 = reactive({
    name: 'Alice',
    age: 20
})
// 解構後，這時只是 name、age 普通區域變數。
// 如果執行：name = 'Bob'，並不等於：user.name = 'Bob'，因為解構後，基本型別值已經被複製出來。
// let { name, age } = user03

// 解構正確做法一：直接使用物件屬性
function changeName02() {
    user03.name = 'Bob'
}

// 解構正確做法二：使用 toRefs()
const { name, age } = toRefs(user03)

function increaseAge02() {
    age.value++
}

// reactive() 也可以處理陣列
const fruits = reactive([
    'Apple',
    'Banana'
])

function addFruit() {
    // 不需要：fruits.value.push('Orange')
    // 因為 fruits 是 reactive() 回傳的響應式陣列。
    fruits.push('Orange')
}

function removeFruit() {
    fruits.pop()
}

function changeFirstFruit() {
    fruits[0] = 'Mango'
}
</script>

<style scoped></style>