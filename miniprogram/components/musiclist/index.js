Component({
  behaviors: [],
  properties: {
    musiclist: Array,
  },
  data: {
    playingId: -1,
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
      this.setData({
        playingId: musicid,
      })

      wx.navigateTo({
        url: `/pages/player/player?musicid=${musicid}`,
      })
    },
  },
})
