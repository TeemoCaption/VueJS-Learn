<script setup>
defineProps({
    title: {
        type: String,
        required: true,

        validator(value) {
            return value.trim().length >= 2
        }
    },

    instructor: {
        type: String,
        default: '尚未指定'
    },

    price: {
        type: Number,
        default: 0,

        validator(value) {
            return value >= 0
        }
    },

    level: {
        type: String,
        default: 'beginner',

        validator(value) {
            return [
                'beginner',
                'intermediate',
                'advanced'
            ].includes(value)
        }
    },

    topics: {
        type: Array,
        default: () => []
    },

    isOpen: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <article class="course-card">
        <h2>{{ title }}</h2>

        <p>講師：{{ instructor }}</p>

        <p>價格：NT$ {{ price }}</p>

        <p>
            難度：
            <span v-if="level === 'beginner'">初階</span>
            <span v-else-if="level === 'intermediate'">中階</span>
            <span v-else>進階</span>
        </p>

        <section>
            <h3>課程主題</h3>

            <ul v-if="topics.length > 0">
                <li v-for="topic in topics" :key="topic">
                    {{ topic }}
                </li>
            </ul>

            <p v-else>
                尚未設定課程主題
            </p>
        </section>

        <button :disabled="!isOpen">
            {{ isOpen ? '立即報名' : '停止報名' }}
        </button>
    </article>
</template>

<style scoped>
.course-card {
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 10px;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
}
</style>