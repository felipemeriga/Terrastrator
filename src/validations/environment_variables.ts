import {askAwsEnvironmentVariables} from "../questions/questions";
import {returnLineFromFile} from "../utils/validations_utils";
import {BASH_PROFILE_FILE} from "../constants";
import {configureAWSCredentials} from "../aws";

export interface AWSCredentialsVariables {
    awsAccessKey: string,
    awsSecretAccessKey: string
}

export async function checkAwsEnvironmentVariables(): Promise<AWSCredentialsVariables> {

    let awsCredentials: AWSCredentialsVariables = {
        awsAccessKey:  process.env.AWS_ACCESS_KEY_ID ?  process.env.AWS_ACCESS_KEY_ID : '',
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?  process.env.AWS_SECRET_ACCESS_KEY : '',
    };

    if(!awsCredentials.awsAccessKey || !awsCredentials.awsSecretAccessKey) {
        const awsAccessKeyFromBashProfile: string | undefined =  await returnLineFromFile('export AWS_ACCESS_KEY_ID=', BASH_PROFILE_FILE);
        const awsSecretAccessKeyFromBashProfile: string | undefined =  await returnLineFromFile('export AWS_SECRET_ACCESS_KEY=', BASH_PROFILE_FILE);

        if(!awsAccessKeyFromBashProfile || !awsSecretAccessKeyFromBashProfile) {
            awsCredentials = await askAwsEnvironmentVariables();
        }
    }

    configureAWSCredentials(awsCredentials);
    return awsCredentials
}


