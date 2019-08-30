import { injectable } from "inversify";

@injectable()
export class Config {

    constructor() {
        ['TRELLO_API_KEY', 'TRELLO_API_TOKEN', 'TRELLO_BOARD'].forEach(env => {
            if(!process.env[env]) {
                throw new Error(`Missing ${env}!`);
            }
        });

    }


    public trelloApiKey(): string {
        return process.env.TRELLO_API_KEY!;
    }

    public trelloApiToken(): string {
        return process.env.TRELLO_API_TOKEN!;
    }

    public trelloBoard(): string {
        return process.env.TRELLO_BOARD!;
    }

    public trelloListName(): string {
        return "temp";  // tanto me serve solo a me!
    }


    public snsTargetArn() {
        return process.env.SNS_ARN!;
    }
}