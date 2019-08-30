import "reflect-metadata";
import TYPES from "./TYPES";
import { Container } from "inversify";
import { Logger, LoggerWinston } from "./lib/Logger";
import { Config } from "./Config";

const container = new Container();
container.bind<Logger>(TYPES.Logger).to(LoggerWinston).inSingletonScope();
container.bind<Config>(TYPES.Configuration).to(Config).inSingletonScope();

export default container;