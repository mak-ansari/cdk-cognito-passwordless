import { EnvironmentType } from '../models/enums';


export interface IEnvConfig {
    account: string;
    region: string;
}

export interface IConfig {
    environment: EnvironmentType;
    env: IEnvConfig;
}