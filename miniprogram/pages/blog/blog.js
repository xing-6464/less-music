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
    this.setData({
      modalShow: true,
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
})
