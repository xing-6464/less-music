// 输入文字最大个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9
// 数据库初始化
const db = wx.cloud.database()

let content = ''
let userInfo = {}

Page({
  data: {
    // 输入文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,
  },
  onLoad(options) {
    userInfo = options
  },
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum,
    })

    content = event.detail.value
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },
  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths),
        })
        // 还能选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true,
        })
      },
    })
  },
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images,
    })
    if (this.data.images.length === MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgSrc,
    })
  },
  send() {
    // 2.数据 -> 数据库
    // 数据库：内容、图片 fileID openID 昵称 头像 时间
    // 1.图片 -> 云存储 fileID 云文件ID

    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
    })

    const promiseArr = []
    let fileIds = []
    // 图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      const p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath:
            'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          },
        })
      })

      promiseArr.push(p)
    }
    // 存储到云数据库
    Promise.all(promiseArr)
      .then((res) => {
        db.collection('blog')
          .add({
            data: {
              ...userInfo,
              content,
              img: fileIds,
              createTime: db.serverDate(), // 服务端时间
            },
          })
          .then((res) => {
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
            })

            // 返回blog页面，并且刷新
            wx.navigateBack()
            const pages = getCurrentPages()
            // 获取上一个页面
            const prevPage = pages[pages.length - 2]

            prevPage.onPullDownRefresh()
          })
      })
      .catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
  },
})
