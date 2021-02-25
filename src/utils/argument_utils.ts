import {TerraformSettings} from "../terraform/terraform";
import {validateAction, validateEnvironment, validateLayer} from "./validations_utils";
import minimist = require("minimist");


export let validatedArgs: TerraformSettings;

export async function getAsyncCommandLineArguments(): Promise<TerraformSettings> {
    if(validatedArgs) {
        return validatedArgs;
    }
    const unvalidatedArguments: TerraformSettings | any = minimist(process.argv.slice(2));

    if(unvalidatedArguments.layer) {
        validateLayer(unvalidatedArguments.layer)
    }

    if(unvalidatedArguments.environment) {
        validateEnvironment(unvalidatedArguments.environment)
    }

    if(unvalidatedArguments.action) {
        validateAction(unvalidatedArguments.action)
    }

    validatedArgs = unvalidatedArguments;

    return validatedArgs;
}

export function getDefaultAction() {
    return validatedArgs.action ? validatedArgs.action : '';
}

export function getDefaultEnvironment() {
    return validatedArgs.environment ? validatedArgs.environment : '';
}

export function getDefaultLayer() {
    return validatedArgs.layer? validatedArgs.layer : '';
}
