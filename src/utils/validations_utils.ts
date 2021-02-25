import * as fs from "fs";
import {BASH_PROFILE_FILE, MANDATORY_FIELDS, ORCHESTRATOR_FILE_NAME, TERRAFORM_ACTIONS} from "../constants";
import {AWSCredentialsVariables} from "../validations/environment_variables";
import yaml from "js-yaml";
import * as path from "path";
import {ProjectSettings} from "../validations/project_validations";
import {
    EnvironmentDontExist,
    EnvironmentFolderDontExist, EnvironmentFolderEmpty, InvalidAction, LayerDontExist,
    LayersFolderDontExist,
    LayersFolderEmpty,
    ProjectValidationError,
    TerraformNotInstalled
} from "../exceptions/exceptions";
import {promisify} from "util";
import * as child_process from "child_process";

export function returnLineFromFile(find: string, file: string): string | undefined {

    const lines = fs.readFileSync(file, 'utf-8')
        .split('\n')
        .filter(Boolean);

    let found = undefined;

    for (const line of lines) {
        if(line.includes(find)){
            found =  line.replace(find,'');
            break
        }
    }
    return found
}

export function getAvailableLayersList(): string[] {
    const layersPath = path.join(process.cwd(), 'layers');
    if(!fs.existsSync(layersPath)) {
        throw new LayersFolderDontExist('For some reason your Terrastrator project dont have a folder for layers, have you deleted it ?')
    }
    const availableLayers: string[] = fs.readdirSync(layersPath);

    if(availableLayers.length == 0) {
        throw new LayersFolderEmpty('There are not any layers available under your layers folder, please add some');
    }

    return availableLayers;
}

export function getAvailableEnvironmentsList(): string[]{
    const environmentsPath = path.join(process.cwd(), 'environments');
    if(!fs.existsSync(environmentsPath)) {
        throw new EnvironmentFolderDontExist('For some reason your Terrastrator project dont have a folder for environments, have you deleted it ?')
    }

    const availableEnvironments: string[] = fs.readdirSync(environmentsPath);

    if(availableEnvironments.length == 0) {
        throw new EnvironmentFolderEmpty('There are not any environment available under your environments folder, please add some');
    }

    return availableEnvironments;
}

export function validateLayer(layer: string) {
    const layerPath = path.join(process.cwd(), 'layers', layer);
    if(!fs.existsSync(layerPath)) {
        throw new LayerDontExist(`The layer ${layer} you provided as a argument, do not exist inside layers folder`)
    }
}

export function validateEnvironment(environment: string) {
    const environmentPath = path.join(process.cwd(), 'environments', environment);
    if(!fs.existsSync(environmentPath)) {
        throw new EnvironmentDontExist(`The environment ${environment} you provided as a argument, do not exist inside environments folder`)
    }
}

export function validateAction(action: string) {
    if(!TERRAFORM_ACTIONS.includes(action)) {
        throw new InvalidAction(`The action ${action} you provided as a argument, does not exist over Terraform`)
    }
}

export async function validateProjectName(name: string) {
    if(name == '' || name == null) {
        return 'Insert a valid name!'
    }
    const newProjectPath: string = path.join(process.cwd(), name);
    if (fs.existsSync(newProjectPath)) {
        return 'There is already a folder with that name, under that directory'
    }
    return true
}

export function getProjectDetails(): unknown {
    let fileContents = fs.readFileSync(path.join(process.cwd(), ORCHESTRATOR_FILE_NAME), 'utf8');
    return yaml.load(fileContents);
}

export function validateProjectDetails(unvalidatedProjectDetails: any): ProjectSettings {
    MANDATORY_FIELDS.map((field) => {
        if(!unvalidatedProjectDetails.hasOwnProperty(field)) {
            throw new ProjectValidationError(`Your terrastrator.yaml file does not have the field ${field}, please fill that`)
        } else {
            if(unvalidatedProjectDetails[field] == null) {
                throw new ProjectValidationError(`The field ${field} on your terrastrator.yml file is blank, please insert a proper information on that`)
            }
        }
    });

    return {
        name: unvalidatedProjectDetails.name,
        region: unvalidatedProjectDetails.region,
        stateBucket: unvalidatedProjectDetails.stateBucket
    }
}

export async function getTerraformVersion () {
    try {
        const exec = promisify(child_process.exec);
        await exec('terraform -v');
    } catch (e) {
        throw new TerraformNotInstalled('Terraform is not installed, please install it before running...')
    }
}

export function replaceInAwsFromBashProfile(awsEnvironmentVariables: AWSCredentialsVariables) {

    const awsAccessKeyFromBashProfile: string | undefined =  returnLineFromFile('export AWS_ACCESS_KEY_ID=', BASH_PROFILE_FILE);
    const awsSecretAccessKeyFromBashProfile: string | undefined =  returnLineFromFile('export AWS_SECRET_ACCESS_KEY=', BASH_PROFILE_FILE);

    if(awsAccessKeyFromBashProfile == undefined || awsSecretAccessKeyFromBashProfile == undefined) {
        fs.appendFileSync(BASH_PROFILE_FILE, `export AWS_ACCESS_KEY_ID=${awsEnvironmentVariables.awsAccessKey}\n`, 'utf-8');
        fs.appendFileSync(BASH_PROFILE_FILE, `export AWS_SECRET_ACCESS_KEY=${awsEnvironmentVariables.awsSecretAccessKey}\n`, 'utf-8');
    } else {
        let accessKeyData = fs.readFileSync(BASH_PROFILE_FILE, 'utf-8');
        // TODO FIX THIS PART
        let newAccessKeyValue = accessKeyData.replace(/export AWS_ACCESS_KEY_ID=.*\n/,
            `export AWS_ACCESS_KEY_ID=${awsEnvironmentVariables.awsAccessKey}\n`);

        fs.writeFileSync(BASH_PROFILE_FILE, newAccessKeyValue, 'utf-8');

        let secretKeyData = fs.readFileSync(BASH_PROFILE_FILE, 'utf-8');
        let newSecretKeyData = secretKeyData.replace(/export AWS_SECRET_ACCESS_KEY=.*\n/,
            `export AWS_SECRET_ACCESS_KEY=${awsEnvironmentVariables.awsSecretAccessKey}\n`);
        fs.writeFileSync(BASH_PROFILE_FILE, newSecretKeyData, 'utf-8');
    }
}
