import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Emoji, Message, MessageEmbed, Role} from "discord.js";
import config from "../../config/mainConfig";

class Rearoleinit extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "rearoleinit",
            description: "initialise le message deu role reaction",
            usage: "rearoleinit",
            category: 'Générale'
        });
    }

    private generateMessages(roles, reactions) {
        return roles.map((r, e) => {
            return {
                role: r,
                message: `Réagissez ci-dessous pour obtenir le rôle **"${r}"**`,
                emoji: reactions[e]
            };
        });
    }

    async run(message: Message, args: string[]) {
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
        message.channel.send(config.initialMessage);
        const roles: string[] = [];
        const react: string[] = [];
        try {
            const messages = this.generateMessages(roles, react);
            for (const {role, message: msg, emoji} of messages) {
                if (!message.guild.roles.cache.find((r: Role) => r.name === role)) return message.channel.send(`${errorEmoji} `+`Le role \`${role}\` n'éxiste pas`);
                message.channel.send(`${msg}`).then(async (m: Message) => {
                    const customCheck: Emoji = message.guild.emojis.cache.find((e: Emoji) => e.name === emoji);
                    if (!customCheck) await m.react(emoji)
                    else await m.react(customCheck.id)
                })
            }
        } catch (e) {
            return console.log(e)
        }

        message.delete();
    }
}

module.exports = Rearoleinit;