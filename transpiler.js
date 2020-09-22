
const Class = require("./Class");
const Field = require("./Field");
const Method = require("./Method");
const fs = require("fs");
const path = require("path");

function java2smali(lines, fileName){
    let classe = new Class();
    let header = "";
    let methods = [];
    let fields = [];
    let types = {
        "int": "I",
        "boolean": "Z",
        "void": "V",
        "String": "Ljava/lang/String;"
    }
    let imports = {};

    for(let line of lines){
        if(!classe.package && line.startsWith("package")){
            classe.package = line.replace(/ /g, "").slice("package".length);
            classe.package = (classe.package[classe.package.length-1] == ";" ? classe.package.slice(0, classe.package.length-1) : classe.package).replace(/\./g, "/");
            classe.source = fileName;
            classe.name = classe.source.slice(0, classe.source.length-".java".length);
            while(true){
                if(classe.name.startsWith("../")){
                    classe.name = classe.name.slice(3);
                }else if(classe.name.startsWith("./")){
                    classe.name = classe.name.slice(2);
                }else if(classe.name.startsWith("/")){
                    classe.name = classe.name.slice(1);
                }else
                    break;
            }
        }else if(line.startsWith("import")){
            let imp = line.replace(/ /g, "").slice("import".length);
            imp = (imp[imp.length-1] == ";" ? imp.slice(0, imp.length-1) : imp).replace(/\./g, "/");
            imports[imp.split("/")[imp.split("/").length-1]] = imp;
        }else if(line.split(" ")[1] == "class" || line.split(" ")[0] == "class"){
            line = line.split(" ");
            _a = 0;
            if(line[0] != "class")
                classe.privacity = " "+line[0]
            else{
                _a = 1;
                classe.privacity = "";
            }
            if(line[3-_a] == "extends"){
                let i = 4-_a;
                let _extends = [];
                while(true){
                    if(line[i][line[i].length-1] == ","){
                        _extends.push(line[i].slice(0, line[i].length-1));
                    }
                    else{
                        if(line[i][line[i].length-1] == "{")
                            line[i] = line[i].slice(0, line[i].length-1);
                        _extends.push(line[i]);
                        break;
                    }
                    i++;
                }
                classe.extends = _extends;
            }
        }else if(new RegExp(/^(?!.*?return)(.*\s){1}(=.*)?;/g).exec(line)){
            // Field
            let field = new Field();
            line = line.replace(/^\s{1,}/g, "");
            line = line.split("=");
            if(line.length > 1){
                let l = line[0];
                line[0] = l[l.length-1] == " " ? l.slice(0, l.length-1) : l;
                l = line[1].replace(/^\s{1,}/g, "").replace(/{$/g, "");
                field.value = l.replace(/;$/g, "");
                line[1] = l[0] == " " ? l.slice(1) : l;
                l = line[0].split(" ");
                field.name = l[l.length-1];
                field.type = l[l.length-2];
                if(field.type.includes("[]")){
                    field.type = l[l.length-2].slice(0, l[l.length-2].length-2);
                    field.isArray = true;
                }
                l.pop(); l.pop();
                field.properties = l.join().replace(/,/g, " ");
            }else{
                console.log(line[0].split(" "));
            }
            fields.push(field);
        }else if(new RegExp(/(\w{1,}\s){1,3}\w{1,}\s?\(.{0,}\)/g).exec(line)){
            // Method
            let method = new Method();
            line = line.replace(/^\s{1,}/g, "");
            line = line.split("(");
            line[0] = line[0].split(" ");
            line[1] = line[1].replace(/\)\s?{}?/g, "").replace(/,\s/g, ",").split(",");
            for(let i in line[1]){
                line[1][i] = line[1][i].split(" ");
            }
            method.privacity = "public";
            method.return = line[0][line[0].length-2];
            method.name = line[0][line[0].length-1];
            methods.push(method);
        }
    }

    let code = `.class${classe.privacity} L${classe.package}/${classe.name};
.super L${classe.extends.length > 0 ? imports[classe.extends[0]] : "java/lang/Object"};
.source "${classe.name}.java"

`;
    if(fields.length > 0) code += "# static fields\r\n";
    for(let field of fields){
        code += `.field ${field.properties} ${field.name}:${field.isArray ? "[" : ""}${imports.hasOwnProperty(field.type) ? imports[field.type] : types[field.type]}${field.value != undefined ? ` = ${field.value}` : ""}\r\n`
    }
    if(methods.length > 0) code += "\r\n# virtual methods\r\n";
    for(let method of methods){
        code += `.method ${method.privacity} ${method.name}()${imports.hasOwnProperty(method.return) ? imports[method.return] : types[method.return]}\r\n`
        code += `.end method\r\n\r\n`;
    }

    fs.writeFile(path.join(__dirname, `out/${fileName.split(".")[0]}.smali`), code, ()=>{});
}

module.exports = {
    java2smali
};