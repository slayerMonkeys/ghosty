import Command from "../../core/Command";
import Bot from "../../core/Client";
import {GuildMember, Message, MessageEmbed} from "discord.js";
import WarnService from "../../services/WarnService";
import * as moment from 'moment';
import config from "../../config/mainConfig";

class Warn extends Command {
    private warnService: WarnService;
    constructor(client: Bot) {
        super(client, {
            name: "warn",
            description: "Ajoute/Supprime un warn a un utilisateur ou donne la liste des warn de l\'utilisateur",
            usage: 'warn <Mention> <Raison> '+'warn <Mention> <IDwarn> '+'warn list <Mention>',
            category: 'Modération'
        });
        this.warnService = new WarnService()
    }

    async run(message: Message, args: string[]) {
        const warnMember: GuildMember = message.guild.member(message.mentions.users.first());
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);

        if (args[0] === 'list') {
            const warns = await this.warnService.getByUser(warnMember);
            if (warns.length < 1) return message.reply('Vous n\'avez aucun warn')
            const embed = new MessageEmbed()
                .setAuthor('Liste warn', warnMember.user.displayAvatarURL())
                .setThumbnail(warnMember.user.displayAvatarURL())
                .setColor('RANDOM')
                .setFooter(`Liste warn (user:${warnMember.id})`, warnMember.user.displayAvatarURL())
                .setTimestamp(new Date())
            for (let i = 0; i < warns.length; i++) {
                const warn = warns[i];
                embed.addField(`Warn: ${i+1}`, `Raison: ${warn.reason}\nDate du warn: ${moment(warn.createdAt).format('DD/MM/YYYY')}`)
            }
            message.channel.send(embed)
        } else if (args[0] === 'remove') {
            if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
            const warns: any[] = await this.warnService.getByUser(warnMember);
            if (!warns) return message.reply(`${errorEmoji} `+'Cet utilisateur n\'a pas de warn à supprimer');
            const warnsize = await this.warnService.count(warnMember);
            if(warnsize < 0 || warnsize < args[2]) return message.reply(`${errorEmoji} `+'Warn invalid !');
            const cb = await this.warnService.remove(warnMember, Number(args[2]));
            if (cb) {
                // @ts-ignore
                this.client.emit('warnRemove', message, warnMember, cb, args[2])
                return message.reply(`Vous avez supprimé le warn ${args[2]} de ${warnMember}`);
            } else return message.reply(`${errorEmoji} `+'Error !');
        } else {
            if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`${errorEmoji} `+'Vous n\'avez pas la permision de faire cela')
            const reason = args.slice(1).join(' ');
            if (!reason) return message.reply(`${errorEmoji} `+'Vous devez mettre une raison !');
            if (warnMember.hasPermission('MANAGE_MESSAGES')) return message.reply(`${errorEmoji} `+'Vous ne pouvez pas warn cet utilisateur')
            const cb = await this.warnService.create(warnMember, reason);
            cb.valid ? message.channel.send(`Vous avez mis un warn à ${warnMember.user.username}`) : message.channel.send(`${errorEmoji} `+'Error !');
            warnMember.send(`Vous avez été warn sur le serveur ${message.guild.name} pour cette raison: ${reason}`)
            // @ts-ignore
            this.client.emit("warnAdd", message, warnMember, reason);
            const warnsize = await this.warnService.count(warnMember);
            if (cb.valid === true && warnsize >= 4) return warnMember.ban({
                days: 7,
                reason: reason
            })
        }
    }
}

module.exports = Warn;