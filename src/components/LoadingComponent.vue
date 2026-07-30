<script setup>

</script>

<template>
    <div class="loading-box">
        <div class="spinner"></div>

        <div>
            <h2>正在載入使用者資料</h2>
            <p>請稍候，元件正在下載中……</p>
        </div>
    </div>
</template>

<style scoped>
.loading-box {
    display: flex;
    gap: 16px;
    align-items: center;
    max-width: 520px;
    margin-top: 20px;
    padding: 24px;
    border: 2px dashed #409eff;
    border-radius: 14px;
    background-color: #f2f8ff;
}

.loading-box h2 {
    margin: 0 0 8px;
    color: #337ecc;
}

.loading-box p {
    margin: 0;
    color: #666;
}

.spinner {
    width: 38px;
    height: 38px;
    border: 5px solid #d9ecff;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>