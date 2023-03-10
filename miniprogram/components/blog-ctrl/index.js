// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object,
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    modalShow: false,
    content: '',
    nickname: '',
    avatarUrl: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 用户信息在本地存储，key为openid + '-userinfo'
      const { openid } = app.globalData
      wx.getStorage({
        key: openid + '-userinfo',
        success: (res) => {
          const { nickname, avatarFileId } = res.data
          this.data.nickname = nickname
          this.data.avatarUrl = avatarFileId
          // 如果用户信息存在，那么订阅消息
          this.subscribeMsg()
        },
        fail() {
          // 如果不存在用户信息，就跳转到用户信息配置页面
          wx.showToast({
            icon: 'loading',
            title: '请配置用户信息',
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/userinfo/userinfo',
            })
          }, 1500)
        },
      })
      // this.setData({
      //   loginShow: true,
      // })
      // 判断用户是否授权
      /* wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      }) */
    },

    onLoginsuccess(event) {
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData(
        {
          loginShow: false,
        },
        () => {
          this.setData({
            modalShow: true,
          })
        }
      )
    },

    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    onSend() {
      // 插入数据库
      let content = this.data.content
      if (content.trim() === '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true,
      })
      db.collection('blog-comment')
        .add({
          data: {
            content,
            createTime: db.serverDate(),
            blogId: this.properties.blogId,
            nickName: this.data.nickname,
            avatarUrl: this.data.avatarUrl,
          },
        })
        .then((res) => {
          // 推送订阅消息
          wx.cloud
            .callFunction({
              name: 'subscribeMsg',
              data: {
                content,
                blogId: this.properties.blogId,
              },
            })
            .then((res) => {
              console.log(res)
            })

          wx.hideLoading()
          wx.showToast({
            title: '评论成功',
          })
          this.setData({
            modalShow: false,
            content: '',
          })

          // 父元素刷新评论页面
          this.triggerEvent('refreshCommentList')
        })
    },
    // 调起客户端小程序订阅消息界面
    subscribeMsg() {
      const tmplId = 'QWmKrfr1K9skTeDokBaCzD9INe6teSLxuA-G6cYlPkU'
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: (res) => {
          console.log(res)
          if (res[tmplId] === 'accept') {
            // this.onComment()
            this.setData({
              modalShow: true,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '订阅失败，无法评论',
            })
          }
        },
      })
    },
    // 获取textarea内容
    onInput(event) {
      this.setData({
        content: event.detail.value,
      })
    },
  },
})
