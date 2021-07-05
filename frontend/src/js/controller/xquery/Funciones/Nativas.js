"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Contexto_1 = require("../../Contexto");
const Enum_1 = require("../../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../../xpath/Expresion/Expresion"));
function Nativa(_instr, _ambito, _contexto, _id) {
    let tmp = new Contexto_1.Contexto(_contexto);
    let name = _instr.name;
    let parametros = _instr.parametros;
    let valores = [];
    for (let i = 0; i < parametros.length; i++) {
        const parametro = parametros[i];
        let contexto = Expresion_1.default(parametro, _ambito, tmp, _id);
        if (contexto === null || contexto.error)
            return contexto;
        if (contexto.constructor.name === "Contexto") {
            contexto = _ambito.extractValue(contexto);
        }
        valores.push(contexto);
    }
    let err = { error: `No se pudo ejecutar correctamente la función ${name}`, tipo: "Semántico", origen: "XQuery", linea: _instr.linea, columna: _instr.columna };
    try {
        let output;
        let tipo;
        switch (name) {
            case Enum_1.Tipos.TO_UPPERCASE:
                output = String(valores[0].valor).toUpperCase();
                tipo = Enum_1.Tipos.STRING;
                break;
            case Enum_1.Tipos.TO_LOWERCASE:
                output = String(valores[0].valor).toLocaleLowerCase();
                tipo = Enum_1.Tipos.STRING;
                break;
            case Enum_1.Tipos.TO_STRING:
                output = String(valores[0].valor);
                tipo = Enum_1.Tipos.STRING;
                break;
            case Enum_1.Tipos.TO_NUMBER:
                output = Number(valores[0].valor);
                tipo = Enum_1.Tipos.NUMBER;
                break;
            case Enum_1.Tipos.SUBSTRING:
                if (valores.length === 3)
                    output = String(valores[0].valor).substring(parseInt(valores[1].valor) - 1, parseInt(valores[2].valor) + 2);
                else if (valores.length === 2)
                    output = String(valores[0].valor).substring(parseInt(valores[1].valor) - 1);
                else
                    return { error: `La cantidad de ${valores.length} parámetros no coinciden con los esperados en la función substring.`, tipo: "Semántico", origen: "XQuery", linea: _instr.linea, columna: _instr.columna };
                tipo = Enum_1.Tipos.STRING;
                break;
            default:
                return null;
        }
        if (!output)
            return err;
        return {
            valor: output,
            tipo: tipo
        };
    }
    catch (error) {
        return {
            valor: valores[0].valor,
            tipo: (name === Enum_1.Tipos.TO_NUMBER) ? Enum_1.Tipos.NUMBER : Enum_1.Tipos.STRING
        };
    }
}
module.exports = Nativa;
