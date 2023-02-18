// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event,
  })

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() !== '') {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i',
        }),
      }
    }

    const blogList = await blogCollection
      .skip(event.start)
      .where(w)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res.data
      })

    ctx.body = blogList
  })

  return app.serve()
}
