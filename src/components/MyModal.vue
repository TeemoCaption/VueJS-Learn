<script setup>
// 接收父元件傳入的資料
const props = defineProps({
    // 控制 Modal 是否顯示
    isOpen: {
        type: Boolean,
        required: true
    },

    // Modal 的標題
    title: {
        type: String,
        default: '提示訊息'
    },
    // 控制是否停用 Teleport
    disabled: {
        type: Boolean,
        default: false
    },

    // 用來區分不同用途的 Modal
    modalType: {
        type: String,
        default: 'normal'
    }
})

// 定義子元件可以觸發的事件
// 意思是：這個子元件允許發出一個叫做 close 的事件。
const emit = defineEmits(['close', 'confirm'])

// 通知父元件關閉 Modal
function closeModal() {
    // 發出名稱為 close 的事件，通知父元件彈出視窗應該關閉。
    emit('close')
}

// 通知父元件執行確認操作
function confirmModal() {
    emit('confirm')
}
</script>

<template>
    <!--
    多個 MyModal 元件都可以指向相同的 #modals。
    Vue 會按照掛載順序，把內容依序加入目標容器。
  -->
    <Teleport to="#modals" :disabled="props.disabled">
        <!--
      isOpen 是父元件透過 props 傳入的資料。
      即使這段 DOM 被傳送到 #modals，
      props 與 emit 仍然可以正常運作。
    -->
        <div v-if="props.isOpen" class="modal-overlay" @click.self="closeModal">
            <section class="modal" role="dialog" aria-modal="true" :aria-labelledby="`modal-title-${props.modalType}`">
                <!-- 每個 Modal 使用不同的 id，避免重複 -->
                <h2 :id="`modal-title-${props.modalType}`">
                    {{ props.title }}
                </h2>

                <!--
          slot 讓父元件自行傳入不同內容。
          因此 MyModal 可以重複使用。
        -->
                <div class="modal-content">
                    <slot />
                </div>

                <div class="modal-actions">
                    <!--
            只有 delete 類型的 Modal，
            才會顯示確認刪除按鈕。
          -->
                    <button v-if="props.modalType === 'delete'" class="confirm-button" type="button"
                        @click="confirmModal">
                        確認刪除
                    </button>

                    <!--
            點擊後觸發 closeModal。
            closeModal 會 emit 一個 close 事件給父元件。
          -->
                    <button class="close-button" type="button" @click="closeModal">
                        關閉
                    </button>
                </div>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
/* 全螢幕背景遮罩 */
.modal-overlay {
    position: fixed;
    z-index: 999;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;
    background-color: rgba(0, 0, 0, 0.55);
}

/* Modal 主體 */
.modal {
    width: min(400px, 100%);
    padding: 24px;
    border-radius: 12px;
    background-color: white;
    text-align: center;
}

/* 關閉按鈕 */
.close-button {
    margin-top: 16px;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;

    background-color: #333;
    color: white;
    cursor: pointer;
}

/* 確認刪除按鈕 */
.confirm-button {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;

    background-color: #d33;
    color: white;
    cursor: pointer;
}
</style>
