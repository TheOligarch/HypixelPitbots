require('dotenv').config()
const mineflayer = require('mineflayer')
const {
    pathfinder,
    Movements,
    goals: {
        GoalNear
    }
} = require('mineflayer-pathfinder')
for (var i = 0; i !== parseInt(process.env.AMOUNT); i++) {
    (async () => {
        const bot = await mineflayer.createBot({
            host: 'localhost',
            username: require('crypto').randomBytes(4).toString('hex'),
            version: "1.8.9"
        })
        await bot.loadPlugin(pathfinder)
        const mcData = require('minecraft-data')(bot.version)
        bot.on('chat', async (username, message) => {
            if (username === bot.username) return
            await bot.chat(message)
        })
        bot.on('login', async () => {
            console.log(`${bot.username} has joined ${bot._client.socket._host}`)
        })
        bot.on('spawn',async()=>{
            await bot.pathfinder.setMovements(new Movements(bot, mcData))
            await bot.pathfinder.setGoal(new GoalNear(-195, 68, 266, 0))
        })
        bot.on('kicked', console.log)
        bot.on('error', console.log)
    })()

}