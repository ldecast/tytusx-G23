"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptiSintactico = void 0;
const Optimizador_1 = require("./Optimizador");
class OptiSintactico {
    //converti el metodo en funcion para que devolviera algo
    static optimizarC3D(texto, arbol) {
        let optimizador = new Optimizador_1.Optimizador();
        optimizador.inicializar(); //salida = codigo optimizado // reportar
        let salida = optimizador.optimizar(texto, arbol);
        let reporteHTML = optimizador.reportar();
        let arreglo = [salida, reporteHTML];
        return arreglo;
    }
}
exports.OptiSintactico = OptiSintactico;
