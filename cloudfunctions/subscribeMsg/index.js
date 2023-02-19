// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()

    cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'QWmKrfr1K9skTeDokBaCzD9INe6teSLxuA-G6cYlPkU',
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      data: {
        thing2: {
          value: event.content,
        },
        thing5: {
          value: '评论成功',
        },
      },
      miniprogramState: 'developer',
    })
  } catch (err) {
    console.log(err)
  }
}
