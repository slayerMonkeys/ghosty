import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageEmbed} from "discord.js";
import config from "../../config/mainConfig";

class Queue extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "queue",
            description: "Affiche la liste de lecture actuelle",
            usage: "queue",
            category: 'Musique'
        });
    }

    async run(message: Message) {
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        const voiceChannel = message.member.voice.channel;
        const currentPlayer = this.client.musicPlayer.get(message.guild.id);
        if(!(currentPlayer && voiceChannel) && (currentPlayer.voiceChannel.id === voiceChannel.id))
            return message.channel.send(`${errorEmoji} `+'Veuillez rejoindre le même salon que le bot!')
        const embed = new MessageEmbed()
            .setTitle("Liste de lecture:")
            .setDescription(`Actuelle: [${currentPlayer.queue[0].title}](${currentPlayer.queue[0].uri})`);
        for(let i = 0; i < currentPlayer.queue.length; i++) {
            const nextTracks = currentPlayer.queue.slice((i+1), 6);
            nextTracks.map(t => embed.addField(`${++i}. ${t.title}`, `${t.uri}`));
        }
        return message.channel.send(embed)
    }
}

module.exports = Queue;
