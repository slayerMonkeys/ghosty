import Bot from "../core/Client";
import SettingStatService from "../services/SettingStatService";

module.exports = class {
    private readonly client: Bot;
    private settingStat: SettingStatService;

    constructor(client) {
        this.client = client;
        this.settingStat = new SettingStatService();
    }

    async run() {
        const guild = this.client.guilds.cache.find(g => g.id === '529297331745587202');
        const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const roleCount = guild.roles.cache.size;
        const category = guild.channels.cache.find(cat => cat.name === 'Statistiques' && cat.type === 'category');
        if(category) {
            const configChanId = await this.settingStat.getByGuildID(guild.id);
            const userChan = guild.channels.cache.find(cat => cat.id === configChanId.userChanID);
            const botChan = guild.channels.cache.find(cat => cat.id === configChanId.botChanID);
            const roleChan = guild.channels.cache.find(cat => cat.id === configChanId.roleChanID);
            const boostChan = guild.channels.cache.find(cat => cat.id === configChanId.boostChanID);
            if(!userChan || !botChan || !roleChan || !boostChan) return new Error('channel not created but category is create')
            userChan.setName(`👤 Utilisateur: ${memberCount}`)
            botChan.setName(`💻 Bots: ${botCount}`)
            roleChan.setName(`🎓 Roles: ${roleCount}`)
            boostChan.setName(`🔮 Boost: ${guild.premiumSubscriptionCount}`)
        } else {
            const everyoneRole = guild.roles.cache.find(r => r.name === '@everyone')
            try {
                const catStat = await guild.channels.create('Statistiques', { type: 'category' });
                await catStat.setPosition(0)
                const createChanOption = {
                    type: 'voice',
                    parent: catStat,
                    permissionOverwrites: [{
                        id: everyoneRole.id,
                        allow: ["VIEW_CHANNEL"]
                    }]
                }
                // @ts-ignore
                const userChan: any = await guild.channels.create(`👤 Utilisateur: ${memberCount}`, createChanOption)
                // @ts-ignore
                const botChan: any = await guild.channels.create(`💻 Bots: ${botCount}`, createChanOption)
                // @ts-ignore
                const roleChan: any = await guild.channels.create(`🎓 Roles: ${roleCount}`, createChanOption)
                // @ts-ignore
                const boostChan: any = await guild.channels.create(`🔮 Boost: ${guild.premiumSubscriptionCount}`, createChanOption)
                await this.settingStat.init({
                    guildID: guild.id,
                    userChanID: userChan.id,
                    botChanID: botChan.id,
                    roleChanID: roleChan.id,
                    boostChanID: boostChan.id
                })
            }catch (e) {
                return console.log(e);
            }
        }
    }
};
