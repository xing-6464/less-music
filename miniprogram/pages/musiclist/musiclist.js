Page({
  data: {
    musiclist: [],
    listInfo: {},
  },
  onLoad(options) {
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
