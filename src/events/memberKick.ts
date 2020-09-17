import Bot from "../core/Client";
import {GuildMember, Message, MessageEmbed} from "discord.js";

module.exports = class {
    private readonly client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run(message: Message, member: GuildMember, reason: string) {
        const fetchGuildAuditLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK'
        });
        const latestmemberKick = fetchGuildAuditLogs.entries.first();
        const { executor } = latestmemberKick
        const embed = new MessageEmbed()
            .setAuthor(executor.username, executor.displayAvatarURL())
            .setDescription(`${member} a été kick par ${executor.tag}`)
            .setFooter(`(ID: ${member.id})`)
            .setTimestamp(new Date())
            .setColor(4437377)
        message.channel.send(embed)
    }
};