let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 // 当前秒数
let duration = 0 // 当前歌曲总时长, 秒为单位
let isMoving = false // 表示当前进度条是否在拖动

Component({
  behaviors: [],
  properties: {},
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    progress: 0,
  },
  lifetimes: {
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    },
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    onChange(event) {
      if (event.detail.source === 'touch') {
        this.data.progress =
          (event.detail.x / (movableAreaWidth - movableViewWidth)) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      const currentTimeFmt = this._dateFormat(
        Math.floor(backgroundAudioManager.currentTime)
      )
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
      })
      backgroundAudioManager.seek((duration * this.data.progress) / 100)
      isMoving = false
    },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
      })
      backgroundAudioManager.onStop(() => {})
      backgroundAudioManager.onPause(() => {})
      backgroundAudioManager.onWaiting(() => {})
      backgroundAudioManager.onCanplay(() => {
        if (typeof backgroundAudioManager.duration === 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]

          if (sec !== currentSec) {
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis:
                ((movableAreaWidth - movableViewWidth) * currentTime) /
                duration,
              progress: (currentTime / duration) * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            })
            currentSec = sec
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError(() => {})
    },
    _setTime() {
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`,
      })
    },
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        min: this._parse0(min),
        sec: this._parse0(sec),
      }
    },
    // 补0
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    },
  },
})
