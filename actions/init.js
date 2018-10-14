const download = require("download-git-repo");
const ora = require("ora");
const inquirer = require("inquirer");
const path = require('path');

const reqositoryMap = require("../const/index.js").repository;

module.exports = async function (repository, project = "./", options) {
    let rep = repository;
    if (rep === undefined) {
        rep = (await inquirer.prompt([
            {type: "input", name: "rep", message: "Repository address:"}
        ])).rep;
    }

    const _repository = reqositoryMap[rep] ? reqositoryMap[rep] : rep;
    const spinner = ora(`"${_repository}" downloading...`);

    spinner.start();

    download(_repository, project, function (err) {
        if (err) {
            spinner.fail(`Download ${_repository} failed`);
            return
        }
        spinner.succeed(`Download ${_repository} succeed`);

        const templateInit = path.resolve(process.cwd(), project, 'template-init.js');
        // console.log(templateInit)
        const arr = path.resolve(process.cwd(), project).split(path.sep);
        const dirname = arr[arr.length - 1];
        try {
            require(templateInit)({inquirer, project: dirname})
        } catch (e) {

        }

    });
};
