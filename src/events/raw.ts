import Bot from "../core/Client";
import config from "../config/mainConfig";

module.exports = class {
    private client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run(event) {
        const roleReactionEvents = {
            MESSAGE_REACTION_ADD: 'messageReactionAdd',
            MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
        }
        if(!roleReactionEvents.hasOwnProperty(event.t)) return
        const { d: data } = event;
        const user = this.client.users.cache.get(data.user_id);
        const channel = this.client.channels.cache.get(data.channel_id);

        //@ts-ignore
        const message = await channel.messages.fetch(data.message_id);
        const member = message.guild.members.cache.get(user.id);

        let embedFooterText;
        if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

        if (
            (message.author.id === this.client.user.id) && (message.content !== config.initialMessage)
        ) {

                const re = `\\*\\*"(.+)?(?="\\*\\*)`;
                const role = message.content.match(re)[1];

                if (member.id !== this.client.user.id) {
                    const guildRole = message.guild.roles.cache.find(r => r.name === role);
                    if (event.t === "MESSAGE_REACTION_ADD") member.roles.add(guildRole.id);
                    else if (event.t === "MESSAGE_REACTION_REMOVE") member.roles.remove(guildRole.id);
                }

        }
    }
};