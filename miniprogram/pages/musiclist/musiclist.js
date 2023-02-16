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
        console.log(pl)
        this.setData({
          musiclist: pl.tracks,
          listInfo: {
            coverImgUrl: pl.coverImgUrl,
            name: pl.name,
          },
        })

        // wx.cloud
        //   .callFunction({
        //     name: 'music',
        //     data: {
        //       trackIds: pl.trackIds,
        //       $url: 'songdetail',
        //     },
        //   })
        //   .then((res) => {
        //     console.log(res)
        //     const rr = res.result
        //     this.setData({
        //       musiclist: rr.songs,
        //     })
        //   })
        this._setMusiclist()
        wx.hideLoading()
      })
  },
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
})
