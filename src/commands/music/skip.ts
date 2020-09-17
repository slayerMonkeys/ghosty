import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message} from "discord.js";
import config from "../../config/mainConfig";

class Skip extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "skip",
            description: "Passe à la musique suivante",
            usage: "skip",
            category: 'Musique'
        });
    }

    async run(message: Message) {
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        const successEmoji = message.guild.emojis.cache.find(e => e.name === config.successEmoji);
        const voiceChannel = message.member.voice.channel;
        const currentPlayer = this.client.musicPlayer.get(message.guild.id);
        if(!(currentPlayer && voiceChannel) && (currentPlayer.voiceChannel.id === voiceChannel.id))
            return message.channel.send(`${errorEmoji} `+'Veuillez rejoindre le même salon que le bot!')
        const membersInChannel = voiceChannel.members.filter(m => !m.user.bot);
        if(membersInChannel.size === 1) {
            currentPlayer.stop();
            message.channel.send(`${successEmoji} `+`Skip: ${currentPlayer.queue[0].title}`);
        } else {
            const msg = await message.channel.send(`Votes requis: ${membersInChannel.size}`);
            await msg.react("✅");
            await msg.react("❌");

            const filter = (r, u) => {
                if(u.bot) return false;
                const isMembersInChannel = message.guild.members.cache.get(u.id).voice.channel;
                if(isMembersInChannel) {
                    if(isMembersInChannel.id === currentPlayer.voiceChannel.id) {
                        return ['✅', '❌'].includes(r.emoji.name);
                    }
                    return false;
                } else {
                    return false;
                }
            }

            const callback = await msg.awaitReactions(filter, {
                max: membersInChannel.size,
                time: 10000,
                errors: ['time']
            });
            const votes = callback.get('✅').users.cache.filter(u => !u.bot);
            if(votes.size >= membersInChannel.size) currentPlayer.stop();
            message.channel.send(`Skip: ${currentPlayer.queue[0].title}`);
        }
    }
}

module.exports = Skip;
