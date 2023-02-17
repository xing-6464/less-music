// 输入文字最大个数
const MAX_WORDS_NUM = 140
Page({
  data: {
    // 输入文字个数
    wordsNum: 0,
    footerBottom: 0,
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
  onShareAppMessage() {
    return {
      title: '',
    }
  },
})
