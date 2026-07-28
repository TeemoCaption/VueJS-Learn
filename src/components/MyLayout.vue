<template>
    <!-- 將透傳屬性集中綁定在唯一的根元素，避免 id 等屬性重複套用。 -->
    <div class="layout" v-bind="$attrs">
        <header>
            Header
        </header>

        <main>
            Content
        </main>
    </div>
</template>
