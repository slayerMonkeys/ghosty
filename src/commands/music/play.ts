import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message, MessageCollector, MessageEmbed} from "discord.js";
import Util from "../../utils";
import {Player} from "erela.js";
import config from "../../config/mainConfig";

class Play extends Command {
    private util: Util;
    constructor(client: Bot) {
        super(client, {
            name: "play",
            description: "Cherche et joue la musique souhaité dans un channel vocal",
            usage: "play <nameMusic>",
            category: 'Musique'
        });
        this.util = new Util();
    }

    async run(message: Message, args: string[]) {
        const errorEmoji = message.guild.emojis.cache.find(e => e.name === config.errorEmoji);
        const successEmoji = message.guild.emojis.cache.find(e => e.name === config.successEmoji);
        const { channel } = message.member.voice;
        if(!channel) return message.channel.send(`${errorEmoji} `+'Veuillez rejoindre un salon vocal!');
        let embedDescrption = `Voici les 5 résultats de la recherche: \`${args.join(' ')}\`\n\n`
        const player: Player = this.client.music.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel
        });
        this.client.musicPlayer.set(message.guild.id, player);
        try {
            let trackNumber = 0;
            const musicSearchResults = await this.client.music.search(args.join(' '), message.author);
            const tracks = await musicSearchResults.tracks.slice(0, 5);
            tracks.forEach(r => embedDescrption +=`**${++trackNumber}.** [${r.title}](${r.uri})\n`)
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(embedDescrption)
            message.channel.send(embed);

            const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
            const userEntry = await message.channel.awaitMessages(filter, {
                time: 20000,
                max: 1,
                errors: ['time']
            });
            if(!userEntry) return
            const firstUserEntry = Number(userEntry.first().content);
            const musicPlayer = this.client.musicPlayer.get(message.guild.id);
            const track = tracks[firstUserEntry-1];
            await musicPlayer.queue.add(track);
            message.channel.send(`${successEmoji} `+`${track.title} a été ajouter à la liste de lecture`);
            if(!musicPlayer.playing) musicPlayer.play();
        } catch (e) {
            console.log(e)
            return message.channel.send(`${errorEmoji} `+'Problème avec le client, essayer à nouveau!');
        }

    }
}

module.exports = Play;
