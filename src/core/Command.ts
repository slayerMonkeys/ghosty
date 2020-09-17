import Bot from "./Client";
import {IConfCommand, IConstructorCommand, IHelpCommand} from "../typescript/interface";

class Command {
    public client: Bot;
    public conf: IConfCommand;
    public help: IHelpCommand;

    constructor(client: any,
                {
                    name = 'null',
                    description = "Aucune description détéctée.",
                    category = "Utilisateur",
                    usage = "Aucune utilisation détéctée.",
                    enabled = true,
                    aliases = [],
                }: IConstructorCommand) {
        this.client = client;
        this.conf = { enabled, aliases };
        this.help = { name, description, category, usage };
    }
}
export default Command;
