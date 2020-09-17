import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message} from "discord.js";
import config from "../../config/mainConfig";

class Kick extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "kick",
            description: "Permet de kick un utilisateur",
            usage: "kick",
            category: 'Modération'
        });
    }

    async run(message: Message, args: string[]) {
        const kickMember =  message.guild.member(message.mentions.users.first());
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        if (!kickMember) return message.channel.send(`${errorEmoji} `+"L'utilisateur n'existe pas !");
        const reason = args.join(" ").slice(22);
        if (!reason) return message.channel.send(`${errorEmoji} `+`${message.author}, Vous devez mettre une raison !`);
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
        if (kickMember.hasPermission('ADMINISTRATOR')) return message.reply(`${errorEmoji} `+'Vous ne pouvez pas kick cet utilisateur')
        kickMember.kick(reason);
        kickMember.send(`Vous avez été kick du serveur ${message.guild.name} pour cette raison: ${reason}`)
        // @ts-ignore
        this.client.emit('memberKick', kickMember, reason)
    }
}

module.exports = Kick;