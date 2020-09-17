import Bot from "../core/Client";

module.exports = class {
    private client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;
        if (message.content.indexOf(this.client.prefix) !== 0) return;
        const args = message.content
            .slice(this.client.prefix.length)
            .trim()
            .split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        this.client.logger.log(`${message.author.username} (ID: ${message.author.id}) lance la commande ${cmd.help.name}`);
        cmd.run(message, args);
    }
};
