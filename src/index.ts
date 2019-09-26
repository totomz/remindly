import 'dotenv/config';
import container from "./inversify.config";
import { Trello } from "./lib/Trello";
import TYPES from "./TYPES";
import { Logger } from "./lib/Logger";
import { SES } from 'aws-sdk';
import { Config } from "./Config";
import { SendEmailRequest } from "aws-sdk/clients/ses";




export function awslambda(event, context, callback) {

    const log = container.get<Logger>(TYPES.Logger);
    const config = container.get<Config>(TYPES.Configuration);
    const trello = new Trello();

    log.info("Retrieving cards");

    const ses = new SES();

    trello.getCards().then(cards => {
        let tasks = cards.map(c => {
            return `<li>${c.name}</li>`;
        }).join('');
        tasks = `<ul>${tasks}</ul>`;

        return ses.sendEmail({
            Destination: { ToAddresses: ['tommaso.doninelli@gmail.com'] },
            Source: 'remindly@my-ideas.it',
            Message: {
                Subject: {
                    Charset: "UTF-8",
                    Data: "Remindly"
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<p>Hey man! You have stuff to do!</p>${tasks}`
                    }
                }
            }

        } as SendEmailRequest).promise();
    });

        
}


// awslambda(undefined, undefined, undefined);