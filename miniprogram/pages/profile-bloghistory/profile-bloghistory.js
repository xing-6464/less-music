const MAX_LIMIT = 10

Page({
  data: {
    blogList: [],
  },
  onLoad(options) {
    this._getListByCloudFn()
  },
  _getListByCloudFn() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud
      .callFunction({
        name: 'blog',
        data: {
          $url: 'getListByOpenid',
          start: this.data.blogList.length,
          count: MAX_LIMIT,
        },
      })
      .then((res) => {
        this.setData({
          blogList: this.data.blogList.concat(res.result),
        })
        wx.hideLoading()
      })
  },
  goComment(event) {
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },
  onReachBottom() {
    this._getListByCloudFn()
  },
  onShareAppMessage(event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`,
    }
  },
})
