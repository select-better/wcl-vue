// 解析模版在初始化后进行，所以只会进行一次
class Compiler {
  constructor(vm) {
    this.$vm = vm
    this.$el = vm.$el
    this.compiler(this.$el)
  }
  compiler(dom) {
    const childNodes = dom.childNodes
    if (childNodes) {
      Array.from(childNodes).forEach((child) => {
        if (this.isTextNode(child)) {
          this.compilerTextNode(child)
        } else if (this.isElementNode(child)) {
          this.compilerElementNode(child)
        }
        this.compiler(child)
      })
    }
  }

  // 解析文本元素
  compilerTextNode(node) {
    const reg = /\{\{(.*?)\}\}/
    if (reg.test(node.textContent)) {
      const key = RegExp.$1.trim()
      node.textContent = this.$vm[key]
      new Watcher(this.$vm, key, (newVal) => (node.textContent = newVal))
    }
  }
  // 解析dom元素
  compilerElementNode(node) {
    const attrs = node.attributes
    Array.from(attrs).forEach((attr) => {
      if (this.isDirective(attr.name)) {
        const direct = attr.name.slice(2)
        const value = this.$vm[attr.value]
        this.updater(node, direct, value, attr.value)
      }
    })
  }

  updater(node, direct, value, key) {
    const updateFn = this[`${direct}Update`]
    updateFn && updateFn.call(this, node, value, key)
  }
  textUpdate(node, value, key) {
    node.textContent = value
    new Watcher(this.$vm, key, (newVal) => (node.textContent = newVal))
  }
  modelUpdate(node, value, key) {
    node.value = value
    new Watcher(this.$vm, key, (newVal) => (node.value = newVal))
    // 双向绑定
    node.oninput = (e) => (this.$vm[key] = e.target.value)
  }
  // 是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 是不是文本元素
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 是不是dom元素
  isElementNode(node) {
    return node.nodeType === 1
  }
}
