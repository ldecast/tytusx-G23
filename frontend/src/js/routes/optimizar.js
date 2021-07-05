"use strict";
const OptiSintactico = require("../Optimizacion/Analizador/OptiSintactico");
function optimizar(req) {
    let errors = [];
    try {
        // Datos de la petición desde Angular
        let entrada = req.traduccion;
        let parser_c3d = require('../Optimizacion/Analizador/c3d_up');
        let ast = parser_c3d.parse(entrada);
        let graph = ast[0];
        let tree = ast[1];
        let salida = OptiSintactico.OptiSintactico.optimizarC3D(entrada, tree);
        let output = {
            arreglo_errores: errors,
            output: salida,
            dot: graph
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
            arreglo_errores: errors,
            output: (error.message) ? String(error.message) : String(error),
            encoding: "utf-8"
        };
        errors = [];
        return output;
    }
}
module.exports = { optimizar: optimizar };
