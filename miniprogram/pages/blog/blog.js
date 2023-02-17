Page({
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
  },
  onLoad(options) {},
  // 发布
  onPublish() {
    this.setData({
      modalShow: true,
    })
  },
  onShareAppMessage() {
    return {
      title: '',
    }
  },
})
