Page({
  data: {},
  onLoad(options) {},
  onTapQrCode() {
    wx.showLoading({
      title: '生成中',
    })

    wx.cloud
      .callFunction({
        name: 'getQrCode',
      })
      .then((res) => {
        const fileId = res.result
        wx.previewImage({
          urls: [fileId],
          current: fileId,
        })
        wx.hideLoading()
      })
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onShareAppMessage() {
    return {
      title: '',
    }
  },
})
