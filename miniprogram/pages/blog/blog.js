Page({
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
  },
  onLoad(options) {},
  // 发布
  onPublish() {
    // 判断微信是否授权
    this.setData({
      modalShow: true,
    })
  },
  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(event) {},
  onShareAppMessage() {
    return {
      title: '',
    }
  },
})
