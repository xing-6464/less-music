Component({
  behaviors: [],
  properties: {
    modalShow: Boolean,
  },
  data: {},
  options: {
    styleIsolation: 'apply-shared',
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    onClose() {
      this.setData({
        modalShow: false,
      })
    },
  },
})
