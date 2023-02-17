Component({
  behaviors: [],
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },
  observers: {
    lyric(lrc) {
      this._parseLyric(lrc)
    },
  },
  data: {
    lyricList: [],
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    _parseLyric(sLyric) {
      let line = sLyric.split('\n')
      const _lrcList = []
      line.forEach((elem) => {
        const time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          const lrc = elem.split(time)[1]
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换成秒
          const time2Seconds =
            parseInt(timeReg[1]) * 60 +
            parseInt(timeReg[2]) +
            parseInt(timeReg[3]) / 1000

          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      this.setData({
        lyricList: _lrcList,
      })
    },
  },
})
