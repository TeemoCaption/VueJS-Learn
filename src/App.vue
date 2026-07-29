<script setup>
import { ref } from 'vue'

import FancyButton from './components/FancyButton.vue'
import UserButton from './components/UserButton.vue'
import ActionButton from './components/ActionButton.vue'
import ArticleCard from './components/ArticleCard.vue'
import MessageBox from './components/MessageBox.vue'
import PageLayout from './components/PageLayout.vue'
import DynamicCard from './components/DynamicCard.vue'
import DataTable from './components/DataTable.vue'
import UserCard from './components/UserCard.vue'
import ProfileCard from './components/ProfileCard.vue'
import MouseTracker from './components/MouseTracker.vue'
import CounterLogic from './components/CounterLogic.vue'

function handleSave() {
  alert('資料已儲存')
}

function handleLogin() {
  alert('準備登入')
}

function handleDelete() {
  alert('文章已刪除')
}

const userName = ref('小明')

function submitForm() {
  alert('表單已送出')
}

// 控制是否顯示完整文章內容
const showFullContent = ref(false)

// 控制文章是否收藏
const isFavorite = ref(false)

// 切換文章內容的顯示狀態
function toggleContent() {
  showFullContent.value = !showFullContent.value
}

// 切換收藏狀態
function toggleFavorite() {
  isFavorite.value = !isFavorite.value
}

const message = ref('確定要刪除這篇文章嗎？')

function cancelDelete() {
  alert('已取消刪除')
}

function confirmDelete() {
  alert('文章已刪除')
}

// 動態插槽名稱。
// 一開始設定為 header。
const currentSlot = ref('header')

// 將動態內容切換到 header 插槽。
function moveToHeader() {
  currentSlot.value = 'header'
}

// 將動態內容切換到 footer 插槽。
function moveToFooter() {
  currentSlot.value = 'footer'
}

// 表格欄位設定。
const columns = ref([
  {
    key: 'name',
    label: '姓名'
  },
  {
    key: 'email',
    label: '電子郵件'
  },
  {
    key: 'status',
    label: '狀態'
  }
])

// 表格資料。
const users = ref([
  {
    id: 1,
    name: '小明',
    email: 'ming@example.com',
    status: 'active'
  },
  {
    id: 2,
    name: '小美',
    email: 'mei@example.com',
    status: 'inactive'
  },
  {
    id: 3,
    name: '小華',
    email: 'hua@example.com',
    status: 'active'
  }
])

// 需要自訂顯示方式的欄位名稱。
const customColumns = ref([
  'name',
  'status'
])

// 根據欄位名稱格式化內容。
function formatCell(columnName, value) {
  if (columnName === 'name') {
    return `使用者：${value}`
  }

  if (columnName === 'status') {
    return value === 'active' ? '啟用中' : '已停用'
  }

  return value
}
</script>

<template>
  <main class="page-container">
    <div>
      <h1>Vue 插槽 Slots</h1>

      <p class="description">
        下面三個按鈕使用相同的 FancyButton 元件，
        但透過插槽顯示不同內容。
      </p>

      <section class="button-group">
        <!-- Props 比較適合傳入：數值、布林值、物件等資料。插槽比較適合傳入 HTML 元素。 -->
        <!-- 傳入純文字 -->
        <FancyButton @click="handleSave">
          儲存資料
        </FancyButton>

        <!-- 傳入不同的純文字 -->
        <FancyButton @click="handleLogin">
          登入帳號
        </FancyButton>

        <!-- 插槽不只能放文字，也可以放 HTML 元素 -->
        <FancyButton @click="handleDelete">
          <span aria-hidden="true">🗑️</span>
          <span>刪除文章</span>
        </FancyButton>

        <FancyButton />
      </section>
    </div>
    <div>
      <h1>插槽的渲染作用域</h1>

      <UserButton>
        <!-- 插槽內容可以存取父元件的資料，但無法直接存取子元件的資料。 -->
        歡迎回來，{{ userName }}
      </UserButton>
    </div>
    <div>
      <h1>Props 與 Slots 一起使用</h1>
      <!-- Props 與 Slots 一起使用時，Props 會傳入到子元件，Slots 會傳入到子元件的插槽 -->
      <ActionButton type="submit" @click="submitForm">
        <span aria-hidden="true">📨</span>
        <span>送出表單</span>
      </ActionButton>

      <ActionButton disabled>
        暫時不能使用
      </ActionButton>
    </div>
    <div>
      <h1>Vue 具名插槽</h1>

      <p class="page-description">
        父元件可以把不同內容，分別放入子元件指定的插槽位置。
      </p>

      <ArticleCard>
        <!--
        將這段內容傳入 ArticleCard 的 header 插槽。
        v-slot:header 可以縮寫成 #header。
      -->
        <!-- <template> 本身不會成為實際 DOM 元素。
