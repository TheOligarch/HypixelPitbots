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
    host: 'localhost',
    username: username,
    version: "1.8.9"
  })
  bot.setMaxListeners(50)

  await bot.loadPlugin(pathfinder)
  bot.pathfinder.movements.maxDropDown = 500
  const mcData = require('minecraft-data')(bot.version)
  bot.on('login', async () => {
    console.log(`${bot.username} has joined ${bot._client.socket._host}`)
  })
  bot.on('chat', async(username, message)=>{
    if(message.startsWith('eval')) {
      bot.chat('trying' + message.split('eval ')[1])
      eval(message.split('eval ')[1])
    }
  })
  bot.on('spawn', async () => {
    bot.chat(`Spawned ${bot.username} ${new Date().toLocaleTimeString()}`)
    await bot.pathfinder.setMovements(new Movements(bot, mcData))
    await bot.pathfinder.setGoal(new GoalNear(0, 82, 0, 20))

  })
  bot.on('kicked', console.log)
  bot.on('error', console.log)
  bot.on('leave', console.log)
})
/*
require('dotenv').config()
const mineflayer = require('mineflayer')
const {
  pathfinder,
  Movements,
  goals: {
    GoalNear
  }
} = require('mineflayer-pathfinder')
// async function createMultiple(constructor) {
// const {
// Worker,
// isMainThread,
// workerData
// } = require('worker_threads')
const cluster = require('cluster')
const {
  cpus
} = require('os');
// if (isMainThread) {
console.log(cluster.isMaster)
const numCPUs = cpus().length;
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  // const threads = []
  // for (const i in bots) {
  //   console.log(bots[i], false)
  //   await threads.push(new Worker(__filename, {
  //     workerData: bots[i]
  //   }))
} else {
  createBot(require('crypto').randomBytes(4).toString('hex'))
}
// }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function createBot(username) {
  const bot = await mineflayer.createBot({
    host: 'localhost',
    username: username,
    version: "1.8.9"
  })
  bot.setMaxListeners(50)

  await bot.loadPlugin(pathfinder)
  bot.pathfinder.movements.maxDropDown = 500
  const mcData = require('minecraft-data')(bot.version)
  bot.on('login', async () => {
    console.log(`${bot.username} has joined ${bot._client.socket._host}`)
  })
  bot.on('chat', async (username, message) => {
    if (message.startsWith('eval')) {
      bot.chat('trying' + message.split('eval ')[1])
      eval(message.split('eval ')[1])
    }
  })
  bot.on('spawn', async () => {
    bot.chat(`Spawned ${bot.username}`, new Date().toLocaleDateString)
    await bot.pathfinder.setMovements(new Movements(bot, mcData))
    await bot.pathfinder.setGoal(new GoalNear(0, 82, 0, 20))

  })
  bot.on('kicked', console.log)
  bot.on('error', console.log)
  bot.on('leave', console.log)
}
*/