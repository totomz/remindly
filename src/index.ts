import 'dotenv/config';
import container from "./inversify.config";
import { Trello } from "./lib/Trello";
import TYPES from "./TYPES";
import { Logger } from "./lib/Logger";
import { AWSError, SES } from 'aws-sdk';
import { Config } from "./Config";
import { SendEmailRequest } from "aws-sdk/clients/ses";


export async function awslambda(event, context): Promise<any> {

    const log = container.get<Logger>(TYPES.Logger);
    const config = container.get<Config>(TYPES.Configuration);
    const trello = new Trello();

    log.info("Retrieving cards");

    const ses = new SES();

    return trello
        .getCards()
        .then(cards => {

            if (cards.length === 0) {
                return "No cards, no reminder :)";
            }


            let tasks = cards.map(c => {
                return `<li>${c.name}</li>`;
            }).join('');
            tasks = `<ul>${tasks}</ul>`;

            return ses.sendEmail({
                Destination: {ToAddresses: ['tommaso.doninelli@gmail.com']},
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
            }).promise().then(res => {
                return `Message sent: ${res.MessageId}`;
            });
        });
}


awslambda(undefined, undefined).then(c => {
    console.log(c);
});
