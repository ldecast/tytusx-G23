import Bloque from '../controller/xpath/Instruccion/Bloque';
import { Ambito } from '../model/xml/Ambito/Ambito';
import { Global } from '../model/xml/Ambito/Global';

function compile(req: any) {
    try {
        // Datos de la petición desde Angular
        let xml = req.xml;
        let xPath = req.query;
        let grammar_selected = req.grammar;

        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        let parser_xml, parser_xPath;
        switch (grammar_selected) {
            case 1:
                parser_xml = require('../analyzers/xml_up');
                parser_xPath = require('../analyzers/xpath_up');
                break;
            case 2:
                parser_xml = require('../analyzers/xml_down');
                parser_xPath = "require('../analyzers/xpath_down);"
                break;
        }

        // Análisis de XML
        let xml_ast = parser_xml.parse(xml);
        if (xml_ast === true || xml_ast.errors.length > 0 || xml_ast.ast === null) {
            let output = {
                arreglo_simbolos: [],
                arreglo_errores: (xml_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "El documento XML contiene errores para analizar.\nIntente de nuevo."
            }
            return output;
        }

        let xml_parse = xml_ast.ast;
        let global = new Ambito(null, "global");
        let cadena = new Global(xml_parse, global);
        let simbolos = cadena.ambito.getArraySymbols();

        // Análisis de XPath
        let xPath_ast = parser_xPath.parse(xPath);
        console.log(xPath_ast, 99);
        if (xPath_ast === true || xPath_ast.errors.length > 0 || xPath_ast.ast === null) {
            let output = {
                arreglo_simbolos: [],
                arreglo_errores: (xPath_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta.", origen: "XPath", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "La consulta contiene errores para analizar.\nIntente de nuevo."
            }
            return output;
        }

        let xPath_parse = xPath_ast.ast;
        // console.log(xPath_parse, 88)
        let bloque = Bloque(xPath_parse, cadena.ambito);
        console.log(bloque, 88)

        console.log("Salida:", xPath_parse);
        let output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: bloque.err ? [bloque.err] : [],
            output: bloque.cadena ? bloque.cadena : bloque.err
        }

        return output;

    } catch (error) {
        console.log(error);
        let output = {
            arreglo_simbolos: [],
            arreglo_errores: [{ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" }],
            output: String(error)
        }
        return output;
    }
}

export = { compile: compile };