import {AWSCredentialsVariables, checkAwsEnvironmentVariables} from "./validations/environment_variables";
import {validateAWSCredentials, validateAWSRegion, validateS3Bucket} from "./validations/aws_validations";
import {checkIfProjectExists, ProjectSettings, validateProject} from "./validations/project_validations";
import {getTerraformVersion} from "./utils/validations_utils";


export interface CliValidatedArguments {
    awsCredentials: AWSCredentialsVariables
    projectSettings: ProjectSettings
    createNewProject: boolean
}

export async function firstValidations(): Promise<CliValidatedArguments> {
    await getTerraformVersion();
    const createNewProject = checkIfProjectExists();
    const projectSettings = await validateProject(createNewProject);
    const awsCredentials = await checkAwsEnvironmentVariables();
    await validateAWSCredentials();
    await validateAWSRegion(projectSettings.region);
    await validateS3Bucket(projectSettings.stateBucket, projectSettings.region);

    return {
        awsCredentials,
        projectSettings,
        createNewProject
    }
}
