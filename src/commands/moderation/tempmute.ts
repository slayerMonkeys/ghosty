import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageEmbed} from "discord.js";
import config from "../../config/mainConfig";

class TempMute extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "tempmute",
            description: "Permet de mute un utilisateur temporairement",
            usage: "tempmute",
            category: 'Modération'
        });
    }

    async run(message: Message, args: string[]) {
        const muteMember = message.guild.member(message.mentions.users.first());
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
        if (!muteMember) return message.channel.send(`${errorEmoji} `+"L'utilisateur n'existe pas !");
        const muteMemberhasRole = muteMember.roles.cache.find(x => x.name === 'muted')
        if(muteMemberhasRole) return message.channel.send(`${errorEmoji} `+'L\'utilisateur est déjàs mute')
        let muteRole = message.guild.roles.cache.find(x => x.name === "muted");
        if (muteMember.hasPermission('MANAGE_MESSAGES')) return message.reply(`${errorEmoji} `+'Vous ne pouvez pas mute cet utilisateur')
        try {
            if (!muteRole) {
                muteRole = await message.guild.roles.create({
                    data: {
                        name: "muted",
                        color: "#000",
                        position: message.guild.roles.cache.size - 1,
                        permissions: []
                    }
                });
            }
            message.guild.channels.cache.forEach(async channel => {
                await channel.overwritePermissions([
                    {
                        id: muteRole.id,
                        deny: ["SPEAK", "CONNECT", "ADD_REACTIONS", "SEND_MESSAGES"]
                    }
                ]);
            });

        } catch (e) {
            console.log(e.stack);
        }
        let muteTime = Number(args[1]);
        if (!muteTime) return message.channel.send(`${errorEmoji} `+"Spécifier une durée.");
        if(isNaN(muteTime)) return message.channel.send(`${errorEmoji} `+"Durée non valide.");
        await muteMember.roles.add(muteRole, (args.slice(2).join(' ') ? args.slice(2).join(' ') : 'Aucune raison spécifié'));
        const embed = new MessageEmbed()
            .setAuthor('TmpMute LOG', message.guild.iconURL())
            .setFooter(`TmpMute LOG`)
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
                },
                {
                    name: "Durée",
                    value: `${muteTime} ms`
                }])
        message.channel.send(embed)

        message.channel
            .send(`<@${muteMember.id}> est muté pour ${muteTime}`)
            .then(message => message.delete( { timeout: 8000 }));
        setTimeout(() => {
            muteMember.roles.remove(muteRole.id);
            message.channel.send(`<@${muteMember.id}> n'est plus mute.`)
                .then(message => message.delete({ timeout: 8000 }));
        }, muteTime);
    }
}

module.exports = TempMute;