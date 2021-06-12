"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Bloque_1 = __importDefault(require("../controller/xpath/Instruccion/Bloque"));
var Ambito_1 = require("../model/xml/Ambito/Ambito");
var Global_1 = require("../model/xml/Ambito/Global");
function compile(req) {
    try {
        // Datos de la petición desde Angular
        var xml = req.xml;
        var xPath = req.query;
        var grammar_selected = req.grammar;
        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        var parser_xml = void 0, parser_xPath = void 0;
        switch (grammar_selected) {
            case 1:
                parser_xml = require('../analyzers/xml_up');
                parser_xPath = require('../analyzers/xpath_up');
                break;
            case 2:
                parser_xml = require('../analyzers/xml_down');
                parser_xPath = "require('../analyzers/xpath_down);";
                break;
        }
        // Análisis de XML
        var xml_ast = parser_xml.parse(xml);
        if (xml_ast === true || xml_ast.errors.length > 0 || xml_ast.ast === null) {
            var output_1 = {
                arreglo_simbolos: [],
                arreglo_errores: (xml_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "El documento XML contiene errores para analizar.\nIntente de nuevo."
            };
            return output_1;
        }
        var xml_parse = xml_ast.ast;
        var global_1 = new Ambito_1.Ambito(null, "global");
        var cadena = new Global_1.Global(xml_parse, global_1);
        var simbolos = cadena.ambito.getArraySymbols();
        // Análisis de XPath
        var xPath_ast = parser_xPath.parse(xPath);
        console.log(xPath_ast, 99);
        if (xPath_ast === true || xPath_ast.errors.length > 0 || xPath_ast.ast === null) {
            var output_2 = {
                arreglo_simbolos: [],
                arreglo_errores: (xPath_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta.", origen: "XPath", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "La consulta contiene errores para analizar.\nIntente de nuevo."
            };
            return output_2;
        }
        var xPath_parse = xPath_ast.ast;
        // console.log(xPath_parse, 88)
        var bloque = Bloque_1.default(xPath_parse, cadena.ambito);
        console.log(bloque, 88);
        console.log("Salida:", xPath_parse);
        var output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: bloque.err ? [bloque.err] : [],
            output: bloque.cadena ? bloque.cadena : bloque.err
        };
        return output;
    }
    catch (error) {
        console.log(error);
        var output = {
            arreglo_simbolos: [],
            arreglo_errores: [{ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" }],
            output: String(error)
        };
        return output;
    }
}
module.exports = { compile: compile };
