import * as chalk from 'chalk';
import * as moment from 'moment';
import {ILogs} from '../typescript/interface';


class Logger {
    static log: ILogs = (content, type = "log") => {
        const timestamp: string = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
        switch (type) {
            case "log":
            {
                return console.log(
                    `${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `
                );
            }
            case "warn":
            {
                return console.log(
                    `${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `
                );
            }
            case "error":
            {
                return console.log(
                    `${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `
                );
            }
            case "debug":
            {
                return console.log(
                    `${timestamp} ${chalk.green(type.toUpperCase())} ${content} `
                );
            }
            case "cmd":
            {
                return console.log(
                    `${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`
                );
            }
            case "ready":
            {
                return console.log(
                    `${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`
                );
            }
            case "bdd":
            { return console.log(`${timestamp} ${chalk.black.bgKeyword("orange")('Bases de donnés')} ${content}`) }
            default:
                throw new TypeError(
                    "Le type de logger doit être warn, debug, log, ready, cmd ou error."
                );
        }
    }
}

module.exports = Logger;
