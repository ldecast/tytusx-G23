"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Contexto_1 = require("../controller/Contexto");
const Bloque_XQuery_1 = __importDefault(require("../controller/xquery/Bloque_XQuery"));
const Bloque_XPath_1 = __importDefault(require("../controller/xpath/Bloque_XPath"));
const Ambito_1 = require("../model/xml/Ambito/Ambito");
const Global_1 = require("../model/xml/Ambito/Global");
const Element_1 = require("../model/xml/Element");
function compile(req) {
    let errors = [];
    try {
        // Datos de la petición desde Angular
        let xml = req.xml;
        let xQuery = req.query;
        let grammar_selected = req.grammar;
        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        let parser_xml, parser_xQuery;
        switch (grammar_selected) {
            case 1:
                parser_xml = require('../analyzers/xml_up');
                parser_xQuery = require('../analyzers/xquery');
                break;
            case 2:
                parser_xml = require('../analyzers/xml_up');
                parser_xQuery = require('../analyzers/xquery');
                break;
        }
        // Análisis de XML
        let xml_ast = parser_xml.parse(xml);
        let encoding = xml_ast.encoding; // Encoding del documento XML
        if (encoding.encoding === encoding.codes.INVALID) {
            errors.push({ tipo: "Léxico", error: "La codificación del XML no es válida.", origen: "XML", linea: "1", columna: "1" });
        }
        if (xml_ast.errors.length > 0 || xml_ast.ast === null || xml_ast === true) {
            if (xml_ast.errors.length > 0)
                errors = errors.concat(xml_ast.errors);
            if (xml_ast.ast === null || xml_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: "1", columna: "1" });
                return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }
        let xml_parse = xml_ast.ast; // AST que genera Jison
        let global = new Ambito_1.Ambito(null, "global"); // Ámbito global
        let cadena = new Global_1.Global(xml_parse, global); // Llena la tabla de símbolos
        // Análisis de xQuery
        let xQuery_ast = parser_xQuery.parse(xQuery);
        let ast = (xQuery_ast.xquery) ? (xQuery_ast.xquery) : (xQuery_ast.xpath); // AST que genera Jison
        if (xQuery_ast.errors.length > 0 || ast === null || xQuery_ast === true) {
            if (xQuery_ast.errors.length > 0)
                errors = xQuery_ast.errors;
            if (ast === null || xQuery_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta digitada.", origen: "XQuery", linea: "1", columna: "1" });
                return { output: "La consulta contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }
        let root = new Contexto_1.Contexto();
        root.elementos = [new Element_1.Element("[object XMLDocument]", [], "", cadena.ambito.tablaSimbolos, "0", "0", "[object XMLDocument]")];
        let bloque;
        let consola = "";
        if (xQuery_ast.xquery) {
            let _str = [];
            bloque = Bloque_XQuery_1.default.getOutput(xQuery_ast.xquery, cadena.ambito, root, _str); // Procesa las instrucciones de XQuery (fase 2)
        }
        else if (xQuery_ast.xpath) {
            bloque = Bloque_XPath_1.default(xQuery_ast.xpath, cadena.ambito, root); // Procesa las instrucciones si sólo viene XPath (fase 1)
        }
        if (bloque.cadena)
            consola = bloque.cadena;
        if (bloque.error) {
            errors.push(bloque);
            consola = bloque.error;
        }
        let simbolos = cadena.ambito.getArraySymbols(); // Arreglo con los símbolos
        console.log(consola);
        let output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: errors,
            output: consola,
            encoding: encoding
        };
        errors = [];
        return output;
    }
    catch (error) {
        console.log(error);
        if (error.message)
            errors.push({ tipo: "Sintáctico", error: String(error.message), origen: "Entrada", linea: "", columna: "" });
        else
            errors.push({ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" });
        let output = {
            arreglo_simbolos: [],
            arreglo_errores: errors,
            output: (error.message) ? String(error.message) : String(error),
            encoding: "utf-8"
        };
        errors = [];
        return output;
    }
}
module.exports = { compile: compile };
