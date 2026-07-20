<script setup>
defineProps({
    name: String,
    price: Number,
    inStock: Boolean
})
</script>

<template>
    <article class="product-card">
        <h2>{{ name }}</h2>

        <p>價格：NT$ {{ price }}</p>

        <p v-if="inStock" class="available">
            商品有庫存
        </p>

        <p v-else class="unavailable">
            商品已售完
        </p>

        <button :disabled="!inStock">
            加入購物車
        </button>
    </article>
</template>

<style scoped>
.product-card {
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 10px;
}

.available {
    font-weight: bold;
}

.unavailable {
    opacity: 0.65;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
}
</style>