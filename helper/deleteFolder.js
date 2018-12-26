const fs = require('fs');

const deleteFolder = function(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file) {
            const curPath = path + '/' + file;
            if (fs.statSync(curPath).isDirectory()) {
                // recurse
                deleteFolder(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = { deleteFolder };
