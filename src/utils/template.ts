import * as ejs from 'ejs';
import * as fs from "fs";
import * as chalk from "chalk";
import {ProjectSettings} from "../validations/project_validations";
import * as path from "path";
import {SKIP_FILES} from "../constants";

const CURR_DIR = process.cwd();

export interface TemplateData {
    projectName: string,
    region: string,
    stateBucket: string
}

export function render(content: string, data: TemplateData) {
    return ejs.render(content, data);
}

export function constructProject(projectSettings: ProjectSettings, createNewProject: boolean) {
    if(createNewProject) {
        const targetPath = path.join(process.cwd(), projectSettings.name);
        const templatePath = path.join(__dirname, '..', 'templates');
        createProject(targetPath);
        createDirectoryContents(templatePath, projectSettings.name, projectSettings);
        // Move to the new project directory
        process.chdir(path.join(process.cwd(), projectSettings.name));
    }
}

function createProject(projectPath: string) {
    fs.mkdirSync(projectPath);
}

function createDirectoryContents(templatePath: string, projectName: string, projectSettings: ProjectSettings) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = render(contents, {
                projectName: projectSettings.name,
                region: projectSettings.region,
                stateBucket: projectSettings.stateBucket
            });
            // write file to destination folder
            const writePath = path.join(process.cwd(), projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(process.cwd(), projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), projectSettings);
        }
    });
}
