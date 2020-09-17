import Bot from './core/Client';
import {ErelaClient} from "erela.js";
const client = new Bot();
export const db = client.handlerModels()
client.handlerEvents()
client.handlerCommands()

client.login(client.config.token)
