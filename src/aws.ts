import AWS from 'aws-sdk';
import {AWSCredentialsVariables} from "./validations/environment_variables";

let statefulAWSObject: typeof AWS;

export function configureAWSCredentials(awsCredentials: AWSCredentialsVariables) {
    AWS.config.update(
        {
            credentials: {
                accessKeyId: awsCredentials.awsAccessKey,
                secretAccessKey: awsCredentials.awsSecretAccessKey
            },
            region: 'eu-west-1'
        }
    );
}
