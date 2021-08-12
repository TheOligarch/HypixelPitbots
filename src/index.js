require('dotenv').config()
const mineflayer = require('mineflayer')
const {
    pathfinder,
    Movements,
    goals: {
        GoalNear
    }
} = require('mineflayer-pathfinder')
async function createMultiple(bots, constructor) {
    const { Worker, isMainThread, workerData } = require('worker_threads')
    if (isMainThread) {
      const threads = []
      for (const i in bots) {
          console.log(bots[i], false)
        await threads.push(new Worker(__filename, { workerData: bots[i] }))
      }
    } else {
      constructor(workerData)
    }
  }
  
createMultiple([ 'e1ad5b39', 'b854dbab', '4c846ad3', '2dc53541', '395e3f29' ], async(username)=>{
        const bot = await mineflayer.createBot({
            host: 'localhost',
            username: username,
            version: "1.8.9"
        })
        await bot.loadPlugin(pathfinder)
        console.log(bot.pathfinder.movements.maxDropDown)
        bot.pathfinder.movements.maxDropDown  = 256
        console.log(bot.pathfinder.movements.maxDropDown)
        const mcData = require('minecraft-data')(bot.version)
        bot.on('login', async () => {
            console.log(`${bot.username} has joined ${bot._client.socket._host}`)
        })
        bot.on('spawn',async()=>{
            bot.chat(`Spawned ${bot.username}`, new Date().toLocaleDateString)
            
            await bot.pathfinder.setMovements(new Movements(bot, mcData))
            await bot.pathfinder.setGoal(new GoalNear(-4,114,5, 0))
        })
        bot.on('kicked', console.log)
        bot.on('error', console.log)
        bot.on('leave', console.log)
})