<script setup>
import DeepChild from './DeepChild.vue'
</script>

<template>
    <section class="middle">
        <h3>MiddleLayer：不參與資料傳遞</h3>

        <DeepChild />
    </section>
</template>

<style scoped>
.middle {
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #409eff;
    border-radius: 10px;
}
</style>