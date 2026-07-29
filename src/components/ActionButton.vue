<script setup>
defineProps({
    type: {
        type: String,
        default: 'button'
    },

    disabled: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <button class="action-button" :type="type" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<style scoped>
.action-button {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background-color: #42b883;
    color: white;
    cursor: pointer;
}

.action-button:disabled {
    background-color: #b8c2cc;
    cursor: not-allowed;
}
</style>