import {GuildMember, Message, MessageEmbed} from "discord.js"
import Bot from "../core/Client";

module.exports = class {
    private readonly client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run(client: any, message: Message, member: GuildMember, reason: string) {
        const embed = new MessageEmbed()
            .setColor(4437377)
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
                    name: "Utilisateur Warn",
                    value: `${member}`,
                },
                {
                    name: "Raison",
                    value: `${reason}`,
                },
            ])
        message.channel.send(embed)
    }
}
