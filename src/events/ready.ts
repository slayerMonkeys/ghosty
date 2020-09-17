import Bot from "../core/Client";
import {ErelaClient} from "erela.js";

module.exports = class {
    private readonly client: Bot;

    constructor(client) {
        this.client = client;
    }

    async run() {
        console.log('ready !');
        //@ts-ignore
        this.client.emit('updateStat')
        setInterval(()=> {
            //@ts-ignore
            this.client.emit('updateStat')
        }, 10000)
        this.client.music = new ErelaClient(this.client, [
            {
                host: 'localhost',
                port: 8000,
                password: 'youshallnotpass'
            }
        ]);
        this.client.music.on("nodeConnect", node => console.log("New node connected"));
        this.client.music.on("nodeError", (node, error) => console.log(`Node error: ${error.message}`));
        this.client.music.on("trackStart", (player, track) => player.textChannel.send(`Lecture en cour de: ${track.title}`));
        this.client.music.on("queueEnd", player => {
            player.textChannel.send("La liste de lecture est vide.")
            this.client.music.players.destroy(player.guild.id);
        });
    }
};