也就是說，瀏覽器畫面不會多出一層 <template>。
   -->
        <template #header>
          <div class="article-heading">
            <span class="category">Vue.js</span>

            <h2>認識 Vue 具名插槽</h2>

            <p class="article-date">
              發布日期：2026 年 7 月 28 日
            </p>
          </div>
        </template>

        <!--
        沒有寫 template #名稱 的內容，
        會自動放入預設插槽 default。
      -->
        <p>
          具名插槽可以讓一個元件擁有多個內容出口，
          例如標題區、主要內容區以及底部操作區。
        </p>

        <p v-if="showFullContent">
          使用具名插槽後，子元件負責控制整體版面與樣式，
          父元件則負責提供實際內容。這可以讓元件維持一致的外觀，
          同時保有很高的內容彈性。
        </p>

        <!-- 將這段內容傳入 footer 插槽 -->
        <template #footer>
          <button class="secondary-button" type="button" @click="toggleFavorite">
            {{ isFavorite ? '取消收藏' : '收藏文章' }}
          </button>

          <button class="primary-button" type="button" @click="toggleContent">
            {{ showFullContent ? '收起內容' : '閱讀更多' }}
          </button>
        </template>
      </ArticleCard>
    </div>
    <div>
      <h1>具名插槽與預設插槽</h1>

      <MessageBox>
        <!-- title 具名插槽 -->
        <template #title>
          <h2>刪除確認</h2>
        </template>

        <!-- 明確指定 default 預設插槽 -->
        <template #default>
          <p>{{ message }}</p>

          <p class="warning">
            刪除後將無法復原。
          </p>
        </template>

        <!-- actions 具名插槽 -->
        <template #actions>
          <button class="cancel-button" type="button" @click="cancelDelete">
            取消
          </button>

          <button class="delete-button" type="button" @click="confirmDelete">
            確定刪除
          </button>
        </template>
      </MessageBox>
    </div>
    <div class="app-container">
      <h1>具名插槽預設內容</h1>

      <!--
      只提供主要內容。
      header 與 footer 都會顯示子元件設定的預設內容。
    -->
      <PageLayout>
        <p>這是父元件提供的主要頁面內容。</p>
      </PageLayout>
    </div>
    <br>
    <div>
      <h1>Vue 動態插槽名稱</h1>

      <p class="description">
        目前動態內容所在的插槽：
        <strong>{{ currentSlot }}</strong>
      </p>

      <div class="button-group">
        <button type="button" :class="{ active: currentSlot === 'header' }" @click="moveToHeader">
          放到 Header
        </button>

        <button type="button" :class="{ active: currentSlot === 'footer' }" @click="moveToFooter">
          放到 Footer
        </button>
      </div>

      <DynamicCard>
        <!--
        currentSlot 是動態插槽名稱。

        當 currentSlot === 'header'：
        這段內容會進入 header 插槽。

        當 currentSlot === 'footer'：
        這段內容會進入 footer 插槽。
      -->
        <template #[currentSlot]>
          <div class="dynamic-content">
            <strong>我是動態插槽內容</strong>

            <span>
              目前被放在 {{ currentSlot }} 插槽。
            </span>
          </div>
        </template>

        <!--
        這段沒有指定名稱，
        因此進入 default 預設插槽。
      -->
        <template #default>
          <h2>主要內容</h2>

          <p>
            按下上方按鈕，可以改變動態內容出現的位置。
          </p>
        </template>
      </DynamicCard>
    </div>
    <br>
    <div>
      <h1>動態插槽表格範例</h1>

      <p class="description">
        表格元件會根據欄位名稱，動態產生對應的插槽。
      </p>

      <DataTable :columns="columns" :rows="users">
        <!--
        自訂 name 欄位。

        這個插槽會對應子元件的：
        name="cell-name"
      -->
        <template #cell-name="{ value }">
          <strong class="user-name">
            {{ value }}
          </strong>
        </template>

        <!--
        自訂 status 欄位。

        這個插槽會對應子元件的：
        name="cell-status"
      -->
        <template #cell-status="{ value }">
          <span class="status-badge" :class="{
            active: value === 'active',
            inactive: value === 'inactive'
          }">
            {{ value === 'active' ? '啟用中' : '已停用' }}
          </span>
        </template>
      </DataTable>
    </div>
    <div>
      <DataTable :columns="columns" :rows="users">
        <!--
        根據 customColumns 陣列，
        動態建立 cell-name 與 cell-status 插槽。
        slotProps 接收子元件傳來的插槽 Props。
      -->
        <template v-for="columnName in customColumns" #[`cell-${columnName}`]="slotProps" :key="columnName">
          <span class="custom-cell" :class="`custom-cell-${columnName}`">
            {{ formatCell(columnName, slotProps.value) }}
          </span>
        </template>
      </DataTable>
    </div>
    <br>
    <div>
      <h1>作用域插槽範例</h1>

      <UserCard>
        <!--
        slotProps 會接收到 UserCard
        透過 <slot> 傳出來的資料。
      -->
        <template #default="slotProps">
          <div class="user-content">
            <div class="user-heading">
              <h2>
                {{ slotProps.user.name }}
              </h2>

              <span class="status" :class="{
                online: slotProps.isOnline,
                offline: !slotProps.isOnline
              }">
                {{ slotProps.isOnline ? '上線中' : '離線' }}
              </span>
            </div>

            <p>
              年齡：{{ slotProps.user.age }} 歲
            </p>

            <p>
              電子郵件：{{ slotProps.user.email }}
            </p>

            <button type="button" @click="slotProps.toggleStatus">
              切換上線狀態
            </button>
          </div>
        </template>
      </UserCard>
    </div>
    <br>
    <div>
      <h1>解構 Slot Props</h1>

      <UserCard>
        <!--
        直接解構子元件傳入的 Slot Props。
        當子元件只有一個預設插槽時，可以把 v-slot 直接寫在元件上。
      -->
        <template v-slot="{ user, isOnline, toggleStatus }">
          <div class="user-content">
            <div class="user-heading">
              <h2>{{ user.name }}</h2>

              <span class="status" :class="{
                online: isOnline,
                offline: !isOnline
              }">
                {{ isOnline ? '上線中' : '離線' }}
              </span>
            </div>

            <p>年齡：{{ user.age }} 歲</p>

            <p>電子郵件：{{ user.email }}</p>

            <button type="button" @click="toggleStatus">
              切換上線狀態
            </button>
          </div>
        </template>
      </UserCard>
    </div>
    <div>
      <h1>具名作用域插槽</h1>

      <ProfileCard>
        <!-- 不同插槽的 Props 不會共用 -->
        <!--
        接收 header 插槽提供的 title。
      -->
        <template #header="{ title }">
          <div class="custom-header">
            <span class="icon">👤</span>

            <h2>{{ title }}</h2>
          </div>
        </template>

        <!--
        接收 default 插槽提供的
        user 與 updateProfile。
      -->
        <template #default="{ user, updateProfile }">
          <dl class="profile-list">
            <div>
              <dt>姓名</dt>
              <dd>{{ user.name }}</dd>
            </div>

            <div>
              <dt>信箱</dt>
              <dd>{{ user.email }}</dd>
            </div>

            <div>
              <dt>身分</dt>
              <dd>{{ user.role }}</dd>
            </div>
          </dl>

          <button type="button" @click="updateProfile">
            更新資料時間
          </button>
        </template>

        <!--
        接收 footer 插槽提供的 updatedAt。
      -->
        <template #footer="{ updatedAt }">
          <small>
            最後更新時間：{{ updatedAt }}
          </small>
        </template>
      </ProfileCard>
    </div>
    <br>
    <div>
      <header class="page-header">
        <p class="eyebrow">
          Vue 作用域插槽
        </p>

        <h1>無渲染元件範例</h1>

        <p class="description">
          將滑鼠移入下方區域，MouseTracker
          會負責追蹤座標，而 App.vue 負責決定畫面如何呈現。
        </p>
      </header>

      <!--
      使用作用域插槽接收 MouseTracker 傳出的資料。

      x、y 和 isInside 都來自子元件，
      但下方的 HTML 結構由 App.vue 決定。
    -->
      <MouseTracker v-slot="{ x, y, isInside }">
        <section class="tracking-area" :class="{
          'tracking-area--active': isInside
        }">
          <!-- 左上方狀態資訊 -->
          <div class="status-panel">
            <span class="status-dot" :class="{
              'status-dot--active': isInside
            }"></span>

            <span>
              {{ isInside ? '正在追蹤滑鼠' : '請將滑鼠移入區域' }}
            </span>
          </div>

          <!-- 顯示目前座標 -->
          <div class="coordinate-card">
            <div class="coordinate-item">
              <span class="coordinate-label">
                X 座標
              </span>

              <strong class="coordinate-value">
                {{ x }}
              </strong>
            </div>

            <div class="coordinate-divider"></div>

            <div class="coordinate-item">
              <span class="coordinate-label">
                Y 座標
              </span>

              <strong class="coordinate-value">
                {{ y }}
              </strong>
            </div>
          </div>

          <!--
          當滑鼠位於追蹤區域內時，
          根據 x 和 y 動態移動圓點。
        -->
          <div v-if="isInside" class="cursor-dot" :style="{
            left: `${x}px`,
            top: `${y}px`
          }">
            <span class="cursor-label">
              {{ x }}, {{ y }}
            </span>
          </div>

          <!-- 底部說明 -->
          <div class="tracking-hint">
            <p>
              MouseTracker 只提供
              <code>x</code>、<code>y</code>
              與 <code>isInside</code>。
            </p>

            <p>
              這張卡片、座標樣式和移動圓點，
              全部由父元件決定。
            </p>
          </div>
        </section>
      </MouseTracker>

      <section class="explanation">
        <h2>元件分工</h2>

        <div class="responsibility-grid">
          <article class="responsibility-card">
            <h3>MouseTracker.vue</h3>

            <ul>
              <li>監聽滑鼠事件</li>
              <li>計算滑鼠座標</li>
              <li>儲存追蹤狀態</li>
              <li>透過 Slot Props 提供資料</li>
            </ul>
          </article>

          <article class="responsibility-card">
            <h3>App.vue</h3>

            <ul>
              <li>決定 HTML 結構</li>
              <li>決定座標如何顯示</li>
              <li>決定圓點的樣式</li>
              <li>決定整體畫面設計</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
    <br>
    <div>
      <header class="page-header">
        <h1>無渲染計數器元件</h1>

        <p>
          CounterLogic 負責狀態與操作，
          App.vue 負責所有畫面。
        </p>
      </header>

      <CounterLogic :initial-value="2" :step="1" :min="0" :max="5" v-slot="{
        count,
        increase,
        decrease,
        reset,
        isMin,
        isMax
      }">
        <section class="counter-card">
          <p class="counter-label">
            目前數量
          </p>

          <strong class="counter-value">
            {{ count }}
          </strong>

          <div class="counter-progress">
            <div class="counter-progress-fill" :style="{
              width: `${(count / 5) * 100}%`
            }"></div>
          </div>

          <div class="button-group">
            <button type="button" class="secondary-button" :disabled="isMin" @click="decrease">
              減少
            </button>

            <button type="button" class="primary-button" :disabled="isMax" @click="increase">
              增加
            </button>
          </div>

          <button type="button" class="reset-button" @click="reset">
            恢復初始值
          </button>

          <p v-if="isMin" class="limit-message">
            已經到達最小值。
          </p>

          <p v-else-if="isMax" class="limit-message">
            已經到達最大值。
          </p>
        </section>
      </CounterLogic>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  width: min(700px, 90%);
  margin: 60px auto;
  text-align: center;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(900px, 90%);
  margin: 50px auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.description {
  margin-bottom: 28px;
  color: #606f7b;
  line-height: 1.7;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.button-group button.active {
  background-color: #42b883;
  color: white;
}

.page-description {
  margin-top: 0;
  margin-bottom: 30px;
  color: #687780;
}

.article-heading h2 {
  margin: 10px 0 8px;
  color: #263238;
}

.category {
  display: inline-block;

  padding: 4px 10px;
  border-radius: 999px;

  background-color: #42b883;
  color: white;

  font-size: 13px;
  font-weight: 700;
}

.article-date {
  margin: 0;
  color: #76858f;
  font-size: 14px;
}

.primary-button,
.secondary-button {
  padding: 9px 16px;
  border-radius: 8px;

  font-size: 15px;
  cursor: pointer;

  transition:
    transform 0.2s,
    opacity 0.2s;
}

.primary-button:hover,
.secondary-button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.primary-button {
  border: none;
  background-color: #42b883;
  color: white;
}

.secondary-button {
  border: 1px solid #42b883;
  background-color: white;
  color: #23845c;
}

h2 {
  margin: 0;
  color: #263238;
}

.warning {
  color: #d84343;
  font-weight: 700;
}

.cancel-button,
.delete-button {
  padding: 9px 15px;
  border-radius: 7px;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #aab4bb;
  background-color: white;
  color: #45525b;
}

.delete-button {
  border: none;
  background-color: #d84343;
  color: white;
}

.dynamic-content {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #263238;
}

.dynamic-content strong {
  color: #23845c;
}

.user-name {
  color: #23845c;
}

.status-badge {
  display: inline-block;

  padding: 5px 10px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
}

.status-badge.active {
  background-color: #dcf5e9;
  color: #18734f;
}

.status-badge.inactive {
  background-color: #f1f2f3;
  color: #6c777e;
}

.custom-cell {
  font-weight: 700;
}

.custom-cell-name {
  color: #23845c;
}

.custom-cell-status {
  display: inline-block;

  padding: 5px 10px;
  border-radius: 999px;

  background-color: #e8f3ff;
  color: #24669c;
}

.user-content {
  color: #45525d;
}

.user-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 18px;
}

