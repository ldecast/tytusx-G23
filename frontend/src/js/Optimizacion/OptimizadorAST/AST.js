"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
class AST {
    constructor(instrucciones) {
        this.instrucciones = instrucciones;
        this.etiquetas = new Array();
        this.etiquetasBetadas = new Array();
    }
    AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.etiquetas = new Array();
        this.etiquetasBetadas = new Array();
    }
    existeEtiqueta(id) {
        this.etiquetas.forEach(Element => {
            //let comparacion = Element.id.Equals(id);
            if (Element.id == id)
                return true;
        });
        return false;
    }
    agregarEtiqueta(etiqueta) {
        this.etiquetas.push(etiqueta);
    }
    obtenerEtiqueta(texto) {
        this.etiquetas.forEach(Element => {
            if (Element.id == texto)
                return Element;
        });
        return null;
    }
    obtenerSiguienteEtiqueta(texto) {
        let contador = 0;
        this.etiquetas.forEach(Element => {
            if (Element.id == texto) {
                if (this.etiquetas.length > contador + 1)
                    return this.etiquetas[contador + 1];
            }
        });
        return null;
    }
}
exports.AST = AST;
