import {Client, Collection, GuildEmoji, Snowflake} from 'discord.js';
import * as YAML from 'yamljs';
import * as path from 'path';
import { readdirSync } from 'fs';
import {ErelaClient, Player} from 'erela.js'
import {Sequelize} from "sequelize";
import {IConfig} from "../typescript/interface";
import * as fs from "fs";
const klaw = require("klaw");

class Bot extends Client {
    public config: IConfig;
    public prefix: string;
    public logger: any;
    public commands: Collection<string, any>;
    public aliases: Collection<string, string>;
    public musicPlayer: Collection<Snowflake, Player>
    public music: ErelaClient;
     constructor(options?) {
         super(options);

         this.config = YAML.load(path.resolve(__dirname, '../config/setting.yml'));
         this.prefix = this.config.prefix;
         this.logger = require(path.resolve(__dirname, '../utils/logger'));

         this.commands = new Collection();
         this.aliases = new Collection();
         this.musicPlayer = new Collection();
     }

     private loadCommand(commandPath: string, commandName: string): boolean | void {
         try {
             const props = new(require(`${commandPath}${path.sep}${commandName}`))(this);
             this.logger.log(`Chargement de la commande: ${props.help.name}`, "log");
             props.conf.location = commandPath;
             if (props.init) {
                 props.init(this);
             }
             this.commands.set(props.help.name, props);
             props.conf.aliases.forEach(alias => {
                 this.aliases.set(alias, props.help.name);
             });
             return false;
         } catch (e) {
             return console.log(e)
         }
     }

    public handlerCommands() {
        klaw(path.resolve(__dirname, "../commands")).on("data", (item):any => {
            const cmdFile = path.parse(item.path);
            if (!cmdFile.ext || cmdFile.ext !== ".js") return;
            const response: any = this.loadCommand(
                cmdFile.dir,
                `${cmdFile.name}${cmdFile.ext}`
            );
            if (response) this.logger.error(response);
        });
    }

    public async handlerEvents() {
        const evtFiles = await readdirSync(path.resolve(__dirname, "../events"));
        this.logger.log(`Chargement de ${evtFiles.length} événements.`, "log");
        evtFiles.forEach(file => {
            const eventName = file.split(".")[0];
            this.logger.log(`Chargement de l'événement: ${eventName}`);
            const event = new(require(path.resolve(__dirname, `../events/${file}`)))(this);
            // @ts-ignore
            this.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(path.resolve(__dirname, `../events/${file}`))];
        });
    }

    public handlerModels() {
        const basename = path.basename(__filename);
        let db: any = {}
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.resolve(__dirname, '../../data/db.sqlite')
        });
        fs.readdirSync(path.resolve(__dirname, '../models')).filter(file => {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        }).forEach(file => {
            const model = require(path.join(__dirname, `../models/${file}`))(sequelize);
            db[model.name] = model;
        });
        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;
        return db
    }

    public destroyMusicClient(id: Snowflake) {
        this.music.players.destroy(id);
        this.musicPlayer.delete(id);
    }
}
export default Bot;
