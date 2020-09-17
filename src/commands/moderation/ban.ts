import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageEmbed} from "discord.js";
import config from "../../config/mainConfig";

class Ban extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "ban",
            description: "Permet de ban un utilisateur",
            usage: "ban",
            category: 'Modération'
        });
    }

    async run(message: Message, args: string[]) {
        message.delete();
        const bannedMember = message.guild.member(message.mentions.users.first());
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
        if (!bannedMember) return message.channel.send(`${errorEmoji} `+"L'utilisateur n'existe pas !");
        if (bannedMember.hasPermission('ADMINISTRATOR')) return message.reply(`${errorEmoji} `+'Vous ne pouvez pas warn cet utilisateur')
        const banReason = args.join(" ").slice(22);
        if (!banReason) return message.channel.send(`${errorEmoji} `+`${message.author}, Vous devez mettre une raison !`);
        bannedMember.ban({reason: `${banReason}`});
        bannedMember.send(`Vous avez été banni du serveur ${message.guild.name} pour cette raison: ${banReason}`)
        const fetchGuildAuditLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD'
        });
        const latestBanAdd = fetchGuildAuditLogs.entries.first();
        const { executor, reason } = latestBanAdd
        const embed = new MessageEmbed()
            .setAuthor('Ban LOG', message.guild.iconURL())
            .setFooter(`Ban LOG`)
            .setTimestamp(new Date())
            .setColor(4437377)
            .setThumbnail(bannedMember.user.displayAvatarURL())
            .addFields([{
                name: "Modérateur",
                value: `${executor}`,
            },
                {
                    name: "Personne ban",
                    value: `${bannedMember}`,
                },{
                    name: "Raison",
                    value: reason
                }])
        message.channel.send(embed)
    }
}

module.exports = Ban;