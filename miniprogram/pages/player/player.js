let musiclist
// 正在播放歌曲的index
let nowPlayingIndx

Page({
  data: {
    picUrl: '',
  },
  onLoad(options) {
    nowPlayingIndx = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail()
  },
  _loadMusicDetail() {
    let music = musiclist[nowPlayingIndx]

    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
    })
  },
})
