import Command from "../../core/Command";
import Bot from "../../core/Client";
import {Message} from "discord.js";

class Ping extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "ping",
            description: "Latence du bot + réponse API.",
            usage: "ping",
            category: 'Général'
        });
    }

    async run(message: Message) {
        try {
            const msg = await message.channel.send("Ping!🏓");
            msg.edit(
                `Pong !🏓\n Latence bot: ${msg.createdTimestamp -
          message.createdTimestamp}ms.`
            );
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Ping;
