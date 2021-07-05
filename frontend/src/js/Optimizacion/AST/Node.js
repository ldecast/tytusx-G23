"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    constructor(ide, nom, val, fila, columna) {
        this.id = ide;
        this.nombre = nom;
        this.valor = val;
        this.linea = fila;
        this.columna = columna;
        this.hijos = [];
    }
    NuevoHijo(hijo) {
        this.hijos.push(hijo);
    }
    imprimir() {
        console.log(this.id + '-*' + this.nombre);
        this.hijos.forEach(element => {
            if (element.valor == '') {
                element.imprimir();
            }
            else {
                console.log(element.valor + '*-' + element.id);
            }
        });
    }
}
exports.Nodo = Nodo;
