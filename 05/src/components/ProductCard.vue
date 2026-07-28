<script setup>
// prop 用來接收父組件傳遞的數據，可定義數據類型、是否必填等
const props = defineProps({
    product: {
        type: Object,
        required: true // 必填
    }
})

// defineEmits 用來定義組件可以觸發的事件，可定義多個事件
const emit = defineEmits([
    'add-product',      // 加入購物車
    'toggle-favorite',  // 切換收藏狀態
    'delete-product',   // 刪除商品
])

// 可一次傳遞多個參數
function addToCart() {
    emit(
        'add-product',
        props.product,
        //props.name,
        //props.price,
        //props.inStock,
    )
}

// 切換收藏狀態
function toggleFavorite() {
    emit('toggle-favorite', props.product)
}

// 刪除商品
function deleteProduct() {
    emit('delete-product', props.product)
}
</script>

<template>
    <article class="product-card">
        <h2>{{ product.name }}</h2>

        <p>價格：NT$ {{ product.price }}</p>

        <p v-if="product.inStock" class="available">
            商品有庫存
        </p>

        <p v-else class="unavailable">
            商品已售完
        </p>

        <button :disabled="!product.inStock" @click="addToCart">
            加入購物車
        </button>
        <button @click="toggleFavorite">
            收藏
        </button>

        <button @click="deleteProduct">
            刪除
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