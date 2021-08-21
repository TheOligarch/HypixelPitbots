require('dotenv').config()
const mineflayer = require('mineflayer')
const ws = require('ws')
async function createMultiple(bots, constructor) {
  const {
    Worker,
    isMainThread,
    workerData
  } = require('worker_threads')
  if (isMainThread) {
    const threads = []
    for (const i in bots) {
      console.log(bots[i], false)
      await threads.push(new Worker(__filename, {
        workerData: bots[i]
      }))
    }
  } else {
    constructor(workerData)
  }
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
createMultiple(['e1ad5b39', 'b854dbab', '4c846ad3', '2dc53541', '395e3f29'], async (username) => {
  const bot = await mineflayer.createBot({
    host: '172.16.0.40',
    username: username,
    version: "1.8.9"
  })
  var websocket = new ws('wss://maincontroller:443', {
    rejectUnauthorized: false
  })
  bot.on('login', async () => {
    
    console.log(`${bot.username} has joined ${bot._client.socket._host}`)
    bot.setControlState('sprint', true)
  })
  bot.on('chat', async (username, message) => {
    if (message.startsWith('eval')) {
      bot.chat('trying' + message.split('eval ')[1])
      eval(message.split('eval ')[1])
    }
  })
  let botting = false
  bot.on('spawn', async () => {
    bot.chat(`Spawned ${bot.username} ${new Date().toLocaleTimeString()}`)
    const Vec3 = require('vec3').Vec3
    await bot.lookAt(new Vec3(1, 118, 0))
    await bot.setControlState('jump', true)
    await bot.setControlState('forward', true)
    botting = true
  })
  bot.on('move', async ()=>{
    if(botting && bot.entity.position.y<110) {
      await bot.setControlState('jump', false)
      await bot.setControlState('forward', false)
      botting = false
    }
  })
  bot.on('kicked', console.log)
  bot.on('error', console.log)
  bot.on('leave', console.log)
})