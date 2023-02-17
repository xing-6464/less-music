Component({
  behaviors: [],
  properties: {
    modalShow: Boolean,
  },
  data: {},
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },
  methods: {
    onGotUserInfo() {
      wx.getUserProfile({
        desc: '用于发布信息时获取头像与昵称',
        success: (res) => {
          console.log(res)
          this.setData({
            modalShow: false,
          })
          this.triggerEvent('loginsuccess', res.userInfo)
        },
        fail: (err) => {
          console.log(err)
          this.triggerEvent('loginfail')
        },
      })
    },
  },
})
