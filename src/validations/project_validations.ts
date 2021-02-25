import * as fs from "fs";
import {getProjectDetails, validateProjectDetails} from "../utils/validations_utils";
import {ORCHESTRATOR_FILE_NAME} from "../constants";
import {askForNewProject} from "../questions/questions";
import chalk from "chalk";

export interface ProjectSettings {
    region: string;
    name: string;
    stateBucket: string;
}

export function checkIfProjectExists(): boolean {
    const files = fs.readdirSync(process.cwd());
    return !files.includes(ORCHESTRATOR_FILE_NAME)
}

export async function validateProject(createNewProject: boolean): Promise<ProjectSettings> {
    let projectDetails: ProjectSettings;

    if(!createNewProject) {
        const unknownProjectDetails = getProjectDetails();
        projectDetails = validateProjectDetails(unknownProjectDetails);
    } else {
        projectDetails = await askForNewProject();
    }

    promptCurrentProject(projectDetails);
    return projectDetails
}

function promptCurrentProject(projectSettings: ProjectSettings) {
    console.log(chalk.blue.bold(' --- PROJECT SETTINGS --- \n'));
    console.log(chalk.blue.bold(`Project Name: ${projectSettings.name}`));
    console.log(chalk.blue.bold(`State Bucket: ${projectSettings.stateBucket}`));
    console.log(chalk.blue.bold(`Region: ${projectSettings.region} \n`));

}
