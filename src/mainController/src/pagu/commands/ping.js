"use strict";
module.exports = {
    name: ["ping", "latency"],
    category: "Utility",
    description: "Shows the bot latency.",
    usage: "ping",
    examples: [
        "ping"
    ],
    execute(interaction, client, paguClient) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(interaction.user.tag + ' | ' + client.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTimestamp()
            .setTitle(`${client.user.username} Ping`)
            .addFields({ name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }, { name: "Api Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true });
        interaction.reply({embeds:[embed]});
    }
};
