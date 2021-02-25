import {TerraformSettings} from "../terraform/terraform";
import * as path from "path";
import * as fs from "fs";
import {EnvironmentDontExistForLayer} from "../exceptions/exceptions";


export function checkIfEnvironmentExistsForLayer(terraformSettings: TerraformSettings) {
    const environmentLayerFile = path.join(process.cwd(), 'environments',
        terraformSettings.environment,
        `${terraformSettings.layer}.tf`);

    if(!fs.existsSync(environmentLayerFile)) {
        throw new EnvironmentDontExistForLayer(`There is not a file named ${terraformSettings.layer}.tf inside the environment ${terraformSettings.environment} folder, please create a proper one`);
    }
}

export function checkIfAllArgumentsProvided(terraformArgs: TerraformSettings): boolean {
    return !!(terraformArgs.layer && terraformArgs.environment && terraformArgs.action);
}
