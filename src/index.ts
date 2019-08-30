import 'dotenv/config';
import container from "./inversify.config";
import { Trello } from "./lib/Trello";
import TYPES from "./TYPES";
import { Logger } from "./lib/Logger";
import { SNS } from 'aws-sdk';
import { Config } from "./Config";
import { PublishInput } from "aws-sdk/clients/sns";



export function awslambda(event, context, callback) {

    const log = container.get<Logger>(TYPES.Logger);
    const config = container.get<Config>(TYPES.Configuration);
    const trello = new Trello();

    log.info("Retrieving cards");

    const sns = new SNS();

    trello.getCards().then(cards => {
        const requests = cards.map(card => {
            return sns.publish({
                TopicArn: config.snsTargetArn(),
                Message: `Ciao! Dovresti fare: ${card.name}`
            } as PublishInput ).promise();
        });

        return Promise.all(requests)
            .then(res => {
                return callback(undefined, "ok");
            })
            .catch(err => {
                log.error("Error", err);
                return callback(err);
            });
    });
        
}


// awslambda(undefined, undefined, undefined);