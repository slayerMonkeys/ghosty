import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageEmbed} from "discord.js";
import {readdirSync} from "fs";
import * as path from "path";

class Help extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "help",
            description: "Affiche la liste des commandes du bot",
            usage: "help",
            category: 'Général'
        });
    }

    async run(message: Message) {
        const evtFiles = await readdirSync(path.resolve(__dirname, "../../events"));
        const embed = new MessageEmbed()
            .setDescription('Le préfixe actuel sur le serveur est '+`\`${this.client.prefix}\``+'\n\n'+'Nombre totale de commandes: '+ `**${this.client.commands.size}**`+
            '\n'+'Nombre total d\'évents: '+`**${evtFiles.length}**`)
        let x = "";
        this.client.commands.array().sort((p, c) =>
            p.help.category > c.help.category ?
                1 :
                p.help.name > c.help.name && p.help.category === c.help.category ?
                    1 :
                    -1).forEach(cmd => {
            const cat = cmd.help.category;
            if(x !== cat) {
                const emojiCat = require('../../utils/emojiCat.json')[cat]
                embed.addField(`${emojiCat} • ${cat} - (${this.client.commands.filter(c => c.help.category === cat).size})`, `\`${this.client.commands.filter(c => c.help.category === cat).map(c => c.help.name).join('\`, \`')}\``)
                x = cat
            }
        });
        message.channel.send(embed)

    }
}

module.exports = Help;