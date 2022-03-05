class Watcher {
  // Watcher 将node的更新收集再给 dep 订阅, 传递新数据
  constructor(vm, key, cb) {
    this.$vm = vm
    this.$key = key
    this.cb = cb
    Dep.target = this
    // 下面读取了数据，所以，会讲
    this.oldValue = vm[key]
    Dep.target = null
  }
  update() {
    const newValue = this.$vm[this.$key]
    if (newValue !== this.oldValue) {
      this.cb(newValue)
      this.oldValue = newValue
    }
  }
}
