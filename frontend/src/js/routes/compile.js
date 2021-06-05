"use strict";
function compile(req) {
    try {
        console.log('Petición:', req);
        // Datos de la petición desde Angular
        var xml = req.xml;
        var xPath = req.query;
        var grammar_selected = req.grammar;
        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        var parser_xml = void 0, parser_xPath = void 0;
        switch (grammar_selected) {
            case 1:
                parser_xml = require('../analyzers/xml_up');
                parser_xPath = "require('analyzers/xpath_up');"; //falta hacerlas
                break;
            case 2:
                parser_xml = "require('analyzers/xml_down');";
                parser_xPath = "require('analyzers/xpath_down');";
                break;
        }
        // Análisis de XML
        var xml_ast = parser_xml.parse(xml);
        if (xml_ast.parse === null) {
            var output_1 = {
                arreglo_simbolos: [],
                arreglo_errores: xml_ast.errors,
                output: "No se ha podido recuperar del error en el documento XML.\nIntente de nuevo."
            };
            return output_1;
        }
        var xml_parse = xml_ast.parse;
        var xml_errors = xml_ast.errors;
        // Ignorar comentarios, falta toda la lógica
        // const global = new Ambito(null, "global");
        // let cadena = Global(parse, global);
        // let simbolos = global.getArraySimbols();
        // for (let i = 0; i < cadena.errores.length; i++) {
        //     const err = cadena.errores[i];
        //     errores.push(err);
        // }
        // Análisis de XPath
        // let xPath_ast = parser_xPath.parse(xPath);
        // if (xPath_ast.parse === null) {
        //     let output = {
        //         arreglo_simbolos: [],
        //         arreglo_errores: xPath_ast.errors,
        //         output: "No se ha podido recuperar del error en las consultas.\nIntente de nuevo."
        //     }
        //     res.status(500).send(output);
        //     return;
        // }
        // let xPath_parse = xPath_ast.parse;
        // let xPath_errors = xPath_ast.errors;
        console.log(xml_parse);
        var output = {
            arreglo_simbolos: [],
            arreglo_errores_xml: xml_errors,
            output: xml_parse[0] //de prueba
        };
        return output;
    }
    catch (error) {
        console.log(error);
        var output = {
            arreglo_simbolos: [],
            arreglo_errores: [],
            output: "Ha ocurrido algún error.\nIntente de nuevo."
        };
        return output;
    }
}
module.exports = { compile: compile };
