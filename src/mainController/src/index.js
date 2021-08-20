require('dotenv').config()
const express = require('express');
const app = express();
const chalk = require('chalk')
const https = require('https')
const fs = require('fs')
const ws = require('ws');
console.log(process.env.DISCORDTOKEN)

const discord = require('discord.js')
const Client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] })
Client.login(process.env.DISCORDTOKEN)


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
    ws.on('message', function incoming(data) {

    });
})