export interface ILogs {
    (content: string, type?: string): void;
}
export interface IConfig {
    token: string;
    ytbToken: string;
    prefix: string;
}

export interface IConstructorCommand {
    name?: string;
    description?: string;
    category?: string;
    usage?: string;
    enabled?: boolean;
    aliases?: string[];
}

export interface IConfCommand {
    enabled?: boolean;
    aliases?: string[];
}

export interface IHelpCommand {
    name: string;
    description: string;
    category: string;
    usage: string;
}
