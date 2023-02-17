let musiclist
// 正在播放歌曲的index
let nowPlayingIndx

// 获取全局唯一的背景音频播放器
const backgroundAudioManager = wx.getBackgroundAudioManager()

// 获取全局
const app = getApp()

Page({
  data: {
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
    isLyricShow: false, // 表示当前歌词是否显示
    lyric: '',
    isSame: false, // 是否为同一首歌
  },
  onLoad(options) {
    nowPlayingIndx = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId) {
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true,
      })
    } else {
      this.setData({
        isSame: false,
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndx]

    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    })

    // 设置全局属性
    app.setPlayMusicId(musicId)

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
        if (result.url == null) {
          wx.showToast({
            title: '无权限播放',
          })
          return
        }
        if (!this.data.isSame) {
          backgroundAudioManager.src = result[0].url
          backgroundAudioManager.title = music.name
          backgroundAudioManager.coverImgUrl = music.al.picUrl
          backgroundAudioManager.singer = music.ar[0].name
          backgroundAudioManager.epname = music.al.name
        }

        this.setData({
          isPlaying: true,
        })
        wx.hideLoading()

        // 加载歌词
        wx.cloud
          .callFunction({
            name: 'music',
            data: {
              musicId,
              $url: 'lyric',
            },
          })
          .then((res) => {
            let lyric = '暂无歌词'
            const lrc = res.result.lrc
            if (lrc) {
              lyric = lrc.lyric
            }

            this.setData({
              lyric,
            })
          })
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
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow,
    })
  },
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },
})
