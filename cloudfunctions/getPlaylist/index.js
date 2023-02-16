// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

const axios = require('axios')

const code = 'E376C51D587B7BEB'
const URL = `https://apis.imooc.com/personalized?icode=${code}`

const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 实现获取数据库100限制
  const countResult = await playlistCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = playlistCollection
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  let list = {
    data: [],
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }

  const { data } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const playlist = data.result
  console.log('playlist', playlist)

  // 去重
  let newData = []
  if (list.data.length === 0) {
    newData = [...playlist]
  } else {
    for (let i = 0, len1 = playlist.lenght; i < len1; i++) {
      let fleg = true
      for (let j = 0, len2 = list.data.length; j < len2; j++) {
        if (playlist[i].id === list.data[j].id) {
          flag = false
          break
        }
        if (flag) {
          newData.push(playlist[j])
        }
      }
    }
  }
  console.log(newData)

  if (newData.length > 0) {
    await playlistCollection
      .add({
        data: [...newData],
      })
      .then((res) => {
        console.log('插入成功')
      })
      .catch((err) => {
        console.log('插入失败')
      })
  }

  return newData.length
}
