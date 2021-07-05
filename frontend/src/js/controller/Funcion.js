"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
class Funcion {
    constructor(_name, _parametros, _sentencias, _retorno, _linea, _columna) {
        this.name = _name;
        this.parametros = this.createParam(_parametros);
        this.sentencias = _sentencias;
        this.retorno = _retorno;
        this.linea = _linea;
        this.columna = _columna;
    }
    createParam(_params) {
        let parametros = [];
        _params.forEach(param => {
            parametros.push(new Parametro(param.id.variable, param.tipado, param.linea, param.columna));
        });
        return parametros;
    }
}
exports.Funcion = Funcion;
class Parametro {
    constructor(_id, _tipado, _linea, _columna) {
        this.id = _id;
        this.tipado = _tipado;
        this.linea = _linea;
        this.columna = _columna;
    }
}
