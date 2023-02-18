const app = getApp()

let keyword = ''

Page({
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    blogList: [],
  },
  onLoad(options) {
    this._loadBlogList()
  },
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })

    wx.cloud
      .callFunction({
        name: 'blog',
        data: {
          keyword,
          start,
          count: 10,
          $url: 'list',
        },
      })
      .then((res) => {
        this.setData({
          blogList: this.data.blogList.concat(res.result),
        })

        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  // 发布
  onPublish() {
    // 20221128小程序用户头像昵称获取规则调整
    // 判断本地存储中是否有用户信息
    // 用户信息在本地存储，key为openid + '-userinfo'
    const { openid } = app.globalData
    wx.getStorage({
      key: openid + '-userinfo',
      success(res) {
        const { nickname, avatarFileId } = res.data
        // 如果用户信息存在，那么就跳转到发博客页面
        wx.navigateTo({
          url: `/pages/blog-edit/blog-edit?nickName=${nickname}&avatarUrl=${avatarFileId}`,
        })
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
  },
  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(event) {},
  goComment(event) {
    wx.navigateTo({
      url:
        '/pages/blog-comment/blog-comment?blogId=' +
        event.target.dataset.blogid,
    })
  },
  // 页面是拉触底事件的处理函数
  onReachBottom() {
    this._loadBlogList(this.data.blogList.length)
  },
  // 页面相关处理函数--监听用户下拉动作
  onPullDownRefresh() {
    this.setData({
      blogList: [],
    })
    this._loadBlogList()
  },
  onSearch(event) {
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword
    this._loadBlogList()
  },
})
