import AWS from 'aws-sdk';
import {AWSCredentialsVariables} from "./validations/environment_variables";
import {DEFAULT_REGION} from "./constants";

let statefulAWSObject: typeof AWS;

export function configureAWSCredentials(awsCredentials: AWSCredentialsVariables) {
    AWS.config.update(
        {
            credentials: {
                accessKeyId: awsCredentials.awsAccessKey,
                secretAccessKey: awsCredentials.awsSecretAccessKey
            },
            region: DEFAULT_REGION
        }
    );
}

export function updateAwsRegion(region: string) {
    AWS.config.update({
            region: region
        }
    );
}
