import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message} from "discord.js";
import config from "../../config/mainConfig";

class Leave extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "leave",
            description: "Le bot quitte le salon vocal",
            usage: "leave",
            category: 'Musique'
        });
    }

    async run(message: Message) {
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        const voiceChannel = message.member.voice.channel;
        const currentPlayer = this.client.musicPlayer.get(message.guild.id);
        ((currentPlayer && voiceChannel) && (currentPlayer.voiceChannel.id === voiceChannel.id))?
            this.client.destroyMusicClient(message.guild.id): message.channel.send(`${errorEmoji} `+'Veuillez rejoindre le même salon que le bot!');
    }
}

module.exports = Leave;
