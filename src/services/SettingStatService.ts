import { db } from '../main';
import {Snowflake} from "discord.js";

interface IInputSettingStat {
    guildID: Snowflake;
    userChanID: Snowflake;
    botChanID: Snowflake;
    roleChanID: Snowflake;
    boostChanID: Snowflake;
}

class SettingStatService {
    public async init(input:IInputSettingStat) {
        const [settingStat, created] = await db.SettingStat.findOrCreate({
            where: {
                guildID: input.guildID
            },
            defaults: input
        })
        if (!created) return this.updateByGuildID(input)
    }

    private async updateByGuildID(input:IInputSettingStat) {
        await db.SettingStat.update(input, {
            where: {
                guildID: input.guildID
            }
        });
        return true;
    }

     private async create(input:IInputSettingStat) {
         const settingStat = await db.SettingStat.build(input)
         await settingStat.save()
         return {
             valid: true,
             row: settingStat
         };
     }

     public async getByGuildID(inputGuildID: Snowflake) {
         const cb = await db.SettingStat.findOne({
             where: {
                 guildID: inputGuildID
             }
         })
         return cb;
     }
}

export default SettingStatService;