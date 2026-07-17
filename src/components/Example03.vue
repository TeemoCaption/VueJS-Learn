<template>
    <h1>第三小節-響應式狀態練習</h1>
    <section class="profile">
        <h2>使用者資料</h2>

        <p>
            姓名：{{ user.name }}
        </p>

        <p>
            年齡：{{ user.age }}
        </p>

        <p>
            電子信箱：{{ user.email }}
        </p>

        <p>
            地址：{{ user.address.city }} {{ user.address.district }}
        </p>

        <div class="actions">
            <button @click="changeName">
                修改姓名
            </button>

            <button @click="increaseAge">
                年齡加一
            </button>

            <button @click="moveToKaohsiung">
                搬到高雄
            </button>

            <button @click="resetUser">
                重設資料
            </button>
        </div>
    </section>
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
    name: 'Alice',
    age: 20,
    email: 'alice@example.com',
    address: {
        city: '台北',
        district: '中正區'
    }
})

function increaseAge() {
    user.age++
}

function changeName() {
    user.name = 'Bob'
}

function moveToKaohsiung() {
    user.address.city = '高雄'
    user.address.district = '苓雅區'
}

function resetUser() {
    // Object.assign() 修改的是原本的 Proxy 物件，因此可以維持響應性。
    Object.assign(user, {
        name: 'Alice',
        age: 20,
        email: 'alice@example.com'
    })

    Object.assign(user.address, {
        city: '台北',
        district: '中正區'
    })
}
</script>

<style scoped>
.profile {
    max-width: 500px;
    margin: 40px auto;
    padding: 24px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}
</style>