// 发布订阅
class Dep {
  // 每一个key会对应一个
  subs = []
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 分发
  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}
