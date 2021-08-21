"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
const Chalk = require("chalk");
module.exports = function (options, paguClient) {
    try {
        function registerCommands(path) {
            fs.readdirSync(path).forEach((file) => {
                if (fs.lstatSync(Path.join(path, file)).isDirectory()) {
                    registerCommands(Path.join(Path.join(process.cwd(), options.options.commandDir ?? "dist/src/Commands"), file));
                }
                else {
                    const commandFile = require(Path.join(path, file));
                    var category = "None";
                    if (!commandFile.category) {
                        paguClient.Util.log(__filename, "warn", `${file} doesn't contain a category and such will be put in the None category.`);
                    }
                    else
                        category = commandFile.category;
                    if (commandFile.name) {
                        if (commandFile.name[0]) {
                            paguClient.commands.set(file, { commandFile: commandFile, cache: { category: category, loaded: true, name: file } });
                            for (const alias of commandFile.name) {
                                options.client.on('interactionCreate', async(interaction) => {
                                    if (!interaction.isCommand()) return;
                                    // if (interaction.commandName == ) {
                                        // await interaction.reply('Pong!');
                                    // }
                                    if ((interaction.commandName == `${alias}`) && interaction.guild !== null) {
                                        // if(message.guild.id=="835220768110805043") return message.reply('no')
                                        if ((commandFile.perms && !interaction.member.hasPermission(commandFile.perms, { checkAdmin: true, checkOwner: true })) && interaction.author.id !== "406920919131488268") {
                                            return interaction.reply(`You are missing permissions to use this command.`);
                                        }
                                        else {
                                            async function checkCooldown() {
                                                var returnBoolean = true;
                                                if (paguClient.cache.internal.cooldowns[commandFile.name[0]] > Date.now()) { }
                                                else {
                                                    paguClient.cache.internal.cooldowns[commandFile.name[0]] = Date.now() + commandFile.cooldown;
                                                    returnBoolean = false;
                                                }
                                                return returnBoolean;
                                            }
                                            if (commandFile.cooldown && await checkCooldown())
                                                return interaction.reply(`You are currently on cooldown for ${await paguClient.Util.findTimeUntil(new Date(), paguClient.cache.internal.cooldowns[commandFile.name[0]])}`);
                                            commandFile.execute(interaction, options.client, paguClient);
                                        }
                                        // 
                                    }
                                })
                                // options.client.on('messageCreate', async (message) => {
                                //     if (message.author.bot)
                                //         return;
                                //     var args = message.content.split(/[ ]+/);
                                //     if ((args[0].toLowerCase() == `${process.env.PREFIX}${alias}` || (message.mentions.has(options.client.user) && args[1] == alias)) && message.guild !== null) {
                                //         // if(message.guild.id=="835220768110805043") return message.reply('no')
                                //         args.shift();
                                //         if ((commandFile.perms && !message.member.hasPermission(commandFile.perms, { checkAdmin: true, checkOwner: true })) && message.author.id !== "406920919131488268") {
                                //             return message.reply(`You are missing permissions to use this command.`);
                                //         }
                                //         else {
                                //             async function checkCooldown() {
                                //                 var returnBoolean = true;
                                //                 if (paguClient.cache.internal.cooldowns[commandFile.name[0]] > Date.now()) { }
                                //                 else {
                                //                     paguClient.cache.internal.cooldowns[commandFile.name[0]] = Date.now() + commandFile.cooldown;
                                //                     returnBoolean = false;
                                //                 }
                                //                 return returnBoolean;
                                //             }
                                //             if (commandFile.cooldown && await checkCooldown())
                                //                 return message.reply(`You are currently on cooldown for ${await paguClient.Util.findTimeUntil(new Date(), paguClient.cache.internal.cooldowns[commandFile.name[0]])}`);
                                //             commandFile.execute(message, args, options.client, paguClient);
                                //         }
                                //         // 
                                //     }
                                // });
                            }
                        }
                    }
                    else {
                        paguClient.commands.set(file, { commandFile: commandFile, cache: { category: category, loaded: false, name: file } });
                        paguClient.Util.log(__filename, "warn", `${file} doesn't contain a name and such will not be loaded`);
                    }
                }
            });
        }
        let path = Path.join(process.cwd(), options.options.commandDir ?? "dist/src/Commands");
        if (!fs.existsSync(path))
            path = Path.join(__dirname, "dist/src/commands");
        if (!fs.existsSync(path))
            throw "The \"commands\" folder could not be found \n Try putting initalizing the client with a commandDir leading to your commands folder.";
        Promise.all([registerCommands(path), registerCommands(Path.join(process.cwd(), "/src/pagu/commands"))]);
        var commands = new Array();
        paguClient.commands.forEach((command) => {
            let name = Chalk.yellowBright(Path.basename(command.cache.name, Path.extname(command.cache.name)));
            if (command.commandFile.name) {
                if (command.commandFile.name[0]) {
                    name = Chalk.cyanBright(command.commandFile.name[0]);
                }
            }
            commands.push({
                name: name,
                loaded: command.cache.loaded
            });
        });
        console.table(commands.reduce((acc, { name, ...x }) => { acc[name] = x; return acc; }, {}));
    }
    catch (e) {
        paguClient.Util.log(__filename, "error", e, true);
    }
};
