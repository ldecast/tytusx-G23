import Bloque from '../controller/xpath/Instruccion/Bloque';
import { Ambito } from '../model/xml/Ambito/Ambito';
import { Global } from '../model/xml/Ambito/Global';
import { Element } from '../model/xml/Element';

function compile(req: any) {
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
            if (xml_ast.errors.length > 0) errors = errors.concat(xml_ast.errors);
            if (xml_ast.ast === null || xml_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: "1", columna: "1" });
                return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }

        let xml_parse = xml_ast.ast; // AST que genera Jison
        let global = new Ambito(null, "global"); // Ámbito global
        let cadena = new Global(xml_parse, global); // Llena la tabla de símbolos
        let simbolos = cadena.ambito.getArraySymbols(); // Arreglo con los símbolos

        // Análisis de xQuery
        let xQuery_ast = parser_xQuery.parse(xQuery);
        // console.log(xQuery_ast.ast, "ast");
        if (xQuery_ast.errors.length > 0 || xQuery_ast.ast === null || xQuery_ast === true) {
            if (xQuery_ast.errors.length > 0) errors = xQuery_ast.errors;
            if (xQuery_ast.ast === null || xQuery_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta digitada.", origen: "XQuery", linea: "1", columna: "1" });
                return { output: "La consulta contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }

        let root: Element = new Element("[object XMLDocument]", [], "", cadena.ambito.tablaSimbolos, "0", "0", "[object XMLDocument]")
        let output: any = { cadena: "", elementos: [root], atributos: null };
        let xQuery_parse = xQuery_ast.ast; // AST que genera Jison
        let bloque = Bloque.Bloque(xQuery_parse, cadena.ambito, output); // Procesa las instrucciones
        if (bloque.error) {
            errors.push(bloque);
            return { arreglo_errores: errors, output: bloque.error }
        }

        output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: errors,
            output: bloque.cadena,
            encoding: encoding,
            codigo3d: bloque.codigo3d
        }
        errors = [];
        return output;

    } catch (error) {
        console.log(error);
        errors.push({ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" });
        let output = {
            arreglo_simbolos: [],
            arreglo_errores: errors,
            output: (error.message) ? String(error.message) : String(error),
            encoding: "utf-8"
        }
        errors = [];
        return output;
    }
}

export = { compile: compile };