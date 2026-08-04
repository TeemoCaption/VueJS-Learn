# Vue 3 過渡動畫：深層級元素與明確動畫時間

本單元學習如何使用 Vue 的 `<Transition>`，讓條件渲染的內容在出現與消失時具有動畫；並進一步處理「外層元素套用過渡類別，但真正動畫發生在內層元素」的深層級情境。

## 一、核心觀念

### 1. `<Transition>` 只處理單一條件內容

`<Transition>` 通常包住一個使用 `v-if` 或 `v-show` 控制的元素。當顯示狀態改變時，Vue 會依序加入過渡類別，讓元素完成進入或離開動畫。

```vue
<Transition name="fade">
  <p v-if="showMessage">訊息內容</p>
</Transition>
```

`name="fade"` 會決定類別前綴，對應的類別如下：

| 階段 | 預設類別 | 用途 |
| --- | --- | --- |
| 進入起點 | `fade-enter-from` | 元素剛出現時的初始狀態 |
| 進入進行中 | `fade-enter-active` | 進入期間的動畫設定 |
| 進入結束 | `fade-enter-to` | 元素完成進入後的狀態 |
| 離開起點 | `fade-leave-from` | 元素開始消失時的狀態 |
| 離開進行中 | `fade-leave-active` | 離開期間的動畫設定 |
| 離開結束 | `fade-leave-to` | 元素即將移除前的狀態 |

### 2. 過渡類別的角色不同

不要把所有樣式都放在同一個類別中。可以用以下方式理解：

- `*-enter-from`、`*-leave-to`：定義透明度、位移等「起點或終點」狀態。
- `*-enter-active`、`*-leave-active`：定義 `transition`、動畫時間、延遲與動畫曲線。
- `*-enter-to`、`*-leave-from`：通常使用元素原本的樣式作為自然狀態，也可以視需求明確設定。

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

## 二、深層級過渡動畫

### 1. 過渡類別會套用在 `<Transition>` 的直接子元素

本單元的結構如下：

```vue
<Transition name="nested">
  <section v-if="showMessage" class="outer">
    <div class="inner">Hello</div>
  </section>
</Transition>
```

Vue 會將 `nested-enter-*` 與 `nested-leave-*` 類別套用在 `section.outer`，不會自動把類別直接套用到 `div.inner`。因此，若真正要動畫的是內層元素，就要使用後代選擇器：

```css
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  opacity: 0;
  transform: translateX(30px);
}
```

這裡的重點是「類別加在外層，樣式透過選擇器控制內層」，而不是誤以為 Vue 會自動逐層套用過渡類別。

### 2. 使用延遲創造由外而內的動畫節奏

進入動畫可以先等待一段時間，再讓內層元素開始移動：

```css
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

## 三、為巢狀動畫指定明確時間

當動畫發生在後代元素時，Vue 可能只根據外層元素判斷動畫何時結束。若外層本身沒有設定 `transition`，就可能在內層動畫完成前移除元素，造成動畫被截斷。

此時可以使用 `duration` 明確告訴 Vue 動畫的完成時間：

```vue
<!-- 進入：250 毫秒延遲 + 300 毫秒動畫；離開：300 毫秒動畫。 -->
<Transition name="nested" :duration="{ enter: 550, leave: 300 }">
  <section v-if="showMessage" class="outer">
    <div class="inner">Hello</div>
  </section>
</Transition>
```

使用物件格式時：

- `enter`：指定完整的進入時間，必須包含延遲與動畫時間。
- `leave`：指定完整的離開時間。

若進入動畫包含多個巢狀元素，應以「最後完成的那一段動畫」作為總時間，避免 Vue 太早結束過渡流程。

## 四、狀態與畫面資料流

本單元的資料流很單純：

1. `showMessage` 是元件內的狀態，負責記錄訊息是否顯示。
2. `toggleMessage()` 修改 `showMessage.value`。
3. `v-if="showMessage"` 根據狀態建立或移除外層區塊。
4. `<Transition>` 偵測元素的建立與移除，加入對應的進入或離開類別。
5. `duration` 讓 Vue 等待內層動畫完成後，再結束過渡流程。

```vue
<script setup>
import { ref } from 'vue'

// 控制訊息區塊是否存在於畫面中。
const showMessage = ref(true)

// 切換訊息的顯示狀態，觸發進入或離開過渡。
function toggleMessage() {
  showMessage.value = !showMessage.value
}
</script>
```

這個流程中，狀態只由目前元件擁有；動畫只是狀態改變後的畫面表現，不應反過來直接修改狀態。

## 五、如何選擇 `v-if`、`v-show` 與 `<Transition>`

| 使用方式 | 適合情境 | 對元素的影響 |
| --- | --- | --- |
| `v-if` + `<Transition>` | 元素需要真正建立與移除，且要有進入／離開動畫 | 會建立或移除元素 |
| `v-show` + `<Transition>` | 元素頻繁切換，但希望保留在文件結構中 | 主要切換 `display` |
| 只有 `v-if` 或 `v-show` | 不需要動畫，只需要控制顯示 | 不處理過渡效果 |

本單元使用 `v-if`，因為訊息區塊在離開後會被移除；若只是頻繁展開與收合、且保留元件狀態很重要，可以考慮 `v-show`。

## 六、常見錯誤

### 1. 忘記把內容放在 `<Transition>` 內

`<Transition>` 必須包住會因 `v-if` 或 `v-show` 改變的內容，否則 Vue 沒有可以觀察的過渡目標。

### 2. 以為類別會自動套用到所有後代元素

過渡類別預設只套用在直接子元素。深層級元素必須使用 `.transition-class .child` 形式的選擇器，或調整結構讓真正動畫的元素成為直接子元素。

### 3. 巢狀動畫沒有設定 `duration`

如果只有內層元素設定動畫，Vue 可能無法正確推斷整體完成時間。請計算最長的延遲加動畫時間，並透過 `:duration` 指定。

### 4. `duration` 只填動畫時間，沒有包含延遲

例如動畫本身是 300 毫秒、延遲是 250 毫秒，進入總時間應填 550 毫秒，而不是 300 毫秒。

### 5. 動畫時間與 `duration` 不一致

若實際的 CSS 動畫時間改變，`duration` 也要同步調整；否則可能出現元素過早移除或畫面停留過久的問題。

## 七、複習重點

- `<Transition>` 負責在條件內容建立與移除時加入過渡類別。
- `name` 決定過渡類別的前綴。
- 過渡類別預設套用在直接子元素，深層級動畫要用後代選擇器控制。
- `transition-delay` 會增加實際動畫總時間。
- 巢狀動畫使用 `:duration` 時，要填寫完整的進入／離開時間。
- 狀態負責決定內容是否存在，動畫只負責呈現狀態變化。

## 專案操作

```sh
# 安裝相依套件。
npm install

# 啟動開發伺服器。
npm run dev

# 建置生產版本，確認範例可以正常編譯。
npm run build
```
