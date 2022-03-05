class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach((key) => {
      this._defineReactive(data, key, data[key])
    })
  }
  _defineReactive(data, key, value) {
    const _this = this
    // 对value进行深度便利
    this.walk(value)
    const dep = new Dep()
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        // Dep.target巧妙的将需要watch的副作用和node结合的方法。进行了订阅
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if (newValue === value) {
          return
        }
        value = newValue
        // 当数据更新的时候，进行发布，将需要的内容进行更新
        dep.notify()
        _this.walk(value)
      },
    })
  }
}
