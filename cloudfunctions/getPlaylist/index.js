// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

const axios = require('axios')

const code = 'E376C51D587B7BEB'
const URL = `https://apis.imooc.com/personalized?icode=${code}`

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const playlist = data.result
  console.log(playlist)

  if (playlist.lenght > 0) {
    await db
      .collection('playlist')
      .add({
        data: [...playlist],
      })
      .then((res) => {
        console.log('插入成功')
      })
      .catch((err) => {
        console.log('插入失败')
      })
  }
}
