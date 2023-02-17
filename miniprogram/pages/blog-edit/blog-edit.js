// 输入文字最大个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9
Page({
  data: {
    // 输入文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,
  },
  onLoad(options) {
    console.log(options)
  },
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum,
    })
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
  onShareAppMessage() {
    return {
      title: '',
    }
  },
})