.user-heading h2 {
  margin: 0;
  color: #263238;
}

.status {
  padding: 5px 10px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
}

.status.online {
  background-color: #dcf5e9;
  color: #18734f;
}

.status.offline {
  background-color: #eceff1;
  color: #657078;
}

.icon {
  font-size: 24px;
}

.profile-list {
  margin: 0 0 20px;
}

.profile-list div {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;

  padding: 10px 0;
  border-bottom: 1px solid #edf0f2;
}

.profile-list dt {
  color: #6d7981;
}

.profile-list dd {
  margin: 0;
  color: #263238;
  font-weight: 700;
}

.tracking-area {
  position: relative;

  min-height: 360px;
  overflow: hidden;

  border: 2px dashed #b8c7cf;
  border-radius: 20px;

  background:
    linear-gradient(rgb(255 255 255 / 92%),
      rgb(255 255 255 / 92%)),
    linear-gradient(90deg,
      #dce5e9 1px,
      transparent 1px),
    linear-gradient(#dce5e9 1px,
      transparent 1px);

  background-size:
    auto,
    24px 24px,
    24px 24px;

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.tracking-area--active {
  border-color: #42b883;
  box-shadow: 0 16px 45px rgb(66 184 131 / 16%);
}

.status-panel {
  position: absolute;
  top: 20px;
  left: 20px;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  padding: 8px 12px;

  border: 1px solid #e0e7ea;
  border-radius: 999px;

  background-color: rgb(255 255 255 / 92%);
  color: #596970;

  font-size: 14px;
}

.status-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;
  background-color: #a9b3b8;
}

