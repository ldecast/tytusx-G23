import { Nodo } from "../AST/Node";
import { Optimizador } from "./Optimizador";

export class OptiSintactico {

//converti el metodo en funcion para que devolviera algo

    public static optimizarC3D(texto: string, arbol: Nodo): Array<string> {
        let optimizador = new Optimizador();
        optimizador.inicializar();//salida = codigo optimizado // reportar
        let salida = optimizador.optimizar(texto, arbol);
        let reporteHTML = optimizador.reportar();

        let arreglo = [salida, reporteHTML]

        return arreglo;
    }

}