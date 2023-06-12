// 引用 dotenv 讀取 .env
import 'dotenv/config'
// 引用 linebot
import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  // process.env 為 node.js 的環境變數
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://media.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json')
      for (const info of data.XML_Head.Infos.Info) {
        if (info.Name === event.message.text) {
          event.reply([
            info.Description,
            {
              type: 'location',
              title: info.Name,
              address: info.Add,
              latitude: info.Py,
              longitude: info.Px
            }
          ])
          return
        }
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人已啟動')
})
