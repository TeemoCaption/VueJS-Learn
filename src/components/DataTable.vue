<script setup>
// 接收表格欄位與資料。
defineProps({
    columns: {
        type: Array,
        required: true
    },

    rows: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <div class="table-wrapper">
        <table class="data-table">
            <thead>
                <tr>
                    <!-- 建立表頭 -->
                    <th v-for="column in columns" :key="column.key">
                        {{ column.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <!-- 建立每一筆資料列 -->
                <tr v-for="row in rows" :key="row.id">
                    <!-- 建立每一個欄位儲存格 -->
                    <td v-for="column in columns" :key="column.key">
                        <!--
              動態決定插槽名稱。

              如果 column.key 是 name：
              插槽名稱就是 cell-name。

              如果 column.key 是 email：
              插槽名稱就是 cell-email。

              如果 column.key 是 status：
              插槽名稱就是 cell-status。
            -->
                        <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row">
                            <!--
                父元件沒有提供該欄位插槽時，
                顯示原始資料作為預設內容。
              -->
                            {{ row[column.key] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table-wrapper {
    width: 100%;
    overflow-x: auto;

    border: 1px solid #dce3e8;
    border-radius: 12px;

    background-color: white;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 14px 18px;
    border-bottom: 1px solid #e8ecef;
    text-align: left;
}

.data-table th {
    background-color: #f3f8f6;
    color: #263238;
}

.data-table td {
    color: #53616a;
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}

.data-table tbody tr:hover {
    background-color: #fafcfc;
}
</style>