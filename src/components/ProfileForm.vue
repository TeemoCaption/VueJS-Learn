<script setup>
const name = defineModel('name', {
    type: String,
    required: true
})

const email = defineModel('email', {
    type: String,
    required: true
})

const age = defineModel('age', {
    type: Number,
    required: true
})

function increaseAge() {
    age.value++
}
</script>

<template>
    <section class="profile-form">
        <div class="input-group">
            <label for="name">
                姓名
            </label>

            <input id="name" v-model="name" type="text" />
        </div>

        <div class="input-group">
            <label for="email">
                電子信箱
            </label>

            <input id="email" v-model="email" type="email" />
        </div>

        <div class="input-group">
            <label for="age">
                年齡
            </label>

            <input id="age" v-model.number="age" type="number" />
        </div>

        <button type="button" @click="increaseAge">
            年齡增加一歲
        </button>
    </section>
</template>

<style scoped>
.profile-form {
    display: grid;
    gap: 16px;
}

.input-group {
    display: grid;
    gap: 6px;
}

input {
    padding: 10px;
}

button {
    width: fit-content;
    padding: 10px 16px;
    cursor: pointer;
}
</style>