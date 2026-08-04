// 匯出自訂 highlight 指令。
export const highlight = (el, binding) => {
    if (binding.arg === 'background') {
        el.style.backgroundColor = binding.value
    }

    if (binding.arg === 'text') {
        el.style.color = binding.value
    }

    if (binding.modifiers.bold) {
        el.style.fontWeight = 'bold'
    }

    if (binding.modifiers.italic) {
        el.style.fontStyle = 'italic'
    }
}