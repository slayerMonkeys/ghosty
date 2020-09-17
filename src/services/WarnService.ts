import { db } from '../main';
import {GuildMember} from "discord.js";

class WarnService {
    public async getByUser(member: GuildMember) {
        const cb = await db.Warn.findAll({
            where: {
                userId: member.id
            }
        })
        return cb;
    }

    public async create(member: GuildMember, reason: string) {
        const countWarn = await db.Warn.count({where: {userId: member.id}});
        const warn = await db.Warn.build({userId: member.id, reason: reason, countWarn: countWarn + 1})
        await warn.save()
        return {
            valid: true,
            row: warn
        };
    }

    public async remove(member: GuildMember, countWarn: number) {
        const warn = await db.Warn.destroy({
            where: {
                userId: member.id,
                countWarn: countWarn
            }
        })
        return warn
    }

    public async count(member: GuildMember) {
        const countWarn = await db.Warn.count({ where: { userId: member.id }});
        return countWarn;
    }
}

export default WarnService;