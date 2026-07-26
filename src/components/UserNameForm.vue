<script setup>
const firstName = defineModel('firstName', {
    type: String,
    required: true
})

const lastName = defineModel('lastName', {
    type: String,
    required: true
})
</script>

<template>
    <div class="name-form">
        <div class="input-group">
            <label for="first-name">
                名字
            </label>

            <input id="first-name" v-model="firstName" type="text" />
        </div>

        <div class="input-group">
            <label for="last-name">
                姓氏
            </label>

            <input id="last-name" v-model="lastName" type="text" />
        </div>
    </div>
</template>

<style scoped>
.name-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.input-group {
    display: grid;
    gap: 8px;
}

input {
    padding: 10px;
}
</style>