require('dotenv').config()
const express = require('express');
const app = express();
const chalk = require('chalk')
const https = require('https')
const fs = require('fs')
const ws = require('ws');
const Pagu = require('../pagu/pagu.js')
const discord = require('discord.js')
const Client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, "GUILD_MESSAGES"] })





const server = https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
}, app).listen(443, () => {
    console.log(chalk.greenBright(`Https Server Started.`))
})

app.get('/', (req,res)=>{
    res.send('hello')
})
const wsServer = new ws.Server({
    server: server
});
wsServer.on('connection', (ws) => {
    console.log('hello')
    ws.on('message', function incoming(data) {

    });
})
Client.on('ready', async() => {
    const PaguClient = await new Pagu.Client({
        client: Client, options: {
            customPasses: {
                ws: wsServer
            },
            mongoURI: process.env.MONGODB_URI,
            commandDir: "/src/src/commands",
            devs: [
                "406920919131488268"
            ],
            niceCategory: {
                dev: "<:dev:865771194531184661> Dev",
                utility: ":gear: Utility",
                none: ":question: None",
            },
            niceCommands: {
                
            }
        }
    });
})
Client.login(process.env.DISCORDTOKEN)