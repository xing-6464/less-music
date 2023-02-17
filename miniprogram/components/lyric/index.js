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
      if (lrc === '暂无歌词') {
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0,
            },
          ],
          nowLyricIndex: -1,
        })
      } else {
        this._parseLyric(lrc)
      }
    },
  },
  data: {
    lyricList: [],
    nowLyricIndex: 0, // 当前选中的歌词索引
    scrollTop: 0, // 滚动条滚动的高度
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    update(currentTime) {
      const lrcList = this.data.lyricList
      if (lrcList.length === 0) {
        return
      }
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * 64,
          })
        }
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          // console.log(currentTime, lrcList[i])
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * 64,
          })
          break
        }
      }
    },
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
