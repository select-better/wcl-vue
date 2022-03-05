class Vue {
  constructor(options) {
    // 存储options
    this.$options = options || {}
    // 存根元素
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    // 存数据
    this.$data = options.data
    this._proxyData(this.$data)
    // 劫持数据
    new Observer(this.$data)
    new Compiler(this)
  }

  // 将数据直接代理到vm上方便直接调用
  _proxyData(data = {}) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        },
      })
    })
  }
}
