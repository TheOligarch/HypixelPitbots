module.exports = {
    name: ["view-connected-bots-amount"],
    category: "Pit",
    description: "Evaluation command for developers",
    options: [
    {
        name: "ephemeral",
        description: "Should the reply be an empheral? False by default",
        type: "BOOLEAN"
    }
],
    execute(interaction, client, paguClient) {
        const embed = new paguClient.Discord.MessageEmbed()
        .setFooter(interaction.user.tag + ' | ' + client.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTimestamp()
        .setTitle(`Connected Bots Amount`)
        .addFields(
            {name: 'Bot amount', value: paguClient.options.options.customPasses.ws.clients.size.toString()}
        )
        interaction.reply({embeds:[embed], ephemeral: interaction.options.getBoolean('ephemeral')??false});
    }}