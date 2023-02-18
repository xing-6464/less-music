let keyword = ''
Component({
  behaviors: [],
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字',
    },
  },
  externalClasses: ['iconfont', 'icon-sousuo'],
  data: {},
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },
    onSearch() {
      this.triggerEvent('search', {
        keyword,
      })
    },
  },
})
