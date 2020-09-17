import {GuildMember, Message, MessageEmbed, TextChannel} from "discord.js"
import Bot from "../core/Client";

module.exports = class {
    private readonly client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run(client: any, message: Message, member: GuildMember, warn: any, numero: number) {
        const embed = new MessageEmbed()
            .setColor(16729871)
            .setTimestamp(new Date())
            .setFooter('Warn LOG', client.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor('Warn LOG', message.guild.iconURL())
            .addFields([
                {
                    name: "Modérateur",
                    value: `${message.author}`,
                },
                {
                    name: "Utilisateur qui avait le warn",
                    value: `${member}`,
                },
                {
                    name: "info du warn",
                    value: `Raison: ${warn.rows.reason}\n Numéro: ${numero}`,
                },
            ])
        message.channel.send(embed)
    }
}
