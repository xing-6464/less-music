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
        console.log(rect)
      })
    },
  },
})
