Page({
  data: {
    musiclist: [],
    listInfo: {},
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud
      .callFunction({
        name: 'music',
        data: {
          playlistId: options.playlistId,
          $url: 'musiclist',
        },
      })
      .then((res) => {
        const pl = res.result.playlist
        this.setData({
          musiclist: pl.tracks,
          listInfo: {
            coverImgUrl: pl.coverImgUrl,
            name: pl.name,
          },
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
