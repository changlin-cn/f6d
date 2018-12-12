const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const tempFolder = './.temp__folder';
const copy = require('copy');
const ora = require("ora");
const {stat} = fs;
const callback = (e) => { console.log(e) }

const deleteFolder = function (path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            const curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
function clone({ repo, targetPath }, cb = callback) {
    const tempFolderPath = path.resolve(targetPath, tempFolder);
    const process = spawn('git', ['clone', repo, tempFolderPath]);
    process.on('close', function (status) {
        if (status == 0) {
            deleteFolder(path.resolve(tempFolderPath, './.git'));
            copy([path.resolve(tempFolderPath,'./*'),path.resolve(tempFolderPath,'./.*'),path.resolve(tempFolderPath,'./*/*')],targetPath,function(error){
                deleteFolder(tempFolderPath);
                cb(error);
            })
        } else {
            cb(new Error("'git clone' failed with status " + status));
        }
    });
}

function cloneCommand(repository, project = "./"){
    const spinner = ora(`Downloading...`);
    spinner.start();
    clone({repo:repository,targetPath:path.resolve(process.cwd(),project)},function(error){
        if(error){
            console.log(error);
            spinner.fail(`Download failed`);
            process.exit(1)
            return 
        }
        spinner.succeed(`Download succeed`);    
    })
}
module.exports = {clone,cloneCommand}
