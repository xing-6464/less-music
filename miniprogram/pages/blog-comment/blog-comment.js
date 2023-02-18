import formatTime from '../../utils/formatTime'

Page({
  data: {
    blog: {},
    commentList: [],
    blogId: '',
  },
  onLoad(options) {
    this.setData({
      blogId: options.blogId,
    })
    this._getBlogDetail()
  },
  _getBlogDetail() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    wx.cloud
      .callFunction({
        name: 'blog',
        data: {
          blogId: this.data.blogId,
          $url: 'detail',
        },
      })
      .then((res) => {
        let commentList = res.result.commentList.data
        for (let i = 0, len = commentList.length; i < len; i++) {
          commentList[i].createTime = formatTime(
            new Date(commentList[i].createTime)
          )
        }
        this.setData({
          commentList,
          blog: res.result.detail[0],
        })
        wx.hideLoading()
      })
  },
})