.status-dot--active {
  background-color: #42b883;
  box-shadow: 0 0 0 5px rgb(66 184 131 / 16%);
}

.coordinate-card {
  position: absolute;
  top: 20px;
  right: 20px;

  display: flex;
  align-items: center;
  gap: 18px;

  padding: 13px 18px;

  border: 1px solid #e0e7ea;
  border-radius: 14px;

  background-color: rgb(255 255 255 / 94%);
  box-shadow: 0 8px 20px rgb(24 39 49 / 8%);
}

.coordinate-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.coordinate-label {
  color: #79878e;
  font-size: 12px;
}

.coordinate-value {
  color: #223038;
  font-size: 22px;
}

.coordinate-divider {
  width: 1px;
  height: 34px;
  background-color: #dce3e7;
}

.cursor-dot {
  position: absolute;

  width: 18px;
  height: 18px;

  border: 4px solid white;
  border-radius: 50%;

  background-color: #42b883;
  box-shadow:
    0 0 0 5px rgb(66 184 131 / 22%),
    0 8px 20px rgb(34 48 56 / 22%);

  /*
    left 和 top 會讓圓點左上角對齊滑鼠。

    translate(-50%, -50%) 則將圓點往左上移動自身一半，
    讓圓點中心真正對齊滑鼠位置。
  */
  transform: translate(-50%, -50%);

  pointer-events: none;
}

