"use strict";
module.exports = {
    name: ["eval", "evaluate"],
    category: "Dev",
    description: "Evaluation command for developers",
    usage: "eval [code]",
    examples: [
        "eval 1+1",
        "eval paguClient.options.client.on('interactionCreate', interaction => {\nif(interaction.user.id==\"300669365563424770\")\n{ interaction.delete() }})",
        "eval paguClient.options.client.on('interactionCreate', interaction => {\nif(interaction.user.id==\"738857742474805370\")\n{ interaction.react(\"❤️\") })})"
    ],
    options: [{
        name: 'code',
        description: 'Code to evaluate.',
        type: 'STRING',
        required: true
    },
    {
        name: "ephemeral",
        description: "Should the reply be an empheral? False by default",
        type: "BOOLEAN"
    }
],
    hidden: ["dev"],
    defaultPermission: false,
    async execute(interaction, client, paguClient) {
        if (paguClient.options.options.devs.includes(interaction.user.id)) {
            try {
                const clean = (text) => {
                    if (typeof (text) === "string")
                        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                    else
                        return text;
                };
                const code = interaction.options.getString("code")
                var embed = new paguClient.Discord.MessageEmbed();
                embed.setFooter(interaction.user.tag + ' | ' + paguClient.options.client.user.username, interaction.user.displayAvatarURL({ dynamic: true }));
                embed.setColor("#0e8499")
                    .setTimestamp();
                if (code && code.length=="0") {
                    embed.setTitle('Eval - Syntax Error');
                    embed.setDescription('Please enter something to eval!');
                }
                else {
                    try {
                        var startTime = performance.now()
                        let evaled = await eval(code)
                        embed.setTitle(`Eval - Success \nEvaluation took: ${(performance.now()-startTime).toFixed(2)}MS`);
                        embed.setDescription(`\`\`\`xl\n${clean(evaled)}\n\`\`\``);
                    }
                    catch (e) {
                        paguClient.Util.log(__filename, "error", e, false);
                        embed.setTitle('Eval - Error');
                        embed.setDescription(`\`\`\`xl\n${clean(e)}\n\`\`\``);
                    }
                }
                interaction.reply({embeds:[embed], ephemeral: interaction.options.getBoolean('ephemeral')??false});
                
            }
            catch (e) {
                paguClient.Util.log(__filename, "error", e, true);
            }
        }
    }
};
