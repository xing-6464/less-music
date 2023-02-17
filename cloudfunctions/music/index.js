// 云函数入口文件
const cloud = require('wx-server-sdk')
// const axios = require('axios')
const axios = require('axios/dist/node/axios.cjs')

const TcbRouter = require('tcb-router')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const ICODE = 'icode=E376C51D587B7BEB'
const BASE_URL = 'https://apis.imooc.com'

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
      `${BASE_URL}/playlist/detail?id=${event.playlistId}&${ICODE}`
    )

    ctx.body = res.data
  })

  app.router('songdetail', async (ctx, next) => {
    let str = ''
    for (let i = 0; i < event.trackIds.length; i++) {
      str += event.trackIds[i].id + ','
    }

    let newstr = str.substring(0, str.length - 1)
    console.log(newstr)
    const res = await axios.get(
      `${BASE_URL}/song/detail?ids=${newstr}&${ICODE}`
    )

    ctx.body = res.data
  })

  app.router('musicUrl', async (ctx, next) => {
    const res = await axios.get(
      `${BASE_URL}/song/url?id=${event.musicId}&${ICODE}`
    )

    ctx.body = res.data
  })

  app.router('lyric', async (ctx, next) => {
    const res = await axios.get(
      `${BASE_URL}/lyric?id=${event.musicId}&${ICODE}`
    )

    ctx.body = res.data
  })

  return app.serve()
}
