<script setup>
// 這個元件接收一個 user 物件。
// 即使外層是非同步元件，props 仍然可以正常傳入。

defineProps({
    user: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="card">
        <h2>使用者資訊</h2>

        <p>姓名：小明</p>

        <p>部門：資訊部</p>
    </div>
    <div>
        <article class="user-card">
            <div class="avatar">
                {{ user.name.charAt(0) }}
            </div>

            <div class="user-info">
                <h2>{{ user.name }}</h2>

                <p>
                    <strong>職位：</strong>
                    {{ user.job }}
                </p>

                <p>
                    <strong>部門：</strong>
                    {{ user.department }}
                </p>

                <p>
                    <strong>電子郵件：</strong>
                    {{ user.email }}
                </p>
            </div>
        </article>
    </div>
</template>

<style scoped>
.card {
    border: 2px solid #42b883;
    padding: 20px;
    border-radius: 10px;
}

.user-card {
    display: flex;
    gap: 20px;
    align-items: center;
    max-width: 520px;
    margin-top: 20px;
    padding: 24px;
    border: 2px solid #42b883;
    border-radius: 14px;
    background-color: #f4fff9;
}

.avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #42b883;
    color: white;
    font-size: 32px;
    font-weight: bold;
}

.user-info h2 {
    margin: 0 0 12px;
}

.user-info p {
    margin: 7px 0;
}
</style>