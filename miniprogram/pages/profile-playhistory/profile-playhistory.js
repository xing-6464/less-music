const app = getApp()
Page({
  data: {
    musiclist: [],
  },
  onLoad(options) {
    const playHistory = wx.getStorageSync(app.globalData.openid)
    if (playHistory.lenght == 0) {
      wx.showModal({
        title: '播放历史为空',
        content: '',
      })
    } else {
      // 更改Storage里面存储的musiclist
      wx.setStorage({
        key: 'musiclist',
        data: playHistory,
      })
      this.setData({
        musiclist: playHistory,
      })
    }
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
