import formatTime from '../../utils/formatTime'

Component({
  behaviors: [],
  properties: {
    blog: Object,
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val)),
        })
      }
    },
  },
  data: {
    _createTime: '',
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {},
})
