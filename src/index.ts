#!/usr/bin/env node

import chalk from 'chalk';
import {firstValidations} from "./validations";
import {
    ValidationError,
    WarningException
} from "./exceptions/exceptions";
import {constructProject} from "./utils/template";
import {manageTerraformExecution} from "./terraform/terraform";
import {getAsyncCommandLineArguments} from "./utils/argument_utils";

if (require.main === module) {
    (async () => {
        await getAsyncCommandLineArguments();
        console.log(chalk.green.bold('Welcome to Terrastrator CLI! \n'));
        const cliValidatedArguments = await firstValidations();
        constructProject(cliValidatedArguments.projectSettings, cliValidatedArguments.createNewProject);
        await manageTerraformExecution(cliValidatedArguments.projectSettings);
        console.log(chalk.green.bold('The Terrastrator successfully built your infrastructure'))
    })().catch((err: any) => {
        if (err instanceof ValidationError) {
            console.log(chalk.red.bold(err.message));
        } else if(err instanceof WarningException) {
            console.log(chalk.yellow.bold(err.message));
        }
        else {
            console.error(chalk.red.bold(err.stack));
        }
    })
}

process.on('uncaughtException', err => {
    console.error(`Uncaught Exception`, chalk.red.bold(err));
    process.exit(1);
});

process.on('unhandledRejection', err => {
    if (err) {
        console.error(`Unhandled Rejection`, chalk.red.bold(err));
    }
});
