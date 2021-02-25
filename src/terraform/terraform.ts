import {
    askTerraformSettings
} from "../questions/questions";
import {checkIfAllArgumentsProvided, checkIfEnvironmentExistsForLayer} from "../validations/terraform_validations";
import * as child_process from "child_process";
import {ProjectSettings} from "../validations/project_validations";
import * as path from "path";
import {getAsyncCommandLineArguments} from "../utils/argument_utils";


const exec = child_process.execSync;

// For running it assynchronously
// const execPromise = promisify(child_process.exec);

export interface TerraformSettings {
    layer: string,
    environment: string
    action: string
}

export function executeTerraformInit(terraformSettings: TerraformSettings, projectSettings: ProjectSettings) {
    process.chdir(path.join(process.cwd(), 'layers', terraformSettings.layer));
    const bucketKey: string = `${projectSettings.name}/${terraformSettings.environment}/${terraformSettings.layer}`;
    exec(`terraform init -backend-config "region=${projectSettings.region}" -backend-config "bucket=${projectSettings.stateBucket}" -backend-config "key=${bucketKey}" -backend-config 'encrypt=true'`, {stdio: 'inherit'});
}


function executeTerraformApply(terraformSettings: TerraformSettings, projectSettings: ProjectSettings) {
    const variablesFile = path.join(path.join(process.cwd(), '..', '..', 'environments', terraformSettings.environment, `${terraformSettings.layer}.tf`));
    exec(`terraform ${terraformSettings.action} -var "region=${projectSettings.region}" -var "state_bucket=${projectSettings.stateBucket}" -var "environment=${terraformSettings.environment}" -var "layer=${terraformSettings.layer}" -var-file ${variablesFile}`, {stdio: 'inherit'});
}

export async function manageTerraformExecution(projectSettings: ProjectSettings) {

    let terraformSettings: TerraformSettings = await getAsyncCommandLineArguments();
    if(!checkIfAllArgumentsProvided(terraformSettings)) {
        terraformSettings = await askTerraformSettings();
    }

    checkIfEnvironmentExistsForLayer(terraformSettings);
    executeTerraformInit(terraformSettings, projectSettings);
    executeTerraformApply(terraformSettings, projectSettings);
}