.cursor-label {
  position: absolute;
  top: 24px;
  left: 50%;

  padding: 5px 8px;

  border-radius: 6px;

  background-color: #223038;
  color: white;

  font-size: 12px;
  white-space: nowrap;

  transform: translateX(-50%);
}

.tracking-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;

  width: min(560px, 88%);

  padding: 16px 20px;

  border: 1px solid #e1e7ea;
  border-radius: 12px;

  background-color: rgb(255 255 255 / 90%);
  color: #637178;

  text-align: center;
  line-height: 1.7;

  transform: translateX(-50%);
}

.tracking-hint p {
  margin: 0;
}

.tracking-hint p+p {
  margin-top: 4px;
}

code {
  padding: 2px 6px;

  border-radius: 5px;

  background-color: #e9f7f0;
  color: #18734f;
}

.explanation {
  margin-top: 48px;
}

.explanation h2 {
  margin-bottom: 20px;
  color: #223038;
  text-align: center;
}

.responsibility-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.responsibility-card {
  padding: 24px;

  border: 1px solid #dfe6e9;
  border-radius: 14px;

  background-color: white;
}

.responsibility-card h3 {
  margin: 0 0 16px;
  color: #23845c;
}

.responsibility-card ul {
  margin: 0;
  padding-left: 22px;

  color: #5e6c73;
  line-height: 1.9;
}

