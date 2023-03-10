const app = getApp()

Component({
  behaviors: [],
  properties: {
    musiclist: Array,
  },
  data: {
    playingId: -1,
  },
  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlayMusicId()),
      })
    },
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    onSelect(event) {
      const musicid = event.currentTarget.dataset.musicid
      const index = event.currentTarget.dataset.index
      this.setData({
        playingId: musicid,
      })

      wx.navigateTo({
        url: `/pages/player/player?musicId=${musicid}&index=${index}`,
      })
    },
  },
})
