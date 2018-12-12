const ora = require("ora");
const inquirer = require("inquirer");
const path = require('path');
const clone = require('./clone');

const reqositoryMap = require("../const/index.js").repository;

module.exports = async function (repository, project = "./", options) {
    const { repositoryVersion } = options;
    console.log(`repositoryVersion:${repositoryVersion}`)
    let rep = repository;
    if (rep === undefined) {
        rep = (await inquirer.prompt([
            { type: "input", name: "rep", message: "Repository address:" }
        ])).rep;
    }

    const _repository = reqositoryMap[rep] ? reqositoryMap[rep] : rep;
    const spinner = ora(`"${_repository}" downloading...`);

    spinner.start();
    clone({repo:_repository,targetPath:path.resolve(process.cwd(),project)},function(error){
        if(error){
            console.log(error);
            spinner.fail(`Download ${_repository} failed`);
        }
        spinner.succeed(`Download ${_repository} succeed`);

        const templateInit = path.resolve(process.cwd(), project, 'template-init.js');
        // console.log(templateInit)
        const arr = path.resolve(process.cwd(), project).split(path.sep);
        const dirname = arr[arr.length - 1];
        try {
            require(templateInit)({ inquirer, project: dirname })
        } catch (e) {
            console.log(e)
        }
       
    })
    
};
