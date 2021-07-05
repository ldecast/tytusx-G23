

const fs = require("fs")


const parser = require("./test/backend/analyzers/parser").parser;
const XML = require("./test/backend/analyzers/xml").parser;
const XQueryTranslator = require("./test/backend/c_translator/xQueryTranslator").XQueryTranslator;
const XMLTranslator = require("./test/backend/c_translator/XMLTranslator").XMLTranslator;
const Element = require("./test/backend/model/xml/Element").Element;


const fn =  (err, data_) => {
    if (err) {
        console.error(err)
        return "";
    }
    parse_fn(data_);
    return data_;
}

const parse_fn = (input) => {
    let a = XML.parse(input);
    /*
    let ast = parser.parse(input);
    new XQueryTranslator(ast.ast, 0, 0).translate();
*/
    console.log(printObject(a));
}



function printObject(obj){
    let str = "{";
    for (const [key, value] of Object.entries(obj)) {
        str = str + key + ": ";
        if(Array.isArray(value)){
            str = str + printArray(value) + ",";
        }else if(typeof value === 'string'){
            str = str + value + ",\n";
        }else if(typeof value === 'number'){
            str = str + value + ",\n";
        }else if(value == null){
            str = str + "null, ";
        }else {
            str = str + printObject(value) + ",\n";
        }
    }
    str = str.slice(0,-2);
    str = str + "}\n";
    return str;
}

function printArray(arr){
    let str = "[\n";
    for (let i = 0; i < arr.length; i++) {
        if(Array.isArray(arr[i])){
            str = str + printArray(arr[i]) + ",";
        }else if(typeof arr[i] === 'string'){
            str = str + arr[i] + ",\n";
        }else if(typeof arr[i] === 'number'){
            str = str + arr[i] + ",\n";
        }else if(arr[i] == null){
            str = str + "null, ";
        }else {
            str = str + printObject(arr[i]) + ",\n";
        }
    }
    str = str + "]";
    return str;
}



const main = ()=>{
    let xml_content = fs.readFileSync(__dirname + '/test/files/input.xml', 'utf8');
    let xquery_content = fs.readFileSync(__dirname + '/test/files/input.xquery', 'utf8');
    let ast_xml = XML.parse(xml_content);
    let ast_xquery = parser.parse(xquery_content);

    //console.log(ast_xml)



    console.log(ast_xml.ast[0]);
    /*
    let xQueryTranslator = new XQueryTranslator(ast_xquery, ast_xml.ast[0]);
    xQueryTranslator.translate();
    let code = xQueryTranslator.getCode ();

    fs.writeFile('test/files/main.c', code, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('Code saved!');
    });
    */
}

var files = {
    './backend/analyzers/xquery.jison': './test/backend/analyzers/xquery.jison',
    './backend/analyzers/xml_up.jison': './test/backend/analyzers/xml_up.jison',
    './backend/model/xquery/XQObjeto.ts': './test/backend/model/xquery/XQObjeto.ts',
    './backend/model/xpath/Objeto.ts': './test/backend/model/xpath/Objeto.ts',
    './backend/model/xpath/Enum.ts': './test/backend/model/xpath/Enum.ts',
    './backend/model/xml/Atributo.ts': './test/backend/model/xml/Atributo.ts',
    //'./backend/model/xml/Element.ts': './test/backend/model/xml/Element.ts',
    './backend/model/xml/Ambito/Ambito.ts':'./test/backend/model/xml/Ambito/Ambito.ts',
    './backend/model/xml/Ambito/Global.ts':'./test/backend/model/xml/Ambito/Global.ts',
    './backend/model/xml/Ambito/Hijos.ts':'./test/backend/model/xml/Ambito/Hijos.ts',
    './backend/model/xml/Ambito/Variable.ts':'./test/backend/model/xml/Ambito/Variable.ts',
    './backend/model/xml/Encoding/Encoding.ts':'./test/backend/model/xml/Encoding/Encoding.ts',
    './backend/model/xml/Encoding/Enum.ts':'./test/backend/model/xml/Encoding/Enum.ts',

    './backend/controller/xpath/Expresion/Operators/Aritmetica.ts': './test/backend/controller/xpath/Expresion/Operators/Aritmetica.ts',
    './backend/controller/xpath/Expresion/Operators/Logica.ts': './test/backend/controller/xpath/Expresion/Operators/Logica.ts',
    './backend/controller/xpath/Expresion/Operators/Relacional.ts': './test/backend/controller/xpath/Expresion/Operators/Relacional.ts',
    './backend/controller/xpath/Expresion/Operators/Match.ts': './test/backend/controller/xpath/Expresion/Operators/Match.ts',
    './backend/controller/xpath/Expresion/Expresion.ts': './test/backend/controller/xpath/Expresion/Expresion.ts',
    './backend/controller/xpath/Instruccion/Selecting/Axis/Axis.ts': './test/backend/controller/xpath/Instruccion/Selecting/Axis/Axis.ts',
    //'./backend/controller/xpath/Instruccion/Selecting/Axis/Funciones.ts': './test/backend/controller/xpath/Instruccion/Selecting/Axis/Funciones.ts',
    './backend/controller/xpath/Instruccion/Selecting/DobleEje.ts' : './test/backend/controller/xpath/Instruccion/Selecting/DobleEje.ts',
    './backend/controller/xpath/Instruccion/Selecting/Eje.ts' : './test/backend/controller/xpath/Instruccion/Selecting/Eje.ts',
    './backend/controller/xpath/Instruccion/Selecting/Predicate.ts' : './test/backend/controller/xpath/Instruccion/Selecting/Predicate.ts',
    './backend/controller/xpath/Bloque_XPath.ts' : './test/backend/controller/xpath/Bloque_XPath.ts',
    './backend/controller/xquery/Expresion/Expresion.ts' : './test/backend/controller/xquery/Expresion/Expresion.ts',
    './backend/controller/xquery/BuildElement.ts' : './test/backend/controller/xquery/BuildElement.ts',
    './backend/controller/xquery/For.ts' : './test/backend/controller/xquery/For.ts',

    './backend/controller/xquery/Bloque_XQuery.ts' : './test/backend/controller/xquery/Bloque_XQuery.ts',
    './backend/controller/xquery/Let.ts' : './test/backend/controller/xquery/Let.ts',
    './backend/controller/xquery/If.ts' : './test/backend/controller/xquery/If.ts',
    './backend/controller/xquery/OrderBy.ts' : './test/backend/controller/xquery/OrderBy.ts',
    './backend/controller/xquery/Where.ts' : './test/backend/controller/xquery/Where.ts',


    './backend/controller/xquery/Return.ts' : './test/backend/controller/xquery/Return.ts',
    './backend/controller/Contexto.ts' : './test/backend/controller/Contexto.ts'
    //'./backend/controller/xpath/Expresion/Instruccion':*/

};

function copyFiles(){
    for (const [key, value] of Object.entries(files)) {
        fs.copyFile(key, value, (err) => {
            if (err) throw err;
            console.log('file: ' + key + ' was successfully copied.');
        });
    }
}
//copyFiles();
main();

/*
function readXML(){
    fs.readFile(__dirname + '/test/files/input.xquery.xml', 'utf8' , fn);
}
fs.readFile(__dirname + '/test/files/input.xquery', 'utf8' , fn);
*/