@media (max-width: 700px) {
  .coordinate-card {
    top: 68px;
    right: auto;
    left: 20px;
  }

  .responsibility-grid {
    grid-template-columns: 1fr;
  }

  .tracking-hint {
    font-size: 14px;
  }
}

.counter-card {
  width: min(420px, 100%);
  padding: 30px;

  border: 1px solid #dce3e8;
  border-radius: 18px;

  background-color: white;
  box-shadow: 0 12px 32px rgb(31 51 61 / 10%);

  text-align: center;
}

.counter-label {
  margin: 0;
  color: #748188;
}

.counter-value {
  display: block;

  margin: 12px 0 20px;

  color: #23845c;

  font-size: 64px;
  line-height: 1;
}

.counter-progress {
  height: 10px;
  overflow: hidden;

  margin-bottom: 24px;

  border-radius: 999px;

  background-color: #e5ece9;
}

.counter-progress-fill {
  height: 100%;

  border-radius: inherit;

  background-color: #42b883;

  transition: width 0.25s ease;
}

.reset-button {
  width: 100%;
  margin-top: 12px;

  border: 1px solid #d7dee2;

  background-color: #f6f8f9;
  color: #526169;
}

.limit-message {
  margin: 18px 0 0;
  color: #c25454;
  font-size: 14px;
}
</style>
