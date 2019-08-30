import * as reqp from 'request-promise';
import container from "../inversify.config";
import TYPES from "../TYPES";
import { Config } from "../Config";

const rp = reqp.defaults({json: true});



export class Trello {

    async getCards(): Promise<Card[]> {

        const config = container.get<Config>(TYPES.Configuration);
        const key = config.trelloApiKey();
        const token = config.trelloApiToken();

        const list = await rp(`https://api.trello.com/1/boards/${config.trelloBoard()}/lists?cards=open&card_fields=name&filter=open&fields=name&key=${key}&token=${token}`);

        return list.filter(l => l.name === config.trelloListName())[0].cards!;

    }

}


export interface Card {
    id: string;
    name: string;
}