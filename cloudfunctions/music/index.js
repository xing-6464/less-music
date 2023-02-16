// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud
      .database()
      .collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('trackNumberUpdateTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    const res = await axios.get(
      BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId)
    )

    ctx.body = JSON.parse(res)
  })

  return app.serve()
}
