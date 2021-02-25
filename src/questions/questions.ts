import * as inquirer from 'inquirer';
import chalk from 'chalk';
import {Answers} from 'inquirer';
import {AWSKeysNotSet, DontCreateProject} from "../exceptions/exceptions";
import {
    getAvailableEnvironmentsList,
    getAvailableLayersList,
    replaceInAwsFromBashProfile,
    validateProjectName
} from "../utils/validations_utils";
import {DEFAULT_REGION, DEFAULT_STATE_BUCKET, TERRAFORM_ACTIONS} from "../constants";
import {AWSCredentialsVariables} from "../validations/environment_variables";
import {ProjectSettings} from "../validations/project_validations";
import {TerraformSettings} from "../terraform/terraform";
import {getDefaultAction, getDefaultEnvironment, getDefaultLayer} from "../utils/argument_utils";

const TERRAFORM_SETTINGS_QUESTIONS = [
    {
        name: 'layer',
        type: 'list',
        message: 'Which layer would you like to execute?',
        choices: getAvailableLayersList,
        default: getDefaultLayer
    },
    {
        name: 'environment',
        type: 'list',
        message: 'Which environment would you like to execute?',
        choices: getAvailableEnvironmentsList,
        default: getDefaultEnvironment
    },
    {
        name: 'action',
        type: 'list',
        message: 'Which terraform action would you like to execute?',
        choices: TERRAFORM_ACTIONS,
        default: getDefaultAction
    }
];

const AWS_ENVIRONMENT_VARIABLES_QUESTIONS = [
    {
        name: 'set_aws_environment_variables',
        type: 'confirm',
        message: 'Do you want to set AWS Access key and Secret as environment variables now ?'
    },
    {
        name: 'aws_access_key_id',
        type: 'input',
        message: 'Please Insert the AWS Access Key ID ',
        when: function(answers: Answers){return answers.set_aws_environment_variables},
    },
    {
        name: 'aws_secret_access_key',
        type: 'input',
        message: 'Please Insert the AWS Secret Access Key ',
        when: function(answers: Answers){return answers.set_aws_environment_variables},
    },
];

const PROJECT_QUESTIONS = [
    {
        name: 'create_new_project',
        type: 'confirm',
        message: 'This seems to be an empty directory, do you want to create a new project? '
    },
    {
        name: 'project_name',
        type: 'input',
        message: 'What is your project name? ',
        validate: validateProjectName,
        when: function(answers: Answers){return answers.create_new_project},
    },
    {
        name: 'region',
        type: 'input',
        default: DEFAULT_REGION,
        message: 'What is the AWS region where resources are going to be deployed? ',
        when: function(answers: Answers){return answers.create_new_project},
    },
    {
        name: 'state_bucket',
        type: 'input',
        message: 'What is the name of the bucket, where the configuration files will be saved ? (It has to be an existing bucket) ',
        default: function(answers: Answers){return `${answers.project_name}-${DEFAULT_STATE_BUCKET}`},
        when: function(answers: Answers){return answers.create_new_project},
    },
];

export async function askTerraformSettings(): Promise<TerraformSettings> {
    const answers: Answers = await inquirer.prompt(TERRAFORM_SETTINGS_QUESTIONS);
    return {
        layer: answers['layer'],
        environment: answers['environment'],
        action: answers['action']
    }
}

export async function askForNewProject(): Promise<ProjectSettings> {
    const answers: Answers = await inquirer.prompt(PROJECT_QUESTIONS);
    const createNewProject: boolean = answers['create_new_project'];

    if(createNewProject) {
        return {
            name: answers['project_name'] as string,
            region: answers['region'] as string,
            stateBucket: answers['state_bucket'] as string
        }
    } else {
        throw new DontCreateProject('If you wish to create a new project, just run this command again :)')
    }
}

export async function askAwsEnvironmentVariables(): Promise<AWSCredentialsVariables> {
    const answers: Answers = await inquirer.prompt(AWS_ENVIRONMENT_VARIABLES_QUESTIONS);
    const setAwsEnvironmentVariables: boolean = answers['set_aws_environment_variables'];

    if(setAwsEnvironmentVariables) {
        const awsAccessKeyId: string = answers['aws_access_key_id'];
        const awsSecretAccessKey: string = answers['aws_secret_access_key'];
        process.env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;

        replaceInAwsFromBashProfile({
            awsAccessKey: awsAccessKeyId,
            awsSecretAccessKey: awsSecretAccessKey
        });
        console.log(chalk.blue.bold('We have added AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as environment variables in .bash_profile \n'));

        return {
            awsAccessKey: awsAccessKeyId,
            awsSecretAccessKey: awsSecretAccessKey
        }

    } else {
        throw new AWSKeysNotSet('Your AWS Keys are not set as environment variables, set them and run it again...')
    }
}
