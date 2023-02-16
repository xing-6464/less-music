let musiclist
// 正在播放歌曲的index
let nowPlayingIndx

// 获取全局唯一的背景音频播放器
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
  },
  onLoad(options) {
    nowPlayingIndx = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop()
    let music = musiclist[nowPlayingIndx]

    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
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
        let result = res.result.data
        backgroundAudioManager.src = result[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        this.setData({
          isPlaying: true,
        })

        wx.hideLoading()
      })
  },
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }

    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },
  onPrev() {
    nowPlayingIndx--
    if (nowPlayingIndx < 0) {
      nowPlayingIndx = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndx].id)
  },
  onNext() {
    nowPlayingIndx++
    if (nowPlayingIndx === musiclist.length) {
      nowPlayingIndx = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndx].id)
  },
})
