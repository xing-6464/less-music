let musiclist
// 正在播放歌曲的index
let nowPlayingIndx

// 获取全局唯一的背景音频播放器
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    picUrl: '',
    isPlayer: false, // false表示不播放，true表示正在播放
  },
  onLoad(options) {
    nowPlayingIndx = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId) {
    let music = musiclist[nowPlayingIndx]

    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
      isPlayer: false,
    })

    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud
      .callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'musicUrl',
        },
      })
      .then((res) => {
        let result = res.result.data[0]
        backgroundAudioManager.src = result.url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        this.setData({
          isPlayer: true,
        })

        wx.hideLoading()
      })
  },
})
