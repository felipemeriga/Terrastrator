#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as template from './utils/template';
import * as shell from 'shelljs';
import {Answers} from 'inquirer';
import {ShellString} from "shelljs";


console.log(chalk.green.bold('Welcome to the Next-Typescript generator \n'));

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const PACKAGE_MANAGERS = ['Yarn', 'NPM'];
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What template would you like to use?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Please input a new project name:'
    },
    {
        name: 'dependencies',
        type: 'confirm',
        message: 'Do you want us to install the dependencies for your project?'
    },
    {
        name: 'package-manager',
        type: 'list',
        message: 'Do you want to install the dependencies with which package manager?',
        when: function(answers: Answers){return answers.dependencies},
        choices: PACKAGE_MANAGERS
    }
];

export interface CliOptions {
    projectName: string
    templateName: string
    templatePath: string
    tartgetPath: string
}

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers: Answers) => {
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const dependencies = answers['dependencies'];
    const packageManager = answers['package-manager'];

    //@ts-ignore
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    //@ts-ignore
    const tartgetPath = path.join(CURR_DIR, projectName);

    const options: CliOptions = {
        //@ts-ignore
        projectName,
        //@ts-ignore
        templateName: projectChoice,
        templatePath,
        tartgetPath
    };

    if (!createProject(tartgetPath)) {
        return;
    }

    //@ts-ignore
    createDirectoryContents(templatePath, projectName);

    if(dependencies) {
        postProcess(options, packageManager);
    }

    console.log(chalk.green.bold('\n Your project is ready to go'));
});

function createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

const SKIP_FILES = ['node_modules', '.template.json', '.next', 'yarn.lock', 'package-lock.json'];

function createDirectoryContents(templatePath: string, projectName: string) {
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
            contents = template.render(contents, { projectName });
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}

function postProcess(options: CliOptions, packageManager: string) {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.tartgetPath);
        let result: ShellString;

        if(packageManager == 'NPM') {
            result = shell.exec('npm install');
        } else if (packageManager == 'Yarn') {
            result = shell.exec('yarn');
        } else {
            return false
        }

        if (result.code !== 0) {
            return false;
        }
    }
    return true;
}
