let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()

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
      backgroundAudioManager.onPlay(() => {})
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
      backgroundAudioManager.onTimeUpdate(() => {})
      backgroundAudioManager.onEnded(() => {})
      backgroundAudioManager.onError(() => {})
    },
    _setTime() {
      const duration = backgroundAudioManager.duration
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
