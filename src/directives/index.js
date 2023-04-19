// 负责管理所有的自定义指令
export const imageerror = {
  inserted (dom, options) {
    // options属性的value为变量的实际值
    // 会在dom插入节点后执行
    // 当图片有地址但是没有加载成功，会报错触发图片的一个时间=>onerror
    dom.src = dom.src || options.value
    dom.onerror = function () {
      dom.src = options.value // 不要写死
    }
  },
  componentUpdated (dom, options) {
    dom.src = dom.src || options.value
  }
}
