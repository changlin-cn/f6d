const download = require('download-git-repo');
const ora = require('ora');

const reqositoryMap = require('../const/index.js').repository;

module.exports = function (repository, project='./', options) {
    console.log(repository)
    console.log(project)
    const _repository = reqositoryMap[repository] ? reqositoryMap[repository] : repository
    const spinner = ora(`"${_repository}" downloading...`);

    spinner.start();
    download(_repository, project, function (err) {
        if(err){
            spinner.fail(`Download ${_repository} failed`)
        }
        spinner.succeed(`Download ${_repository} succeed`)
    })
}