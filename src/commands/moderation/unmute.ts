import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageEmbed} from "discord.js";
import config from "../../config/mainConfig";

class UnMute extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "unmute",
            description: "Permet de mute un utilisateur",
            usage: "unmute",
            category: 'Modération'
        });
    }

    async run(message: Message, args: string[]) {
        const muteMember = message.guild.member(message.mentions.users.first());
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
        if (!muteMember) return message.channel.send(`${errorEmoji} `+"L'utilisateur n'existe pas !");
        const muteRole = muteMember.roles.cache.find(x => x.name === "muted");
        if (!muteRole) return message.channel.send(`${errorEmoji} `+'Cette utilisateur n\'est pas mute')
        await muteMember.roles.remove(muteRole, (args.slice(1).join(' ') ? args.slice(1).join(' ') : 'Aucune raison spécifié'))
        const embed = new MessageEmbed()
            .setAuthor('Mute LOG', message.guild.iconURL())
            .setFooter(`Mute LOG`)
            .setTimestamp(new Date())
            .setColor(4437377)
            .setThumbnail(muteMember.user.displayAvatarURL())
            .addFields([{
                name: "Modérateur",
                value: `${message.author}`,
            },
                {
                    name: "Personne mute",
                    value: `${muteMember}`,
                },{
                    name: "Raison",
                    value: (args.slice(1).join(' ')) ? args.slice(1).join(' ') : 'Aucune raison spécifié'
                }])
        message.channel.send(embed)
    }
}

module.exports = UnMute;