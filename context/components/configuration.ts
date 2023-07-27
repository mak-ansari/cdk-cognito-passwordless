/**
 * Dotenv is a zero-dependency module that loads environment variables
 * from a .env file into process.env
 */
import * as dotenv from "dotenv";
import { IConfig } from "../types";
import { EnvironmentType } from "../models/enums";

// Initial Environment variable
const envInitFound = dotenv.config({
    path: `.env`,
    debug: true
});

// If error loading .env file
if (!!envInitFound.error) {
    console.error('Error loading .env file:', envInitFound.error);
    process.exit(-1); // Exit with error code -1 (error)
}

const { env } = process;

export const CONFIG: Record<EnvironmentType, IConfig> = {
    [EnvironmentType.DEV]: {
        environment: EnvironmentType.DEV,
        env: {
            account: ( env.DEV_CDK_DEFAULT_ACCOUNT || env.CDK_DEFAULT_ACCOUNT ) as string,
            region: ( env.DEV_CDK_DEFAULT_REGION || env.CDK_DEFAULT_REGION ) as string
        }
    },
    // [If Required]: Provision for other environments
    // [EnvironmentType.STG]: {
    //     env: {
    //         account: ( env.STG_CDK_DEFAULT_ACCOUNT || env.CDK_DEFAULT_ACCOUNT ) as string,
    //         region: ( env.STG_CDK_DEFAULT_REGION || env.CDK_DEFAULT_REGION ) as string
    //     }
    // },
    // [EnvironmentType.PROD] : {
    //     env: {
    //         account: ( env.PROD_CDK_DEFAULT_ACCOUNT || env.CDK_DEFAULT_ACCOUNT ) as string,
    //         region: ( env.PROD_CDK_DEFAULT_REGION || env.CDK_DEFAULT_REGION ) as string
    //     }
    // }
};