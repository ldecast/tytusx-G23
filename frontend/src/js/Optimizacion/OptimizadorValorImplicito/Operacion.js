"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.TIPO_OPERACION = void 0;
const Expresion_1 = require("../OptimizadorAST/Expresion");
const Simbolo_1 = require("../OptimizadorAST/Simbolo");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
var TIPO_OPERACION;
(function (TIPO_OPERACION) {
    TIPO_OPERACION[TIPO_OPERACION["SUMA"] = 1] = "SUMA";
    TIPO_OPERACION[TIPO_OPERACION["RESTA"] = 2] = "RESTA";
    TIPO_OPERACION[TIPO_OPERACION["MULTIPLICACION"] = 3] = "MULTIPLICACION";
    TIPO_OPERACION[TIPO_OPERACION["DIVISION"] = 4] = "DIVISION";
    TIPO_OPERACION[TIPO_OPERACION["MODULO"] = 5] = "MODULO";
    TIPO_OPERACION[TIPO_OPERACION["MAYOR_QUE"] = 6] = "MAYOR_QUE";
    TIPO_OPERACION[TIPO_OPERACION["MENOR_QUE"] = 7] = "MENOR_QUE";
    TIPO_OPERACION[TIPO_OPERACION["MAYOR_IGUA_QUE"] = 8] = "MAYOR_IGUA_QUE";
    TIPO_OPERACION[TIPO_OPERACION["MENOR_IGUA_QUE"] = 9] = "MENOR_IGUA_QUE";
    TIPO_OPERACION[TIPO_OPERACION["IGUAL_IGUAL"] = 10] = "IGUAL_IGUAL";
    TIPO_OPERACION[TIPO_OPERACION["DIFERENTE_QUE"] = 11] = "DIFERENTE_QUE";
    TIPO_OPERACION[TIPO_OPERACION["PRIMITIVO"] = 12] = "PRIMITIVO";
    TIPO_OPERACION[TIPO_OPERACION["ID"] = 13] = "ID";
})(TIPO_OPERACION = exports.TIPO_OPERACION || (exports.TIPO_OPERACION = {}));
class Operacion extends Expresion_1.Expresion {
    constructor() {
        super();
        this.tipo = 0;
        this.operadorIzq = null;
        this.operadorDer = null;
        this.valor = null;
        this.linea = 0;
        this.columna = 0;
    }
    Primitivo(valor) {
        this.tipo = TIPO_OPERACION.PRIMITIVO;
        this.valor = valor;
    }
    Identificador(valor, linea, columna) {
        this.tipo = TIPO_OPERACION.ID;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    Operation(izq, der, operacion, linea, columna) {
        this.tipo = operacion;
        this.operadorIzq = izq;
        this.operadorDer = der;
        this.linea = linea;
        this.columna = columna;
    }
    optimizarCodigo() {
        let antes = this.generarAugus();
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus() {
        //PRIMITIVOS
        if (this.tipo == TIPO_OPERACION.PRIMITIVO) {
            let primvalor = this.valor;
            return primvalor.generarAugus();
        }
        //IDENTIFICADORES
        else if (this.tipo == TIPO_OPERACION.ID) {
            let simbolo = new Simbolo_1.Simbolo(this.valor, this.linea, this.columna);
            return simbolo.generarAugus();
        }
        //SUMA
        else if (this.tipo == TIPO_OPERACION.SUMA)
            return this.operadorIzq.generarAugus() + "+" + this.operadorDer.generarAugus();
        //RESTA
        else if (this.tipo == TIPO_OPERACION.RESTA)
            return this.operadorIzq.generarAugus() + "-" + this.operadorDer.generarAugus();
        //MULTIPLICACION
        else if (this.tipo == TIPO_OPERACION.MULTIPLICACION)
            return this.operadorIzq.generarAugus() + "*" + this.operadorDer.generarAugus();
        //DIVISION
        else if (this.tipo == TIPO_OPERACION.DIVISION)
            return this.operadorIzq.generarAugus() + "/" + this.operadorDer.generarAugus();
        //MODULO
        else if (this.tipo == TIPO_OPERACION.MODULO)
            return this.operadorIzq.generarAugus() + "%" + this.operadorDer.generarAugus();
        //MAYOR QUE
        else if (this.tipo == TIPO_OPERACION.MAYOR_QUE)
            return this.operadorIzq.generarAugus() + ">" + this.operadorDer.generarAugus();
        //MAYOR IGUAL
        else if (this.tipo == TIPO_OPERACION.MAYOR_IGUA_QUE)
            return this.operadorIzq.generarAugus() + ">=" + this.operadorDer.generarAugus();
        //MENOR
        else if (this.tipo == TIPO_OPERACION.MENOR_QUE)
            return this.operadorIzq.generarAugus() + "<" + this.operadorDer.generarAugus();
        //MENOR IGUAL
        else if (this.tipo == TIPO_OPERACION.MENOR_IGUA_QUE)
            return this.operadorIzq.generarAugus() + "<=" + this.operadorDer.generarAugus();
        //IGUAL
        else if (this.tipo == TIPO_OPERACION.IGUAL_IGUAL)
            return this.operadorIzq.generarAugus() + "==" + this.operadorDer.generarAugus();
        //DIFERENTE
        else if (this.tipo == TIPO_OPERACION.DIFERENTE_QUE)
            return this.operadorIzq.generarAugus() + "!=" + this.operadorDer.generarAugus();
        else
            return "";
    }
    invertirCondicion() {
        //IGUAL
        if (this.tipo == TIPO_OPERACION.IGUAL_IGUAL)
            return this.operadorIzq.generarAugus() + "!=" + this.operadorDer.generarAugus();
        //DIFERENTE
        else if (this.tipo == TIPO_OPERACION.DIFERENTE_QUE)
            return this.operadorIzq.generarAugus() + "==" + this.operadorDer.generarAugus();
        else
            return this.generarAugus();
    }
    //MI REGLA 5
    validarRegla1(varActual, varAsigna, varPrevia, varAsignaPrevia) {
        let varA = varAsignaPrevia;
        let varB = varPrevia;
        if (varA == varActual && varB == varAsigna)
            return true;
        return false;
    }
    //MI REGLA 3
    validarRegla4() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorIzq.generarAugus();
            let value2 = this.operadorDer.generarAugus();
            if (value == value2)
                return true;
        }
        else if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.ID) {
            let value = this.operadorIzq.generarAugus();
            let value2 = this.operadorDer.generarAugus();
            if (value == value2)
                return true;
        }
        return false;
    }
    //MI REGLA 4
    validarRegla5() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorIzq.generarAugus();
            let value2 = this.operadorDer.generarAugus();
            if (value != value2)
                return true;
        }
        return false;
    }
    //MI REGLA 6
    validarRegla8(id) {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorIzq.valor == id) {
                let value = this.operadorDer.generarAugus();
                if (value == "0")
                    return true;
            }
        }
        else if (this.operadorDer.tipo == TIPO_OPERACION.ID && this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorDer.valor == id) {
                let value = this.operadorIzq.generarAugus();
                if (value == "0") {
                    return true;
                }
            }
        }
        return false;
    }
    //MI REGLA 7
    validarRegla9(id) {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorIzq.valor == id) {
                let value = this.operadorDer.generarAugus();
                if (value == "0")
                    return true;
            }
        }
        return false;
    }
    //MI REGLA 8
    validarRegla10(id) {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorIzq.valor == id) {
                let value = this.operadorDer.generarAugus();
                if (value == "1")
                    return true;
            }
        }
        else if (this.operadorDer.tipo == TIPO_OPERACION.ID && this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorDer.valor == id) {
                let value = this.operadorIzq.generarAugus();
                if (value == "1") {
                    return true;
                }
            }
        }
        return false;
    }
    //MI REGLA 9
    validarRegla11(id) {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            if (this.operadorIzq.valor == id) {
                let value = this.operadorDer.generarAugus();
                if (value == "1")
                    return true;
            }
        }
        return false;
    }
    //MI REGLA 10 revisar esta regla en caso de que me encuentre con problemas
    validarRegla12() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "0")
                return this.operadorIzq.valor;
        }
        else if (this.operadorDer.tipo == TIPO_OPERACION.ID && this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorIzq.generarAugus();
            if (value == "0")
                return this.operadorDer.valor;
        }
        return "";
    }
    //MI REGLA 11
    validarRegla13() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "0")
                return this.operadorIzq.valor;
        }
        return "";
    }
    //MI REGLA 12
    validarRegla14() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "1")
                return this.operadorIzq.valor;
        }
        else if (this.operadorDer.tipo == TIPO_OPERACION.ID && this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorIzq.generarAugus();
            if (value == "1")
                return this.operadorDer.valor;
        }
        return "";
    }
    //MI REGLA 13
    validarRegla15() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "1")
                return this.operadorIzq.valor;
        }
        return "";
    }
    //MI REGLA 14
    validarRegla16() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.ID && this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "2")
                return this.operadorIzq.valor + "+" + this.operadorIzq.valor;
        }
        return "";
    }
    //MI REGLA 15
    validarRegla17() {
        if (this.operadorDer.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorDer.generarAugus();
            if (value == "0")
                return "0";
        }
        else if (this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO) {
            let value = this.operadorIzq.generarAugus();
            if (value == "0")
                return "0";
        }
        return "";
    }
    //MI REGLA 16
    validarRegla18() {
        if (this.operadorIzq.tipo == TIPO_OPERACION.PRIMITIVO && this.operadorDer.tipo == TIPO_OPERACION.ID) {
            let value = this.operadorIzq.generarAugus();
            if (value == "0")
                return "0";
        }
        return "";
    }
}
exports.Operacion = Operacion;
