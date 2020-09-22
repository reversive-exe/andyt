const fs = require("fs");
const path = require("path");
const transpiler = require("./transpiler");

const dirPath = path.join(__dirname, "source");
fs.readdir(dirPath, function(err, files){
    if(err) throw err;
    for(let i = 0; i < files.length; i++){
        let source = path.join(dirPath, files[i]);
        let lines = fs.readFileSync(source).toString().split("\r\n");
        transpiler.java2smali(lines, files[i]);
    }
})