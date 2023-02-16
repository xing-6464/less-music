const MAX_LIMIT = 15
Page({
  data: {
    swiperImgUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      },
    ],
    playlist: [],
  },
  onLoad(options) {
    this._getPlaylist()
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {
    this.setData({
      playlist: [],
    })
    this._getPlaylist()
  },
  onReachBottom() {
    this._getPlaylist()
  },
  onShareAppMessage() {
    return {
      title: '',
    }
  },
  _getPlaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud
      .callFunction({
        name: 'music',
        data: {
          start: this.data.playlist.length,
          count: MAX_LIMIT,
        },
      })
      .then((res) => {
        // console.log(res)
        this.setData({
          playlist: this.data.playlist.concat(res.result.data),
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
  },
})
