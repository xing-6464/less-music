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
      console.log(lrc)
    },
  },
  data: {},
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {},
})
