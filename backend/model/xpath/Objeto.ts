import { Tipos } from './Enum';

export class Objeto {

    newValue(_valor: string, _tipo: Tipos, _linea: string, _columna: string) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        }
    }

    newArithmetic(_opIzq: string, _opDer: string, _tipo: string, _linea: string, _columna: string) {
        let tipo: Tipos;
        switch (_tipo) {
            case "+":
                tipo = Tipos.OPERACION_SUMA;
                break;
            case "-":
                tipo = Tipos.OPERACION_RESTA;
                break;
            case "*":
                tipo = Tipos.OPERACION_MULTIPLICACION;
                break;
            case "/":
                tipo = Tipos.OPERACION_DIVISION;
                break;
            case "%":
                tipo = Tipos.OPERACION_MODULO;
                break;
            default:
                tipo = Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        }
    }

    newRelation(_opIzq: string, _opDer: string, _tipo: string, _linea: string, _columna: string) {
        let tipo: Tipos;
        switch (_tipo) {
            case "==":
                tipo = Tipos.RELACIONAL_IGUAL;
                break;
            case "!=":
                tipo = Tipos.RELACIONAL_DIFERENTE;
                break;
            case "<":
                tipo = Tipos.RELACIONAL_MENOR;
                break;
            case "<=":
                tipo = Tipos.RELACIONAL_MENORIGUAL;
                break;
            case ">":
                tipo = Tipos.RELACIONAL_MAYOR;
                break;
            case ">=":
                tipo = Tipos.RELACIONAL_MAYORIGUAL;
                break;
            default:
                tipo = Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        }
    }

    newLogic(_opIzq: string, _opDer: string, _tipo: string, _linea: string, _columna: string) {
        let tipo: Tipos;
        switch (_tipo) {
            case "||":
                tipo = Tipos.LOGICA_OR;
                break;
            case "&&":
                tipo = Tipos.LOGICA_AND;
                break;
            default:
                tipo = Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        }
    }

    newNodename(_nodename: string, _linea: string, _columna: string) {
        return {
            nodename: _nodename,
            tipo: Tipos.NODENAME,
            linea: _linea,
            columna: _columna
        }
    }

    newAxis(_expresion: any, _linea: string, _columna: string) {
        return {
            expresion: _expresion,
            tipo: Tipos.SELECT_FROM_ROOT,
            linea: _linea,
            columna: _columna
        }
    }

    newDoubleAxis(_expresion: any, _linea: string, _columna: string) {
        return {
            expresion: _expresion,
            tipo: Tipos.SELECT_FROM_CURRENT,
            linea: _linea,
            columna: _columna
        }
    }

    newCurrent(_expresion: any, _linea: string, _columna: string) {
        return {
            expresion: _expresion,
            tipo: Tipos.SELECT_CURRENT,
            linea: _linea,
            columna: _columna
        }
    }

    newParent(_expresion: any, _linea: string, _columna: string) {
        return {
            expresion: _expresion,
            tipo: Tipos.SELECT_PARENT,
            linea: _linea,
            columna: _columna
        }
    }

    newAttribute(_expresion: any, _linea: string, _columna: string) {
        return {
            expresion: _expresion,
            tipo: Tipos.SELECT_ATTRIBUTES,
            linea: _linea,
            columna: _columna
        }
    }

}