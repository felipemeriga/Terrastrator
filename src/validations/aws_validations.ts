import AWS from "aws-sdk";
import {GetCallerIdentityResponse} from "aws-sdk/clients/sts";
import {AWSInvalidCredentials, BucketWrongRegion, InvalidBucket} from "../exceptions/exceptions";
import chalk from "chalk";
import {GetBucketLocationOutput} from "aws-sdk/clients/s3";


export async function validateAWSCredentials() {
    try {
        const sts = new AWS.STS({apiVersion: '2011-06-15'});
        const credentials: GetCallerIdentityResponse = await sts.getCallerIdentity().promise();
        console.log(chalk.blue.bold(`Your AWS is valid, you are currently using the account with ID: ${credentials.Account} \n`));
    } catch (e) {
        throw new AWSInvalidCredentials(`Invalid AWS Credentials: ${e.message}`)
    }
}

async function checkBucketName(s3: AWS.S3, bucketName: string) {
    try {
        await s3.headBucket({ Bucket: bucketName }).promise();
    } catch (err) {
        if (err.statusCode >= 400 && err.statusCode < 500) {
            throw new InvalidBucket('The bucket name you provided, does not exist, please provide an existing one')
        }
        throw err
    }
}

async function validateBucketRegion(s3: AWS.S3, bucketName: string, region: string) {

    const bucketLocation: GetBucketLocationOutput = await s3.getBucketLocation({Bucket: bucketName}).promise();
    if(bucketLocation.LocationConstraint !== region) {
        throw new BucketWrongRegion(`Your bucket region is ${bucketLocation.LocationConstraint}, but your default region is ${region}, they have to be the same`);
    }

}

export async function validateS3Bucket(bucketName: string, region: string) {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    await checkBucketName(s3, bucketName);
    await validateBucketRegion(s3, bucketName, region);
}
