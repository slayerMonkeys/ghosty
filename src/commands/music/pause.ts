import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message} from "discord.js";
import config from "../../config/mainConfig";

class Pause extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "pause",
            description: "Met en pause la musique actuelle",
            usage: "pause",
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
        if(currentPlayer.playing) {
            currentPlayer.pause(true);
            message.channel.send(`${successEmoji} `+'Vous avez mis la musique en pause');
        } else {
            currentPlayer.pause(false);
            message.channel.send(`${successEmoji} `+'La musique n\'est plus en pause');
        }
    }
}

module.exports = Pause;
