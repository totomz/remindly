import * as winston from 'winston';
import * as CloudWatchTransport from 'winston-aws-cloudwatch';
import { injectable } from "inversify";

export interface Logger {
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;

    setLevel(level: string);
}

export enum LoggerLevel {
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error'
}

@injectable()
export class LoggerWinston implements Logger {

    private logger: winston.Logger;

    constructor () {

        const transports: any[] = [];

        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };

        if(process.env.AWS_LAMBDA_LOG_STREAM_NAME) {
            transports.push(new CloudWatchTransport({
                // name: 'using-kthxbye',
                logGroupName: process.env.AWS_LAMBDA_LOG_GROUP_NAME,
                logStreamName: process.env.AWS_LAMBDA_LOG_STREAM_NAME,
                createLogGroup: true,
                createLogStream: true,
                formatLog: item => {
                    const level = item.level;
                    const message = item.message;
                    const meta = item.meta;
                    return `[${item.level.toUpperCase()}]: ${item.message} ${JSON.stringify({level, message, meta}, getCircularReplacer())}`;
                }
            }));
        }
        else {
            transports.push(new winston.transports.Console());
        }


        this.logger = winston.createLogger({
            format: winston.format.combine(
                // winston.format.colorize(),   // This breaks the level in cloudwatch
                winston.format.timestamp(),
                // winston.format.align(),
                // winston.format.json(),
                winston.format.simple()
            ),
            level: 'debug',
            transports
        });
    }


    public debug(message: string, data: any|undefined): void {
        this.logger.debug(message, {data});
    }
    public info(message: string, data: any|undefined): void {
        this.logger.info(message, {data});
    }
    public warn(message: string, data: any|undefined): void {
        this.logger.warn(message, {data});
    }
    public error(message: string, data: any|undefined): void {
        this.logger.error(message, {data});
    }

    // public close(): void {
    //     // @ts-ignore
    //     const cwLogs = this.logger.transports.find((t) => t.name === 'using-kthxbye');
    //
    //     // @ts-ignore
    //     cwLogs.kthxbye(function() {
    //         console.log('bye');
    //     });
    // }

    setLevel(level: LoggerLevel) {

        for(let i = 0; i < this.logger.transports.length; i++) {
            this.logger.transports[i].level = level;
        }
    }
}