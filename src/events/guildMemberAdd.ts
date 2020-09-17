import Bot from "../core/Client";
import {GuildMember, MessageAttachment, TextChannel} from "discord.js";
import {createCanvas, loadImage, registerFont} from 'canvas';
import * as path from 'path';

module.exports = class {
    private readonly client: Bot;

    constructor(client) {
        this.client = client;
    }

    private applyText(canvas, text) {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;

        do {
            ctx.font = `${fontSize -= 10}px Primetime`;
        } while (ctx.measureText(text).width > canvas.width - 300);

        return ctx.font;
    };

    async run(member: GuildMember) {
        const canvas = createCanvas(700, 250);
        registerFont(path.resolve(__dirname, '../assets/font/PRIMETIME.ttf'), { family: 'Primetime' })
        const ctx = canvas.getContext('2d')
        ctx.font = '28px Primetime';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Bienvenue sur le serveur,', canvas.width / 2.5, canvas.height / 3.5);

        ctx.font = this.applyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);


        const chanBvn: any = this.client.channels.cache.find((chan) => chan.id === '556122044266315776');
        const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        chanBvn.send('',attachment);

    }
};