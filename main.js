(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "+qh/":
/*!***************************************************!*\
  !*** ./src/js/controller/xquery/Bloque_XQuery.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
const DobleEje_1 = __importDefault(__webpack_require__(/*! ../xpath/Instruccion/Selecting/DobleEje */ "67Yu"));
const Eje_1 = __importDefault(__webpack_require__(/*! ../xpath/Instruccion/Selecting/Eje */ "CG7/"));
const Axis_1 = __importDefault(__webpack_require__(/*! ../xpath/Instruccion/Selecting/Axis/Axis */ "pW4W"));
const For_1 = __importDefault(__webpack_require__(/*! ./For */ "9hMJ"));
const Let_1 = __importDefault(__webpack_require__(/*! ./Let */ "hC0Z"));
const If_1 = __importDefault(__webpack_require__(/*! ./If */ "tJF2"));
const Return_1 = __importDefault(__webpack_require__(/*! ./Return */ "JNzZ"));
let reset;
let output = [];
function Bloque(_instruccion, _ambito, _retorno, id) {
    output = [];
    reset = _retorno;
    let tmp;
    let i;
    for (i = 0; i < _instruccion.length; i++) {
        const instr = _instruccion[i];
        if (instr.tipo === Enum_1.Tipos.FOR_LOOP) {
            return For_1.default(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.IF_THEN_ELSE) {
            return If_1.default(instr.condicionIf, instr.instruccionesThen, instr.instruccionesElse, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_ROOT || instr.tipo === Enum_1.Tipos.EXPRESION) {
            tmp = Eje_1.default(instr.expresion, _ambito, _retorno, id);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_CURRENT) {
            tmp = DobleEje_1.default(instr.expresion, _ambito, _retorno, id);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_AXIS) {
            tmp = Axis_1.default.SA(instr, _ambito, _retorno, id);
        }
        else if (instr.tipo === Enum_1.Tipos.LET_CLAUSE) {
            Let_1.default(instr.id, instr.valor, _ambito, _retorno, id);
            continue;
        }
        else if (instr.tipo === Enum_1.Tipos.RETURN_STATEMENT) {
            return Return_1.default(instr.expresion, _ambito, [_retorno]);
        }
        else {
            return { error: "Error: Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: instr.linea, columna: instr.columna };
        }
        if (tmp === null || tmp.error)
            return tmp;
        if (tmp.notFound && i + 1 < _instruccion.length) {
            _retorno = reset;
            break;
        }
        _retorno = tmp;
    }
    if (i > 0 && _retorno)
        output.push(_retorno);
}
function getOutput(_instruccion, _ambito, _retorno) {
    let _bloque = Bloque(_instruccion, _ambito, _retorno);
    let cadena = (_bloque && _bloque.salida) ? (_bloque.salida) : writeOutput();
    let codigo3d = ""; // Agregar función que devuelva código tres direcciones
    console.log(cadena);
    return { cadena: cadena, codigo3d: codigo3d };
}
function getIterators(_instruccion, _ambito, _retorno, _id) {
    Bloque(_instruccion, _ambito, _retorno, _id);
    if (output.length > 0)
        return output[output.length - 1];
    else
        return null;
}
function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = path.texto;
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            let root = path.elementos;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    cadena += concatAttributes(attr);
                });
            }
            else {
                let root = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    cadena += extractAttributes(element, "");
                });
            }
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            let root = path.nodos;
            root.forEach((elemento) => {
                if (elemento.elementos) {
                    cadena += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena += concatText(elemento.textos);
                }
            });
        }
    }
    if (cadena)
        return replaceEntity(cadena.substring(1));
    return "No se encontraron elementos.";
}
function replaceEntity(cadena) {
    const _lessThan = /&lt;/gi;
    const _greaterThan = /&gt;/gi;
    const _ampersand = /&amp;/gi;
    const _apostrophe = /&apos;/gi;
    const _quotation = /&quot;/gi;
    var salida = cadena.replace(_lessThan, "<").replace(_greaterThan, ">").replace(_ampersand, "&").replace(_apostrophe, "\'").replace(_quotation, "\"");
    return salida;
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(child => {
            cadena += concatChilds(child, cadena);
        });
        cadena += ("\n</" + _element.id_close + ">");
    }
    else {
        if (_element.id_close === null)
            cadena += "/>";
        else {
            cadena += ">";
            cadena += (_element.value + "</" + _element.id_close + ">");
        }
    }
    return cadena;
}
function concatAttributes(_attribute) {
    return `\n${_attribute.id}="${_attribute.value}"`;
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += `\n${attribute.id}="${attribute.value}"`;
        });
    }
    return cadena;
}
function concatText(_text) {
    return `\n${_text}`;
}
module.exports = { Bloque: Bloque, getIterators: getIterators, getOutput: getOutput };


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/ldecast/JUNIO 2021/Compiladores 2/tytusx-G23/frontend/src/main.ts */"zUnb");


/***/ }),

/***/ 1:
/*!***************************!*\
  !*** ./streams (ignored) ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!*******************************!*\
  !*** ./extend-node (ignored) ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "67Yu":
/*!*******************************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Selecting/DobleEje.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../../Expresion/Expresion */ "gajf"));
const Predicate_1 = __webpack_require__(/*! ./Predicate */ "Iysv");
const Axis_1 = __importDefault(__webpack_require__(/*! ./Axis/Axis */ "pW4W"));
const Contexto_1 = __webpack_require__(/*! ../../../Contexto */ "ivfU");
const Variable_1 = __webpack_require__(/*! ../../../../model/xml/Ambito/Variable */ "C8dJ");
function DobleEje(_instruccion, _ambito, _contexto, id) {
    let _404 = "No se encontraron elementos.";
    if (Array.isArray(_contexto))
        _contexto = _contexto[0];
    let expresion = Expresion_1.default(_instruccion, _ambito, _contexto, id);
    if (expresion === null || expresion.error)
        return expresion;
    if (expresion.contextFromVar && _contexto.cadena === Enum_1.Tipos.NONE)
        _contexto = expresion.contextFromVar;
    let predicate = _instruccion.predicate;
    let root = new Contexto_1.Contexto();
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS || expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent({ id: expresion.valor, tipo: "@" }, _contexto, _ambito, predicate, id);
        if (root.atributos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.nodos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.texto.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.SELECT_AXIS) {
        root = Axis_1.default.GetAxis(expresion.axisname, expresion.nodetest, expresion.predicate, _contexto, _ambito, true, id);
        return root;
    }
    else {
        root.error = { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.error || root.getLength() === 0)
        root.notFound = _404;
    return root;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito, _condicion, id) {
    if (_contexto.getLength() > 0)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else {
        _contexto.error = { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
        return _contexto;
    }
}
function getFromCurrent(_id, _contexto, _ambito, _condicion, id) {
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.texto = _ambito.searchAnyText(element, retorno.texto);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.texto = filter.filterElements(retorno.texto);
        }
        retorno.cadena = Enum_1.Tipos.TEXTOS;
        return retorno;
    }
    // Selecciona todos los descencientes (elementos y/o texto)
    else if (_id === "node()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.nodos = _ambito.nodesFunction(_ambito.tablaSimbolos[0], retorno.nodos);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.nodos = filter.filterElements(retorno.nodos);
        }
        retorno.cadena = Enum_1.Tipos.COMBINADO;
        return retorno;
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.atributos = _ambito.searchAnyAttributes(_id.id, element, retorno.atributos);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.atributos = filter.filterElements(retorno.atributos);
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
        return retorno;
    }
    // Selecciona el padre
    else if (_id === "..") {
        retorno = _contexto;
        retorno.elementos.push(_ambito.tablaSimbolos[0]);
        retorno.removeDuplicates();
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
    // Selecciona todos los descendientes con el id o en el caso que sea //*
    else {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs)
                element.childs.forEach(child => {
                    retorno.elementos = _ambito.searchNodes(_id, child, retorno.elementos);
                });
            else if (_id === ".")
                retorno.elementos.push(element);
        }
    }
    if (_condicion) {
        let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
        retorno.elementos = filter.filterElements(retorno.elementos);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    return retorno;
}
module.exports = DobleEje;


/***/ }),

/***/ "7QFG":
/*!*************************************************!*\
  !*** ./src/js/controller/xpath/Bloque_XPath.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
const DobleEje_1 = __importDefault(__webpack_require__(/*! ./Instruccion/Selecting/DobleEje */ "67Yu"));
const Eje_1 = __importDefault(__webpack_require__(/*! ./Instruccion/Selecting/Eje */ "CG7/"));
const Axis_1 = __importDefault(__webpack_require__(/*! ./Instruccion/Selecting/Axis/Axis */ "pW4W"));
let reset;
let output = [];
function Bloque(_instruccion, _ambito, _retorno) {
    let tmp;
    reset = _retorno;
    for (let i = 0; i < _instruccion.length; i++) {
        const camino = _instruccion[i]; // En caso de tener varios caminos
        for (let j = 0; j < camino.length; j++) {
            const instr = camino[j];
            if (instr.tipo === Enum_1.Tipos.SELECT_FROM_ROOT) {
                tmp = Eje_1.default(instr.expresion, _ambito, _retorno);
            }
            else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_CURRENT) {
                tmp = DobleEje_1.default(instr.expresion, _ambito, _retorno);
            }
            else if (instr.tipo === Enum_1.Tipos.SELECT_AXIS) {
                tmp = Axis_1.default.SA(instr, _ambito, _retorno);
            }
            else {
                return { error: "Error: Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: instr.linea, columna: instr.columna };
            }
            if (tmp.notFound) {
                _retorno = reset;
                break;
            }
            if (tmp.error)
                return tmp;
            _retorno = tmp;
        }
        output.push(_retorno);
        _retorno = reset;
    }
}
function XPath(_instruccion, _ambito, _retorno) {
    Bloque(_instruccion, _ambito, _retorno);
    let cadena = writeOutput();
    let codigo3d = ""; // Agregar función que devuelva código tres direcciones
    return { cadena: cadena, codigo3d: codigo3d };
}
function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = path.texto;
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            let root = path.elementos;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    cadena += concatAttributes(attr);
                });
            }
            else {
                let root = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    cadena += extractAttributes(element, "");
                });
            }
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            let root = path.nodos;
            root.forEach((elemento) => {
                if (elemento.elementos) {
                    cadena += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena += concatText(elemento.textos);
                }
            });
        }
    }
    output = [];
    if (cadena)
        return replaceEntity(cadena.substring(1));
    return "No se encontraron elementos.";
}
function replaceEntity(cadena) {
    const _lessThan = /&lt;/gi;
    const _greaterThan = /&gt;/gi;
    const _ampersand = /&amp;/gi;
    const _apostrophe = /&apos;/gi;
    const _quotation = /&quot;/gi;
    var salida = cadena.replace(_lessThan, "<").replace(_greaterThan, ">").replace(_ampersand, "&").replace(_apostrophe, "\'").replace(_quotation, "\"");
    return salida;
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(child => {
            cadena += concatChilds(child, cadena);
        });
        cadena += ("\n</" + _element.id_close + ">");
    }
    else {
        if (_element.id_close === null)
            cadena += "/>";
        else {
            cadena += ">";
            cadena += (_element.value + "</" + _element.id_close + ">");
        }
    }
    return cadena;
}
function concatAttributes(_attribute) {
    return `\n${_attribute.id}="${_attribute.value}"`;
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += `\n${attribute.id}="${attribute.value}"`;
        });
    }
    return cadena;
}
function concatText(_text) {
    return `\n${_text}`;
}
module.exports = XPath;


/***/ }),

/***/ "7f3N":
/*!*******************************************!*\
  !*** ./src/js/controller/xquery/Where.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(__webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf"));
function WhereClause(_instruccion, _ambito, _iterators) {
    var _a;
    let iterators = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { Contexto }
        let _x = Expresion_1.default(_instruccion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _instruccion = [comparissons]
        if (_x)
            iterators = iterators.concat(_x);
    }
    // console.log(iterators)
    return iterators;
}
module.exports = WhereClause;


/***/ }),

/***/ "9ArA":
/*!**************************************!*\
  !*** ./src/js/analyzers/xpath_up.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xpath_up = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,20],$V3=[1,16],$V4=[1,17],$V5=[1,18],$V6=[1,19],$V7=[1,21],$V8=[1,22],$V9=[1,23],$Va=[1,12],$Vb=[1,13],$Vc=[1,14],$Vd=[1,15],$Ve=[1,24],$Vf=[1,25],$Vg=[1,26],$Vh=[1,27],$Vi=[1,28],$Vj=[1,29],$Vk=[1,30],$Vl=[1,31],$Vm=[1,32],$Vn=[1,33],$Vo=[1,34],$Vp=[1,35],$Vq=[1,36],$Vr=[5,6],$Vs=[5,6,9,10,24,35,36,37,38,39,40,41,42,43,44,45,48,49,50,51,52,53,54,55,56,57,58,59,60],$Vt=[5,6,9,10,16,18,19,20,21,22,23,24,25,26,28,29,30,31,32,35,36,37,38,39,40,41,42,43,44,45,48,49,50,51,52,53,54,55,56,57,58,59,60],$Vu=[2,13],$Vv=[1,44],$Vw=[5,6,9,10,14,16,18,19,20,21,22,23,24,25,26,28,29,30,31,32,35,36,37,38,39,40,41,42,43,44,45,48,49,50,51,52,53,54,55,56,57,58,59,60],$Vx=[1,56],$Vy=[1,57],$Vz=[1,66],$VA=[1,67],$VB=[1,68],$VC=[1,69],$VD=[1,70],$VE=[1,71],$VF=[1,72],$VG=[1,73],$VH=[1,74],$VI=[1,75],$VJ=[1,76],$VK=[1,77],$VL=[1,78],$VM=[16,18,19,20,21,22,23,24,25,26,28,29,30,31,32],$VN=[16,18,19,20,21,28,29,30,31,32],$VO=[16,18,19,20,21,22,23,28,29,30,31,32];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"XPATH_U":4,"EOF":5,"tk_line":6,"XPATH":7,"QUERY":8,"tk_2bar":9,"tk_bar":10,"EXP_PR":11,"AXIS":12,"CORCHET":13,"tk_corA":14,"E":15,"tk_corC":16,"CORCHETP":17,"tk_menorigual":18,"tk_menor":19,"tk_mayorigual":20,"tk_mayor":21,"tk_mas":22,"tk_menos":23,"tk_asterisco":24,"tk_div":25,"tk_mod":26,"tk_ParA":27,"tk_ParC":28,"tk_or":29,"tk_and":30,"tk_equal":31,"tk_diferent":32,"FUNC":33,"PRIMITIVO":34,"tk_id":35,"tk_attribute_d":36,"tk_attribute_s":37,"num":38,"tk_punto":39,"tk_2puntos":40,"tk_arroba":41,"tk_text":42,"tk_last":43,"tk_position":44,"tk_node":45,"AXISNAME":46,"tk_4puntos":47,"tk_ancestor":48,"tk_ancestor2":49,"tk_attribute":50,"tk_child":51,"tk_descendant":52,"tk_descendant2":53,"tk_following":54,"tk_following2":55,"tk_namespace":56,"tk_parent":57,"tk_preceding":58,"tk_preceding2":59,"tk_self":60,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"tk_line",9:"tk_2bar",10:"tk_bar",14:"tk_corA",16:"tk_corC",18:"tk_menorigual",19:"tk_menor",20:"tk_mayorigual",21:"tk_mayor",22:"tk_mas",23:"tk_menos",24:"tk_asterisco",25:"tk_div",26:"tk_mod",27:"tk_ParA",28:"tk_ParC",29:"tk_or",30:"tk_and",31:"tk_equal",32:"tk_diferent",35:"tk_id",36:"tk_attribute_d",37:"tk_attribute_s",38:"num",39:"tk_punto",40:"tk_2puntos",41:"tk_arroba",42:"tk_text",43:"tk_last",44:"tk_position",45:"tk_node",47:"tk_4puntos",48:"tk_ancestor",49:"tk_ancestor2",50:"tk_attribute",51:"tk_child",52:"tk_descendant",53:"tk_descendant2",54:"tk_following",55:"tk_following2",56:"tk_namespace",57:"tk_parent",58:"tk_preceding",59:"tk_preceding2",60:"tk_self"},
productions_: [0,[3,2],[4,3],[4,1],[7,2],[7,1],[8,2],[8,2],[8,1],[8,1],[13,4],[13,3],[17,1],[17,0],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,1],[11,2],[11,2],[34,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,2],[34,2],[33,3],[33,3],[33,3],[33,3],[12,3],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 	prod_1 = grammar_stack.pop();
					prod_2 = grammar_stack.pop();
			 		grammar_stack.push({'ini -> XPATH_U EOF': [prod_2, prod_1]});
					grammar_report =  getGrammarReport(grammar_stack);
                    cst = getCST(grammar_stack);
                    console.log(grammar_report);
                    let arbol_ast = getASTTree($$[$0-1]);
					ast = { ast: $$[$0-1], errors: errors, cst :cst, grammar_report:grammar_report,  arbolAST : arbol_ast }; return ast;
					
break;
case 2:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2];
								 prod_1 = grammar_stack.pop();
								 prod_2 = grammar_stack.pop();
			 					 grammar_stack.push({'XPATH_U -> XPATH_U tk_line XPATH {S1.push(S3); SS = S1;}': [prod_2, 'token: tk_line\t Lexema: ' + $$[$0-2], prod_1]}); 
break;
case 3:
 this.$=[$$[$0]];
				  prod_1 = grammar_stack.pop();
			 	  grammar_stack.push({'XPATH_U -> XPATH {SS = [S1]}': [prod_1]}); 
break;
case 4:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1];
					  prod_1 = grammar_stack.pop();
					  prod_2 = grammar_stack.pop();
			 		  grammar_stack.push({'XPATH -> XPATH QUERY {S1.push(S2); SS = S1;}': [prod_2, prod_1]}); 
break;
case 5:
 this.$=[$$[$0]];
			   prod_1 = grammar_stack.pop();
			   grammar_stack.push({'XPATH -> QUERY {SS = [S1]}': [prod_1]}); 
break;
case 6:
 this.$=builder.newDoubleAxis($$[$0], this._$.first_line, this._$.first_column+1);
					   prod_1 = grammar_stack.pop();
			 		   grammar_stack.push({'QUERY -> tk_2bar QUERY SS=builder.newDoubleAxis(Param);': ['token: tk_2bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 7:
 this.$=builder.newAxis($$[$0], this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
			 		 grammar_stack.push({'QUERY -> tk_bar QUERY {SS=builder.newAxis(Param);}': ['token: tk_bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 8:
 this.$=$$[$0];
			   prod_1 = grammar_stack.pop();
			   grammar_stack.push({'QUERY -> EXP_PR {SS=S1}': [prod_1]}); 
break;
case 9:
 this.$=$$[$0];
			 prod_1 = grammar_stack.pop();
			 grammar_stack.push({'QUERY -> AXIS {SS=S1}': [prod_1]}); 
break;
case 10:
 $$[$0-3].push(builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)); this.$=$$[$0-3];
									 prod_1 = grammar_stack.pop();
									 prod_2 = grammar_stack.pop();
						 			 grammar_stack.push({'CORCHET -> CORCHET tk_ParA E tk_ParC {S1.push(builder.NewPredicate(Param))}': [prod_2, 'token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 11:
 this.$=[builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)];
						 prod_1 = grammar_stack.pop();
						 grammar_stack.push({'CORCHET -> tk_corA E tk_corC {SS=builder.newPredicate(Param)}': ['token: tk_corA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_corC\t Lexema: ' + $$[$0]]}); 
break;
case 12:
 this.$=$$[$0];
					prod_1 = grammar_stack.pop();
					grammar_stack.push({'CORCHETP -> CORCHET {SS=S1;}': [prod_1]}); 
break;
case 13:
 this.$=null;
			grammar_stack.push({'CORCHETP -> Empty {SS=null}': ['EMPTY'] }); 
break;
case 14:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENORIGUAL, this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
				 		prod_2 = grammar_stack.pop();
					    grammar_stack.push({'E -> E tk_menorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 15:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_menor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 16:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYORIGUAL, this._$.first_line, this._$.first_column+1);
						  prod_1 = grammar_stack.pop();
				 		  prod_2 = grammar_stack.pop();
						  grammar_stack.push({'E -> E tk_mayorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 17:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_mayor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 18:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_SUMA, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mas E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mas\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 19:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				  	 grammar_stack.push({'E -> E tk_menos E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 20:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MULTIPLICACION, this._$.first_line, this._$.first_column+1);
						 prod_1 = grammar_stack.pop();
				 		 prod_2 = grammar_stack.pop();
				  		 grammar_stack.push({'E -> E tk_asterisco E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_asterisco\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 21:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_DIVISION, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_div E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_div\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 22:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MODULO, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mod E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mod\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 23:
 this.$=builder.newOperation(builder.newValue(0, Tipos.NUMBER, this.$.first_line, this.$.first_column+1), $$[$0], Tipos.OPERACION_RESTA, this.$.first_line, this.$.first_column+1); 
								prod_1 = grammar_stack.pop();
						  		grammar_stack.push({'E -: tk_menos E': ['token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]});
break;
case 24:
 this.$=$$[$0-1];
						  prod_1 = grammar_stack.pop();
						  grammar_stack.push({'E -> tk_ParA E tk_ParC {SS=S2}': ['token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 25:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_OR, this._$.first_line, this._$.first_column+1);
				  prod_1 = grammar_stack.pop();
				  prod_2 = grammar_stack.pop();
				  grammar_stack.push({'E -> E tk_or E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_or\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 26:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_AND, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_and E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_and\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 27:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_IGUAL, this._$.first_line, this._$.first_column+1); 
					 prod_1 = grammar_stack.pop();
					 prod_2 = grammar_stack.pop();
					 grammar_stack.push({'E -> E tk_equal E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_equal\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 28:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_DIFERENTE, this._$.first_line, this._$.first_column+1); 
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'E -> E tk_diferent E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_diferent\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 29:
 this.$=$$[$0];
			  prod_1 = grammar_stack.pop();
			  grammar_stack.push({'E -> QUERY {SS=S1}': [prod_1]}); 
break;
case 30:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'EXP_PR -> FUNC CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 31:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'EXP_PR -> PRIMITIVO CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 32:
 this.$=builder.newNodename($$[$0], this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -> tk_id {SS=builder.newNodename(Param)}':['token: tk_text\t Lexema: ' + $$[$0]]}); 
break;
case 33:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1);
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_d {SS=builder.newValue(Param)}':['token: tk_attribute_d\t Lexema: ' + $$[$0]]}); 
break;
case 34:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1); 
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_s {SS=builder.newValue(Param)}':['token: tk_attribute_s\t Lexema: ' + $$[$0]]}); 
break;
case 35:
 this.$=builder.newValue($$[$0], Tipos.NUMBER, this._$.first_line, this._$.first_column+1);
				grammar_stack.push({'PRIMITIVO -> num {SS=builder.newValue(Param)}':['token: num\t Lexema: ' + $$[$0]]}); 
break;
case 36:
 this.$=builder.newValue($$[$0], Tipos.ASTERISCO, this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -> tk_asterisco {SS=builder.newValue(Param)}':['token: tk_asterisco\t Lexema: ' + $$[$0]]}); 
break;
case 37:
 this.$=builder.newCurrent($$[$0], this._$.first_line, this._$.first_column+1); 
					 grammar_stack.push({'PRIMITIVO -> tk_punto {SS=builder.newCurrent(Param)}':['token: tk_punto\t Lexema: ' + $$[$0]]}); 
break;
case 38:
 this.$=builder.newParent($$[$0], this._$.first_line, this._$.first_column+1);
					   grammar_stack.push({'PRIMITIVO -> tk_2puntos {SS=builder.newParent(Param)}':['token: tk_2puntos\t Lexema: ' + $$[$0]]}); 
break;
case 39:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1);
							grammar_stack.push({'PRIMITIVO -> tk_arroba tk_id {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_id\t Lexema: ' + $$[$0]]}); 
break;
case 40:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1); 
							 grammar_stack.push({'PRIMITIVO -> tk_arroba tk_asterisco {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_asterisco\t Lexema: ' + $$[$0]]});
break;
case 41:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_TEXT, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_text tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_text\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 42:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_LAST, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_last tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_last\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 43:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_POSITION, this._$.first_line, this._$.first_column+1); 
									grammar_stack.push({'FUNC -> tk_position tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_position\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 44:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); 
								grammar_stack.push({'FUNC -> tk_node tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_node\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 45:
 this.$=builder.newAxisObject($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'AXIS -> AXISNAME tk_4puntos QUERY {SS=builder.newAxisObject(Param)}':[prod_2, 'token: tk_4puntos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 46:
 this.$ = Tipos.AXIS_ANCESTOR;
						grammar_stack.push({'AXISNAME -> tk_ancestor {SS = Tipos.AxisTipo}':['token: tk_ancestor\t Lexema: ' + $$[$0]]}); 
break;
case 47:
 this.$ = Tipos.AXIS_ANCESTOR_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_ancestor2 {SS = Tipos.AxisTipo}':['token: tk_ancestor2\t Lexema: ' + $$[$0]]}); 
break;
case 48:
 this.$ = Tipos.AXIS_ATTRIBUTE;
						grammar_stack.push({'AXISNAME -> tk_attribute {SS = Tipos.AxisTipo}':['token: tk_attribute\t Lexema: ' + $$[$0]]}); 
break;
case 49:
 this.$ = Tipos.AXIS_CHILD;
						grammar_stack.push({'AXISNAME -> tk_child {SS = Tipos.AxisTipo}':['token: tk_child\t Lexema: ' + $$[$0]]}); 
break;
case 50:
 this.$ = Tipos.AXIS_DESCENDANT;
						grammar_stack.push({'AXISNAME -> tk_descendant {SS = Tipos.AxisTipo}':['token: tk_descendant\t Lexema: ' + $$[$0]]}); 
break;
case 51:
 this.$ = Tipos.AXIS_DESCENDANT_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_descendant2 {SS = Tipos.AxisTipo}':['token: tk_descendant2\t Lexema: ' + $$[$0]]}); 
break;
case 52:
 this.$ = Tipos.AXIS_FOLLOWING;
						grammar_stack.push({'AXISNAME -> tk_following {SS = Tipos.AxisTipo}':['token: tk_following\t Lexema: ' + $$[$0]]}); 
break;
case 53:
 this.$ = Tipos.AXIS_FOLLOWING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_following2 {SS = Tipos.AxisTipo}':['token: tk_follownig2\t Lexema: ' + $$[$0]]}); 
break;
case 54:
 this.$ = Tipos.AXIS_NAMESPACE;
						grammar_stack.push({'AXISNAME -> tk_namespace {SS = Tipos.AxisTipo}':['token: tk_namespace\t Lexema: ' + $$[$0]]}); 
break;
case 55:
 this.$ = Tipos.AXIS_PARENT;
						grammar_stack.push({'AXISNAME -> tk_parent {SS = Tipos.AxisTipo}':['token: tk_parent\t Lexema: ' + $$[$0]]}); 
break;
case 56:
 this.$ = Tipos.AXIS_PRECEDING;
						grammar_stack.push({'AXISNAME -> tk_preceding {SS = Tipos.AxisTipo}':['token: tk_preceding\t Lexema: ' + $$[$0]]}); 
break;
case 57:
 this.$ = Tipos.AXIS_PRECEDING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_preceding2 {SS = Tipos.AxisTipo}':['token: tk_preceding2\t Lexema: ' + $$[$0]]}); 
break;
case 58:
 this.$ = Tipos.AXIS_SELF;
						grammar_stack.push({'AXISNAME -> tk_self {SS = Tipos.AxisTipo}':['token: tk_self\t Lexema: ' + $$[$0]]}); 
break;
}
},
table: [{3:1,4:2,7:3,8:4,9:$V0,10:$V1,11:7,12:8,24:$V2,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{1:[3]},{5:[1,37],6:[1,38]},o($Vr,[2,3],{11:7,12:8,33:9,34:10,46:11,8:39,9:$V0,10:$V1,24:$V2,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq}),o($Vs,[2,5]),{8:40,9:$V0,10:$V1,11:7,12:8,24:$V2,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:41,9:$V0,10:$V1,11:7,12:8,24:$V2,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},o($Vt,[2,8]),o($Vt,[2,9]),o($Vt,$Vu,{17:42,13:43,14:$Vv}),o($Vt,$Vu,{13:43,17:45,14:$Vv}),{47:[1,46]},{27:[1,47]},{27:[1,48]},{27:[1,49]},{27:[1,50]},o($Vw,[2,32]),o($Vw,[2,33]),o($Vw,[2,34]),o($Vw,[2,35]),o($Vw,[2,36]),o($Vw,[2,37]),o($Vw,[2,38]),{24:[1,52],35:[1,51]},{47:[2,46]},{47:[2,47]},{47:[2,48]},{47:[2,49]},{47:[2,50]},{47:[2,51]},{47:[2,52]},{47:[2,53]},{47:[2,54]},{47:[2,55]},{47:[2,56]},{47:[2,57]},{47:[2,58]},{1:[2,1]},{7:53,8:4,9:$V0,10:$V1,11:7,12:8,24:$V2,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},o($Vs,[2,4]),o($Vt,[2,6]),o($Vt,[2,7]),o($Vt,[2,30]),o($Vt,[2,12],{14:[1,54]}),{8:58,9:$V0,10:$V1,11:7,12:8,15:55,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},o($Vt,[2,31]),{8:59,9:$V0,10:$V1,11:7,12:8,24:$V2,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{28:[1,60]},{28:[1,61]},{28:[1,62]},{28:[1,63]},o($Vw,[2,39]),o($Vw,[2,40]),o($Vr,[2,2],{11:7,12:8,33:9,34:10,46:11,8:39,9:$V0,10:$V1,24:$V2,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq}),{8:58,9:$V0,10:$V1,11:7,12:8,15:64,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{16:[1,65],18:$Vz,19:$VA,20:$VB,21:$VC,22:$VD,23:$VE,24:$VF,25:$VG,26:$VH,29:$VI,30:$VJ,31:$VK,32:$VL},{8:58,9:$V0,10:$V1,11:7,12:8,15:79,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:80,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},o($VM,[2,29]),o($Vt,[2,45]),o($Vw,[2,41]),o($Vw,[2,42]),o($Vw,[2,43]),o($Vw,[2,44]),{16:[1,81],18:$Vz,19:$VA,20:$VB,21:$VC,22:$VD,23:$VE,24:$VF,25:$VG,26:$VH,29:$VI,30:$VJ,31:$VK,32:$VL},o($Vw,[2,11]),{8:58,9:$V0,10:$V1,11:7,12:8,15:82,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:83,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:84,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:85,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:86,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:87,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:88,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:89,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:90,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:91,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:92,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:93,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},{8:58,9:$V0,10:$V1,11:7,12:8,15:94,23:$Vx,24:$V2,27:$Vy,33:9,34:10,35:$V3,36:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,42:$Va,43:$Vb,44:$Vc,45:$Vd,46:11,48:$Ve,49:$Vf,50:$Vg,51:$Vh,52:$Vi,53:$Vj,54:$Vk,55:$Vl,56:$Vm,57:$Vn,58:$Vo,59:$Vp,60:$Vq},o($VM,[2,23]),{18:$Vz,19:$VA,20:$VB,21:$VC,22:$VD,23:$VE,24:$VF,25:$VG,26:$VH,28:[1,95],29:$VI,30:$VJ,31:$VK,32:$VL},o($Vw,[2,10]),o($VN,[2,14],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VN,[2,15],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VN,[2,16],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VN,[2,17],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VO,[2,18],{24:$VF,25:$VG,26:$VH}),o($VO,[2,19],{24:$VF,25:$VG,26:$VH}),o($VM,[2,20]),o($VM,[2,21]),o($VM,[2,22]),o([16,28,29],[2,25],{18:$Vz,19:$VA,20:$VB,21:$VC,22:$VD,23:$VE,24:$VF,25:$VG,26:$VH,30:$VJ,31:$VK,32:$VL}),o([16,28,29,30],[2,26],{18:$Vz,19:$VA,20:$VB,21:$VC,22:$VD,23:$VE,24:$VF,25:$VG,26:$VH,31:$VK,32:$VL}),o($VN,[2,27],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VN,[2,28],{22:$VD,23:$VE,24:$VF,25:$VG,26:$VH}),o($VM,[2,24])],
defaultActions: {24:[2,46],25:[2,47],26:[2,48],27:[2,49],28:[2,50],29:[2,51],30:[2,52],31:[2,53],32:[2,54],33:[2,55],34:[2,56],35:[2,57],36:[2,58],37:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  var attribute = '';
	var errors = [];
	let re = /[^\n\t\r ]+/g
	//let ast = null;
	let grammar_stack = [];

    function getGrammarReport(obj){
        let str = `<!DOCTYPE html>
                     <html lang="en" xmlns="http://www.w3.org/1999/html">
                     <head>
                         <meta charset="UTF-8">
                         <meta
                         content="width=device-width, initial-scale=1, shrink-to-fit=no"
                         name="viewport">
                         <!-- Bootstrap CSS -->
                         <link
                         crossorigin="anonymous"
                         href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                               integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                               rel="stylesheet">
                         <title>Title</title>
                         <style>
                             table, th, td {
                                 border: 1px solid black;
                             }
                             ul, .ul-tree-view {
                                 list-style-type: none;
                             }

                             #div-table{
                                 width: 1200px;
                                 margin: 100px;
                                 border: 3px solid #73AD21;
                             }

                             .ul-tree-view {
                                 margin: 0;
                                 padding: 0;
                             }

                             .caret {
                                 cursor: pointer;
                                 -webkit-user-select: none; /* Safari 3.1+ */
                                 -moz-user-select: none; /* Firefox 2+ */
                                 -ms-user-select: none; /* IE 10+ */
                                 user-select: none;
                             }

                             .caret::before {
                                 content: "\u25B6";
                                 color: black;
                                 display: inline-block;
                                 margin-right: 6px;
                             }

                             .caret-down::before {
                                 -ms-transform: rotate(90deg); /* IE 9 */
                                 -webkit-transform: rotate(90deg); /* Safari */'
                             transform: rotate(90deg);
                             }

                             .nested {
                                 display: none;
                             }

                             .active {
                                 display: block;
                             }

                             li span:hover {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             li span:hover + ul li  {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             .tree-view{
                                 display: inline-block;
                             }

                             li.string {
                                 list-style-type: square;
                             }
                             li.string:hover {
                                 color : white;
                                 background-color: #dc5b27;
                             }
                             .center {
                                margin: auto;
                                width: 50%;
                                border: 3px solid green;
                                padding-left: 15%;
                             }
                         </style>
                     </head>
                     <body>
                     <h1 class="center">Reporte Gramatical</h1>
                     <div class="tree-view">
                     <ul class="ul-tree-view" id="tree-root">`;


        str = str + buildGrammarReport(obj);


        str = str + `
                    </ul>
                    </ul>
                    </div>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                        <button onclick="fun1()">Expand Grammar Tree</button>

                     <div id="div-table">
                     <table style="width:100%">

                     <tr><th>Produccion</th><th>Cuerpo</th><th>Accion</th></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>ini</th><td>XPATH_U EOF</td><td>SS= S1</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>XPATH_U</th><td>XPATH_U tk_line XPATH</td><td>S1.push(S3); SS = S1;</td></tr>
                     <tr><th></th><td>XPATH_U tk_2line XPATH</td><td>S1.push(S3); SS = S1;</td></tr>
                     <tr><th></th><td>XPATH</td><td>SS = [S1]</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>XPATH</th><td>XPATH QUERY</td><td>S1.push(S2); SS = S1;</td></tr>
                     <tr><th></th><td>QUERY</td><td>SS = [S1]</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>QUERY</th><td>tk_2bar QUERY</td><td>SS=builder.newDoubleAxis(Param);</td></tr>
                     <tr><th></th><td>tk_bar QUERY</td><td>SS=builder.newAxis(Param);</td></tr>
                     <tr><th></th><td>EXP_PR</td><td>SS=S1</td></tr>
                     <tr><th></th><td>AXIS</td><td>SS=S1</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>CORCHET</th><td>CORCHET tk_corA E tk_corC</td><td>S1.push(builder.NewPredicate(Param))</td></tr>
                     <tr><th></th><td>tk_corA E tk_corC</td><td>SS=builder.newPredicate(Param)</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>CORCHETP</th><td>CORCHET</td><td>SS=S1</td></tr>
                     <tr><th></th><td>Empty</td><td>SS=null</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>E</th><td>E tk_menorigual E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_menor E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_mayorigual E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_mayor E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_mas E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_menos E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_asterisco E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_div E </td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_mod E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>tk_menos E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>tk_ParA E tk_ParC</td><td>SS=S2</td></tr>
                     <tr><th></th><td>E tk_or E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_and E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_equal E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>E tk_diferent E</td><td>SS=builder.newOperation(Param)</td></tr>
                     <tr><th></th><td>QUERY</td><td>SS=S1</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>EXP_PR</th><td>FUNC CORCHETP</td><td>SS=builder.newExpression(Param)</td></tr>
                     <tr><th></th><td>PRIMITIVO CORCHETEP</td><td>SS=builder.newExpression(Param)</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>PRIMITIVO</th><td>tk_id</td><td>SS=builder.newNodename(Param)</td></tr>
                     <tr><th></th><td>tk_attribute_d</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_attribute_s</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>num</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_asterisco</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_punto</td><td>SS=builder.newCurrent(Param)</td></tr>
                     <tr><th></th><td>tk_2puntos</td><td>SS=builder.newParent(Param)</td></tr>
                     <tr><th></th><td>tk_arroba tk_id</td><td>SS=builder.newAttribute(Param)</td></tr>
                     <tr><th></th><td>tk_arroba tk_asterisco</td><td>SS=builder.newAttribute(Param)</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>FUNC</th><td>tk_text tk_ParA tk_tk_ParC</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_last tk_ParA tk_ParC</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_position tk_ParA tk_ParC</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><th></th><td>tk_node tk_ParA tk_ParC</td><td>SS=builder.newValue(Param)</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>AXIS</th><td>AXISNAME tk_4puntos QUERY</td><td>SS=builder.newAxisObject(Param)</td></tr>
                     <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                     <tr><th>AXISNAME</th><td>tk_ancestor</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_ancestor2</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_attribute</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_child</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_descendant</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_descendant2</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_following</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_following2</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_namespace</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_parent</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_preceding</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_preceding2</td><td>SS = Tipos.'AxisTipo'</td></tr>
                     <tr><th></th><td>tk_self</td><td>SS = Tipos.'AxisTipo'</td></tr>

                         </table>
                     </div>

                     <script
                     src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js">
                     </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                             src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js">
                             </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                             src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js">
                             </script>

                             <script>
                                 var toggler = document.getElementsByClassName("caret");
                                 var i;

                                 for (i = 0; i < toggler.length; i++) {
                                     toggler[i].addEventListener("click", function() {
                                         this.parentElement
                                         .querySelector(".nested")
                                         .classList.toggle("active");
                                         this.classList.toggle("caret-down");
                                     });
                                 }


                                        function fun1() {
                                            if ($("#tree-root").length > 0) {

                                                $("#tree-root").find("li").each
                                                (
                                                    function () {
                                                        var $span = $("<span></span>");
                                                        //$(this).toggleClass("expanded");
                                                        if ($(this).find("ul:first").length > 0) {
                                                            $span.removeAttr("class");
                                                            $span.attr("class", "expanded");
                                                            $(this).find("ul:first").css("display", "block");
                                                            $(this).append($span);
                                                        }

                                                    }
                                                )
                                            }

                                        }

                             </script>

                     </body>
                     </html>`;
                     return str;
    }
    function buildGrammarReport(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                str = str + `<li class= "string">
                ${value}
                </li>
                `;
            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildGrammarReport(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){

                str = `<li class="grammar-tree"><span class="caret">
                ${key}
                </span>
                <ul class="nested">
                `;
                str = str + buildGrammarReport(obj[key]);
                str = str + `
                </ul>
                </li>`;
            }
        }
        return str;
    }

    function getCST(obj){
        let str = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
            <!-- Bootstrap CSS -->
            <link crossorigin="anonymous" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                  integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" rel="stylesheet">
            <title>Title</title>
            <style>

                #divheight{
                    height: 400px;
                    width: 1050px;
                }

                .nav-tabs > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

                .nav-tabs2 > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

            </style>

            <style>
                body {
                    font-family: sans-serif;
                    font-size: 15px;
                }

                .tree ul {
                    position: relative;
                    padding: 1em 0;
                    white-space: nowrap;
                    margin: 0 auto;
                    text-align: center;
                }
                .tree ul::after {
                    content: "";
                    display: table;
                    clear: both;
                }

                .tree li {
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    list-style-type: none;
                    position: relative;
                    padding: 1em 0.5em 0 0.5em;
                }
                .tree li::before, .tree li::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 50%;
                    border-top: 1px solid #ccc;
                    width: 50%;
                    height: 1em;
                }
                .tree li::after {
                    right: auto;
                    left: 50%;
                    border-left: 1px solid #ccc;
                }
                /*
                ul:hover::after  {
                    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport)
                }*/

                .tree li:only-child::after, .tree li:only-child::before {
                    display: none;
                }
                .tree li:only-child {
                    padding-top: 0;
                }
                .tree li:first-child::before, .tree li:last-child::after {
                    border: 0 none;
                }
                .tree li:last-child::before {
                    border-right: 1px solid #ccc;
                    border-radius: 0 5px 0 0;
                }
                .tree li:first-child::after {
                    border-radius: 5px 0 0 0;
                }

                .tree ul ul::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    border-left: 1px solid #ccc;
                    width: 0;
                    height: 1em;
                }

                .tree li a {
                    border: 1px solid #ccc;
                    padding: 0.5em 0.75em;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    color: #333;
                    position: relative;
                    top: 1px;
                }

                .tree li a:hover,
                .tree li a:hover + ul li a {
                    background: #e9453f;
                    color: #fff;
                    border: 1px solid #e9453f;
                }

                .tree li a:hover + ul li::after,
                .tree li a:hover + ul li::before,
                .tree li a:hover + ul::before,
                .tree li a:hover + ul ul::before {
                    border-color: #e9453f;
                }

            </style>
        </head>
        <body>

        <div class="tree">
            <ul id="tree-list">

            <!--AQUI-->
        `;
        str = str + buildCSTTree(obj);
        str = str + `
        </ul>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
        <script crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
        <script crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
        </body>
        </html>
        `;
        return str;
    }

    function buildCSTTree(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                let words = value.split('Lexema:');
                if(words.length == 2){
                    let lex = words[1];     //TODO check not go out of bounds
                    let token = words[0];
                    str = str + `<li><a href="">${token}</a><ul>
                    <li><a href="">${lex}
                    </a></li>
                    </ul></li>
                    `;
                }else{
                    str = str + `<li><a href="">${value}</a></li>
                    `;
                }

            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildCSTTree(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){
                const words = key.split('->');
                //console.log(words[3]);
                str = `<li><a href="">${words[0]}</a>
                <ul>
                `;
                str = str + buildCSTTree(obj[key]) + `
                </ul>
                </li>`;
            }
        }
        return str;
    }

	const { Objeto } = __webpack_require__(/*! ../model/xpath/Objeto */ "YKiq");
	const { Tipos } = __webpack_require__(/*! ../model/xpath/Enum */ "MEUw");
  const getASTTree = __webpack_require__(/*! ./ast_xpath */ "JxJB");
	var builder = new Objeto();
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Whitespace
break;
case 1:// XPATHComment
break;
case 2:// MultiLineComment
break;
case 3:// Declaration XML
break;
case 4:return 25
break;
case 5:return 38
break;
case 6:return 18
break;
case 7:return 20
break;
case 8:return 19
break;
case 9:return 21
break;
case 10:return 9
break;
case 11:return 10
break;
case 12:return 31
break;
case 13:return 40
break;
case 14:return 39
break;
case 15:return 47
break;
case 16:return 41
break;
case 17:return 14
break;
case 18:return 16
break;
case 19:return 27
break;
case 20:return 28
break;
case 21:return 24
break;
case 22:return 49
break;
case 23:return 48
break;
case 24:return 50
break;
case 25:return 51
break;
case 26:return 53
break;
case 27:return 52
break;
case 28:return 55
break;
case 29:return 54
break;
case 30:return 56
break;
case 31:return 57
break;
case 32:return 59
break;
case 33:return 58
break;
case 34:return 60
break;
case 35:return 45
break;
case 36:return 43
break;
case 37:return 42
break;
case 38:return 44
break;
case 39:return 6
break;
case 40:return 22
break;
case 41:return 23
break;
case 42:return 32
break;
case 43:return 29
break;
case 44:return 30
break;
case 45:return 26
break;
case 46:return 35
break;
case 47: attribute = ''; this.begin("string_doubleq"); 
break;
case 48: attribute += yy_.yytext; 
break;
case 49: attribute += "\""; 
break;
case 50: attribute += "\n"; 
break;
case 51: attribute += " ";  
break;
case 52: attribute += "\t"; 
break;
case 53: attribute += "\\"; 
break;
case 54: attribute += "\'"; 
break;
case 55: attribute += "\r"; 
break;
case 56: yy_.yytext = attribute; this.popState(); return 36; 
break;
case 57: attribute = ''; this.begin("string_singleq"); 
break;
case 58: attribute += yy_.yytext; 
break;
case 59: attribute += "\""; 
break;
case 60: attribute += "\n"; 
break;
case 61: attribute += " ";  
break;
case 62: attribute += "\t"; 
break;
case 63: attribute += "\\"; 
break;
case 64: attribute += "\'"; 
break;
case 65: attribute += "\r"; 
break;
case 66: yy_.yytext = attribute; this.popState(); return 37; 
break;
case 67:return 5
break;
case 68: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XPath", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:\(:[\s\S\n]*?:\))/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:<\?xml[\s\S\n]*?\?>)/i,/^(?:div\b)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/\/)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:::)/i,/^(?:@)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\()/i,/^(?:\))/i,/^(?:\*)/i,/^(?:ancestor-or-self\b)/i,/^(?:ancestor\b)/i,/^(?:attribute\b)/i,/^(?:child\b)/i,/^(?:descendant-or-self\b)/i,/^(?:descendant\b)/i,/^(?:following-sibling\b)/i,/^(?:following\b)/i,/^(?:namespace\b)/i,/^(?:parent\b)/i,/^(?:preceding-sibling\b)/i,/^(?:preceding\b)/i,/^(?:self\b)/i,/^(?:node\b)/i,/^(?:last\b)/i,/^(?:text\b)/i,/^(?:position\b)/i,/^(?:\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:!=)/i,/^(?:or\b)/i,/^(?:and\b)/i,/^(?:mod\b)/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"string_singleq":{"rules":[58,59,60,61,62,63,64,65,66],"inclusive":false},"string_doubleq":{"rules":[48,49,50,51,52,53,54,55,56],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,57,67,68],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = xpath_up;
exports.Parser = xpath_up.Parser;
exports.parse = function () { return xpath_up.parse.apply(xpath_up, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(/*! fs */ 3).readFileSync(__webpack_require__(/*! path */ 4).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "9hMJ":
/*!*****************************************!*\
  !*** ./src/js/controller/xquery/For.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(__webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf"));
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
const Where_1 = __importDefault(__webpack_require__(/*! ./Where */ "7f3N"));
const OrderBy_1 = __importDefault(__webpack_require__(/*! ./OrderBy */ "mo2C"));
const Return_1 = __importDefault(__webpack_require__(/*! ./Return */ "JNzZ"));
const Let_1 = __importDefault(__webpack_require__(/*! ./Let */ "hC0Z"));
const If_1 = __importDefault(__webpack_require__(/*! ./If */ "tJF2"));
function ForLoop(_instruccion, _ambito, _contexto) {
    // console.log(_instruccion, 'instrucciones For')
    let declaracion = _instruccion.cuerpo;
    let iterators = [];
    declaracion.forEach((_declaracion) => {
        let it = Expresion_1.default(_declaracion, _ambito, _contexto);
        iterators = iterators.concat(it);
    });
    for (let i = 0; i < _instruccion.instrucciones.length; i++) {
        const instr = _instruccion.instrucciones[i];
        if (instr.tipo === Enum_1.Tipos.LET_CLAUSE) { // Declara una variable y la almacena de primero en el ámbito
            Let_1.default(instr.id, instr.valor, _ambito, _contexto);
        }
        if (instr.tipo === Enum_1.Tipos.WHERE_CONDITION) { // Filtrar los elementos de cada variable
            iterators = Where_1.default(instr.condiciones, _ambito, iterators);
        }
        if (instr.tipo === Enum_1.Tipos.ORDER_BY_CLAUSE) { // Ordenar los elementos según los parámetros
            let filter = OrderBy_1.default(instr.ordenes, _ambito, iterators);
            if (filter.length > 0)
                iterators = filter;
        }
        if (instr.tipo === Enum_1.Tipos.IF_THEN_ELSE) { // En caso venga un if dentro del for
            return If_1.default(instr.condicionIf, instr.instruccionesThen, instr.instruccionesElse, _ambito, _contexto);
        }
        if (instr.tipo === Enum_1.Tipos.RETURN_STATEMENT) { // Retorna la salida
            return Return_1.default(instr.expresion, _ambito, iterators);
        }
    }
}
module.exports = ForLoop;


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "C8dJ":
/*!*********************************************!*\
  !*** ./src/js/model/xml/Ambito/Variable.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor(_id, _tipo) {
        this.id = _id;
        this.tipo = _tipo;
    }
    setValue(_obj) {
        if (_obj.constructor.name === "Contexto") {
            this.contexto = _obj;
        }
        else {
            this.valor = _obj;
        }
    }
}
exports.Variable = Variable;


/***/ }),

/***/ "CG7/":
/*!**************************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Selecting/Eje.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../../Expresion/Expresion */ "gajf"));
const Predicate_1 = __webpack_require__(/*! ./Predicate */ "Iysv");
const Axis_1 = __importDefault(__webpack_require__(/*! ./Axis/Axis */ "pW4W"));
const Contexto_1 = __webpack_require__(/*! ../../../Contexto */ "ivfU");
const Variable_1 = __webpack_require__(/*! ../../../../model/xml/Ambito/Variable */ "C8dJ");
function Eje(_instruccion, _ambito, _contexto, id) {
    let _404 = "No se encontraron elementos.";
    if (Array.isArray(_contexto))
        _contexto = _contexto[0];
    let expresion = Expresion_1.default(_instruccion, _ambito, _contexto, id);
    // console.log(_instruccion, expresion, 2222222222)
    if (expresion === null || expresion.error)
        return expresion;
    if (expresion.contextFromVar && _contexto.cadena === Enum_1.Tipos.NONE)
        _contexto = expresion.contextFromVar;
    let predicate = _instruccion.predicate;
    let root = new Contexto_1.Contexto();
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS || expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, _contexto, _ambito, predicate, id);
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot({ id: expresion.valor, tipo: "@" }, _contexto, _ambito, predicate, id);
        if (root.atributos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.nodos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getSymbolFromRoot(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.texto.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.SELECT_AXIS) {
        root = Axis_1.default.GetAxis(expresion.axisname, expresion.nodetest, expresion.predicate, _contexto, _ambito, false, id);
        return root;
    }
    else {
        return expresion;
        // root.error = { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.error || root.getLength() === 0)
        root.notFound = _404;
    return root;
}
function getSymbolFromRoot(_nodename, _contexto, _ambito, _condicion, id) {
    if (_contexto.getLength() > 0)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion, id);
    else {
        _contexto.error = { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
        return _contexto;
    }
}
// Desde el ámbito actual
function getFromCurrent(_id, _contexto, _ambito, _condicion, id) {
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    // Selecciona el texto contenido únicamente en el nodo
    if (_id === "text()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.value) {
                retorno.pushText(element.value);
            }
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.texto = filter.filterElements(retorno.texto);
        }
        retorno.cadena = Enum_1.Tipos.TEXTOS;
        return retorno;
    }
    // Selecciona todos los hijos (elementos o texto)
    else if (_id === "node()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs)
                element.childs.forEach(child => {
                    retorno.nodos.push({ elementos: child });
                });
            else if (element.value)
                retorno.nodos.push({ textos: element.value });
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.nodos = filter.filterElements(retorno.nodos);
        }
        retorno.cadena = Enum_1.Tipos.COMBINADO;
        return retorno;
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs) {
                element.childs.forEach(child => {
                    retorno.elementos.push(child);
                });
            }
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.attributes)
                element.attributes.forEach((attribute) => {
                    if ((_id.id == attribute.id) || (_id.id === "*")) { // En caso de que sea un @id | @*
                        retorno.atributos.push(attribute);
                    }
                });
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.atributos = filter.filterElements(retorno.atributos);
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
        return retorno;
    }
    // Selecciona el padre
    else if (_id === "..") { // Manejar el regreso de atributos a su padre como la etiqueta misma !
        if (_contexto.atributos.length > 0) {
            for (let i = 0; i < _contexto.atributos.length; i++) {
                const attribute = _contexto.atributos[i];
                retorno.elementos = _ambito.searchDadFromAttribute(_ambito.tablaSimbolos[0], attribute, retorno.elementos);
            }
        }
        else if (_contexto.texto.length > 0) {
            for (let i = 0; i < _contexto.texto.length; i++) {
                const text = _contexto.texto[i];
                retorno.elementos = _ambito.searchDadFromText(_ambito.tablaSimbolos[0], text, retorno.elementos);
            }
        }
        else if (_contexto.nodos.length > 0) {
            for (let i = 0; i < _contexto.nodos.length; i++) {
                const node = _contexto.nodos[i].elementos;
                if (node)
                    retorno.elementos = _ambito.searchDadFromNode(_ambito.tablaSimbolos[0], node, retorno.elementos);
            }
        }
        else {
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const dad = _contexto.elementos[i].father;
                if (dad)
                    retorno.elementos = _ambito.searchDad(_ambito.tablaSimbolos[0], dad.id, dad.line, dad.column, retorno.elementos);
            }
        }
        // retorno.elementos = [...new Set(retorno.elementos)];
        retorno.removeDuplicates();
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        retorno = _contexto;
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
    // Búsqueda en los hijos por id
    else {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs) {
                element.childs.forEach((child) => {
                    retorno.elementos = _ambito.searchSingleNode(_id, child, retorno.elementos);
                });
            }
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
}
module.exports = Eje;


/***/ }),

/***/ "EfzR":
/*!***********************************************!*\
  !*** ./src/js/model/xml/Encoding/Encoding.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoding = void 0;
const Enum_1 = __webpack_require__(/*! ./Enum */ "VvCz");
class Encoding {
    constructor(encoding) {
        this.codes = Enum_1.Codes;
        if (encoding === null)
            this.encoding = this.codes.INVALID;
        else {
            this.encoding = encoding;
            this.getCode();
        }
    }
    getCode() {
        try {
            let decl = String(this.encoding).replace(/\s/g, '').toLowerCase();
            let code = decl.substr(decl.indexOf("encoding") + 8);
            switch (code) {
                case "utf-8":
                    this.encoding = this.codes.UTF8;
                    break;
                case "iso-8859-1":
                    this.encoding = this.codes.ISO8859_1;
                    break;
                case "ascii":
                    this.encoding = this.codes.ASCII;
                    break;
                default:
                    this.encoding = this.codes.INVALID;
                    break;
            }
        }
        catch (error) {
            this.encoding = this.codes.INVALID;
        }
    }
}
exports.Encoding = Encoding;


/***/ }),

/***/ "F5nt":
/*!********************************!*\
  !*** ./src/app/app.service.ts ***!
  \********************************/
/*! exports provided: AppService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppService", function() { return AppService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");


class AppService {
    constructor(http) {
        this.http = http;
        this._url = "http://localhost:3080";
    }
    compile(input) {
        return this.http.post(this._url + '/compile', input);
    }
    getAST(input) {
        return this.http.post(this._url + '/AST_report', input, {
            responseType: 'blob'
        });
    }
    getCST(input) {
        return this.http.post(this._url + '/CST_report', input, {
            responseType: 'blob'
        });
    }
    getDAG(input) {
        return this.http.post(this._url + '/DAG_report', input, {
            responseType: 'blob'
        });
    }
}
AppService.ɵfac = function AppService_Factory(t) { return new (t || AppService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"])); };
AppService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AppService, factory: AppService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "IRxg":
/*!*******************************************!*\
  !*** ./src/js/model/xml/Ambito/Global.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const Hijos_1 = __importDefault(__webpack_require__(/*! ./Hijos */ "iGkZ"));
class Global {
    constructor(expresiones, ambito) {
        this.expresiones = expresiones;
        this.ambito = ambito;
        Hijos_1.default.exec(expresiones, this.ambito);
    }
}
exports.Global = Global;


/***/ }),

/***/ "Iysv":
/*!********************************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Selecting/Predicate.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Predicate = void 0;
const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../../Expresion/Expresion */ "gajf"));
class Predicate {
    constructor(_predicado, _ambito, _contexto) {
        this.predicado = _predicado;
        this.contexto = _contexto;
        this.ambito = _ambito;
    }
    filterElements(_resultado) {
        var _a;
        let expresion;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i]; // En caso de tener varios predicados seguidos
            // console.log(e, "Predicado")
            let condicion = e.condicion;
            if (Array.isArray(e.condicion))
                condicion = e.condicion[0];
            // console.log(condicion, "Predicado")
            expresion = Expresion_1.default(condicion, this.ambito, this.contexto, (_a = this.contexto.variable) === null || _a === void 0 ? void 0 : _a.id);
            // console.log(expresion, "Expresion predicado")
            if (expresion === null || expresion.error)
                return expresion;
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _resultado.length)
                    _resultado = [];
                else
                    _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
                this.contexto.elementos = [];
                _resultado.forEach(element => {
                    if (element.attributes)
                        for (let i = 0; i < element.attributes.length; i++) {
                            const attribute = element.attributes[i];
                            if (expresion.atributo) { // Es una comparación
                                if (expresion.desigualdad) { // (<,<=,>,>=)
                                    if (expresion.atributo == attribute.id && this.operarDesigualdad(expresion.desigualdad, expresion.condicion, attribute.value)) {
                                        this.contexto.elementos.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.exclude) { // (!=)
                                    if (expresion.atributo == attribute.id && expresion.condicion != attribute.value) {
                                        this.contexto.elementos.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.atributo == attribute.id && expresion.condicion == attribute.value) { // (==)
                                    this.contexto.elementos.push(element);
                                    break;
                                }
                            }
                            else if (expresion.valor == attribute.id || expresion.valor == "*") { // No compara valor, sólo apila
                                this.contexto.elementos.push(element);
                                break;
                            }
                        }
                });
                return this.contexto.elementos;
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                this.contexto.elementos = [];
                for (let i = 0; i < _resultado.length; i++) {
                    const element = _resultado[i];
                    let text = element.value;
                    if (text) {
                        if (expresion.exclude) {
                            if (text != expresion.condicion) // text() != 'x'
                                this.contexto.elementos.push(element);
                        }
                        else if (text == expresion.condicion) // text() == 'x'
                            this.contexto.elementos.push(element);
                    }
                }
                return this.contexto.elementos;
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                let index = _resultado.length - 1;
                _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_POSITION) {
                return _resultado;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MENOR) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= _resultado.length)
                    index = _resultado.length - 1;
                let tmp = [];
                for (let i = index; i <= _resultado.length && i >= 0; i--) {
                    const element = _resultado[i];
                    tmp.push(element);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYOR) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= _resultado.length) {
                    _resultado = [];
                    return _resultado;
                }
                if (index <= 0)
                    index = 0;
                let tmp = [];
                for (let i = index; i < _resultado.length; i++) {
                    const element = _resultado[i];
                    tmp.push(element);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.ELEMENTOS && expresion.e1 && expresion.e2) {
                const e1 = expresion.e1;
                const e2 = expresion.e2;
                let condition = false;
                let tmp = [];
                for (let i = 0; i < this.contexto.elementos.length; i++) {
                    const element = this.contexto.elementos[i];
                    if (element.attributes) { // Hace match con un atributo
                        for (let j = 0; j < element.attributes.length; j++) {
                            const attribute = element.attributes[j];
                            condition = this.verificarDesigualdad(expresion.desigualdad, attribute.id, e1, attribute.value, e2);
                            if (condition) {
                                tmp.push(element);
                                break; // Sale del ciclo de atributos para pasar al siguiente elemento
                            }
                        }
                    }
                    if (element.childs) { // Hace match con algún hijo
                        for (let j = 0; j < element.childs.length; j++) {
                            const child = element.childs[j];
                            condition = this.verificarDesigualdad(expresion.desigualdad, child.id_open, e1, child.value, e2);
                            if (condition) {
                                tmp.push(element);
                                break;
                            }
                        }
                    }
                    // Hace match con el elemento
                    condition = this.verificarDesigualdad(expresion.desigualdad, element.id_open, e1, element.value, e2);
                    if (condition)
                        tmp.push(element);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.LOGICA_OR || expresion.tipo === Enum_1.Tipos.LOGICA_AND) {
                _resultado = expresion.elementos;
            }
            else if (expresion.tipo === Enum_1.Tipos.EXCLUDE) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= 0 && index < _resultado.length) {
                    let tmp = [];
                    for (let i = 0; i < _resultado.length; i++) {
                        const element = _resultado[i];
                        if (i != index)
                            tmp.push(element);
                    }
                    _resultado = tmp;
                }
            }
            else if (Array.isArray(expresion)) {
                let tmp = [];
                expresion.forEach((context) => {
                    tmp = tmp.concat(context.elementos);
                });
                this.contexto.elementos = tmp;
                return this.contexto.elementos;
            }
        }
        if (this.contexto.atributos.length > 0)
            this.contexto.atributos = _resultado;
        else if (this.contexto.texto.length > 0)
            this.contexto.texto = _resultado;
        else if (this.contexto.nodos.length > 0)
            this.contexto.nodos = _resultado;
        else
            this.contexto.elementos = _resultado;
        return _resultado;
    }
    operarDesigualdad(_tipo, _condicion, _valor) {
        switch (_tipo) {
            case Enum_1.Tipos.RELACIONAL_MAYOR:
                return _valor > _condicion;
            case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
                return _valor >= _condicion;
            case Enum_1.Tipos.RELACIONAL_MENOR:
                return _valor < _condicion;
            case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
                return _valor <= _condicion;
            default:
                return false;
        }
    }
    verificarDesigualdad(_tipo, v1, e1, v2, e2) {
        switch (_tipo) {
            case Enum_1.Tipos.RELACIONAL_MAYOR:
                return (v1 == e1 && v2 > e2);
            case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
                return (v1 == e1 && v2 >= e2);
            case Enum_1.Tipos.RELACIONAL_MENOR:
                return (v1 == e1 && v2 < e2);
            case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
                return (v1 == e1 && v2 <= e2);
            case Enum_1.Tipos.RELACIONAL_IGUAL:
                return (v1 == e1 && v2 == e2);
            case Enum_1.Tipos.RELACIONAL_DIFERENTE:
                return (v1 == e1 && v2 != e2);
            default:
                return false;
        }
    }
}
exports.Predicate = Predicate;


/***/ }),

/***/ "JNzZ":
/*!********************************************!*\
  !*** ./src/js/controller/xquery/Return.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf"));
const BuildElement_1 = __importDefault(__webpack_require__(/*! ./BuildElement */ "XhXr"));
function returnQuery(_expresion, _ambito, _iterators) {
    var _a;
    let expresion = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { Contexto }
        let _x = Expresion_1.default(_expresion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _expresion = [XPATH]
        if (_x)
            expresion = expresion.concat(_x);
        // console.log(_x)
    }
    let _str = BuildElement_1.default(expresion);
    if (_expresion.tipo === Enum_1.Tipos.HTML) {
        _str.unshift({ valor: '<' + _expresion.id_open + '>' });
        _str.push({ valor: '</' + _expresion.id_close + '>' });
    }
    return { salida: writeReturn(_str), parametros: expresion };
}
function writeReturn(_expresion) {
    // console.log(_expresion, 3444);
    let cadena = "";
    let max = getMaxLength(_expresion);
    // console.log(max);
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < _expresion.length; j++) {
            var exp = _expresion[j];
            if (exp.notFound)
                cadena += exp.notFound;
            if (exp.valor)
                cadena += exp.valor;
            else if (exp.items && exp.items.length > 0) {
                let shift = exp.items.shift();
                cadena += shift;
                exp.items.push(shift);
            }
            else if (Array.isArray(exp) && exp.length > 0) {
                let shift = exp.shift();
                if (shift.item)
                    cadena += shift.item;
                else
                    cadena += shift;
                exp = exp.push(shift);
            }
        }
        cadena += '\n';
    }
    // console.log(cadena)
    return cadena;
}
function getMaxLength(context) {
    let index = 1;
    context.forEach(element => {
        if (element.length > index)
            index = element.length;
        if (element.constructor.name == "Contexto")
            index = element.getLength();
    });
    return index;
}
module.exports = returnQuery;


/***/ }),

/***/ "JxJB":
/*!***************************************!*\
  !*** ./src/js/analyzers/ast_xpath.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function getASTTree(obj) {
  try {
    let str = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
      <!-- Bootstrap CSS -->
      <link crossorigin="anonymous" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" rel="stylesheet">
      <title>Title</title>
      <style>
        #divheight{
          height: 400px;
          width: 1050px;
        }
        .nav-tabs > li .close {
          margin: -2px 0 0 10px;
          font-size: 18px;
        }
        .nav-tabs2 > li .close {
          margin: -2px 0 0 10px;
          font-size: 18px;
        }
    
      </style>
    
      <style>
        body {
          font-family: sans-serif;
          font-size: 15px;
        }
    
        .tree ul {
          position: relative;
          padding: 1em 0;
          white-space: nowrap;
          margin: 0 auto;
          text-align: center;
        }
        .tree ul::after {
          content: "";
          display: table;
          clear: both;
        }
    
        .tree li {
          display: inline-block;
          vertical-align: top;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 1em 0.5em 0 0.5em;
        }
        .tree li::before, .tree li::after {
          content: "";
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 1px solid #ccc;
          width: 50%;
          height: 1em;
        }
        .tree li::after {
          right: auto;
          left: 50%;
          border-left: 1px solid #ccc;
        }
        /*
        ul:hover::after  {
            transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport)
        }*/
    
        .tree li:only-child::after, .tree li:only-child::before {
          display: none;
        }
        .tree li:only-child {
          padding-top: 0;
        }
        .tree li:first-child::before, .tree li:last-child::after {
          border: 0 none;
        }
        .tree li:last-child::before {
          border-right: 1px solid #ccc;
          border-radius: 0 5px 0 0;
        }
        .tree li:first-child::after {
          border-radius: 5px 0 0 0;
        }
    
        .tree ul ul::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 1px solid #ccc;
          width: 0;
          height: 1em;
        }
    
        .tree li a {
          border: 1px solid #ccc;
          padding: 0.5em 0.75em;
          text-decoration: none;
          display: inline-block;
          border-radius: 5px;
          color: #333;
          position: relative;
          top: 1px;
        }
    
        .tree li a:hover,
        .tree li a:hover + ul li a {
          background: #e9453f;
          color: #fff;
          border: 1px solid #e9453f;
        }
    
        .tree li a:hover + ul li::after,
        .tree li a:hover + ul li::before,
        .tree li a:hover + ul::before,
        .tree li a:hover + ul ul::before {
          border-color: #e9453f;
        }
    
    
      </style>
    </head>
    <body>
    
    
    
    <div class="tree">
      <ul id="tree-list">
    
        <!--AQUI-->
        `

    str = str + printObj(obj, 0, "")
    str = str + `</ul>
    
    
    
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
    <script crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
            src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
    <script crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
            src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    </body>
    </html>
    `
    return str;
  } catch (error) {
    return "";
  }
}


function printObj(obj, lines, name) {
  console.log(obj)
  let str = "";
  let str_ = "";
  if (Array.isArray(obj)) { //IS ARRAY
    for (let i = 0; i < obj.length; i++) {
      str = str + printObj(obj[i], lines, "");
    }
  } else if (typeof obj === 'object') {// IS OBJECT
    if (obj.tipo === 'SELECT_FROM_CURRENT' || obj.tipo === 'SELECT_FROM_ROOT') { // TODO select Parent
      str = `<li>`;
      str = str + printObj(obj.expresion, 0, (obj.tipo === 'SELECT_FROM_ROOT' ? "/" : "//"));
      str = str + getPredicados(obj.expresion);
      str = str + `</li>`
      console.log(str);
    } else if (obj.tipo === 'EXPRESION') {
      if (typeof obj.expresion === 'object') {
        str = `<a>` + name + getName(obj.expresion) + `</a>`;
      }
    }
  } else { // IS STRING
    for (let i = 0; i < lines; i++) {

      str_ = str_ + "- ";
    }
  }
  return str;
}



function getName(obj) {

  let str = "";
  if (obj.tipo === 'NODENAME') {
    //console.log(obj)
    return obj.nodename;
  } else if (obj.tipo === 'SELECT_PARENT') {
    return obj.expresion;
  } else if (obj.tipo === 'SELECT_CURRENT') {
    return obj.expresion;
  } else if (obj.tipo === 'ASTERISCO') {
    return obj.valor;
  } else if (obj.tipo === 'FUNCION_TEXT') {
    return obj.valor;
  } else if (obj.tipo === 'FUNCION_NODE') {
    return obj.valor;
  } else if (obj.tipo === 'SELECT_ATTRIBUTES') {
    return obj.expresion;
  } else {
    console.log("Error 1")
    console.log(obj)
  }
  return str
}

function getPredicados(obj) {
  let str = "";
  console.log(obj)
  if (obj.predicate !== null && obj.predicate !== undefined) {

    str = `<ul>\n`;
    for (let i = 0; i < obj.predicate.length; i++) {
      str = str + getPredicado(obj.predicate[i]);
    }
    str = str + `</ul>`;
  }
  return str;
}


function getPredicado(obj) {
  let str = ""
  if (obj.tipo === 'PREDICATE') {
    //str = `<li><a> ` + obj.condicion.tipo + `</a>
    //<ul>`
    str = str + getPredicado(obj.condicion);
    //str = str + `
    //</ul></li>`;
  } else if (obj.tipo === 'EXPRESION') { //TODO to check
    if ('valor' in obj.expresion) {
      str = `<li><a>` + obj.expresion.valor + `</a></li>
            `;

    } else if ('nodename' in obj.expresion) {
      str = `<li><a>` + obj.expresion.nodename + `</a></li>
            `;

    } else if (obj.expresion.tipo === 'SELECT_ATTRIBUTES') {
      str = `<li><a>` + "@" + obj.expresion.expresion + `</a></li>
            `;

    } else {
      console.log("error 2")
      console.log(obj)
    }


  } else {
    str = `<li><a>` + obj.tipo + `</a>
                <ul>`
    str = str + getPredicado(obj.opIzq);
    str = str + getPredicado(obj.opDer);
    str = str + `</ul></li>`
  }

  return str;
}

module.exports = getASTTree;

/***/ }),

/***/ "Kypw":
/*!*************************************!*\
  !*** ./src/js/model/xml/Element.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
class Element {
    constructor(id_open, attributes, value, childs, line, column, id_close) {
        this.id_open = id_open;
        this.id_close = id_close;
        this.attributes = attributes;
        this.value = value;
        this.childs = childs;
        this.line = line;
        this.column = column;
        this.father = null;
    }
    verificateNames() {
        if ((this.id_close !== null) && (this.id_open !== this.id_close))
            return "La etiqueta de apertura no coincide con la de cierre.";
        if (this.id_open.replace(/\s/g, '').toLowerCase() === "xml")
            return "No se puede nombrar una etiqueta con las letras XML";
        return "";
    }
    /*
    * Devuelve el HTML para el AST del XML
    * */
    getASTXMLTree() {
        let str = "";
        str = "<li><a href=''>" + this.id_open + "</a>";
        if (this.attributes == null && this.childs == null && this.value == null) {
            str = str + "</li>";
            return str;
        }
        str = str + "<ul>";
        if (this.attributes != null) {
            str = str + "<li><a href=''>Atributos</a><ul>";
            this.attributes.forEach((value) => {
                str = str + "<li><a href=''>Atributo</a><ul>";
                str = str + "<li><a href=''>" + value.id.slice(0, -1) + "</a></li>";
                str = str + "<li><a href=''>" + value.value + "</a></li>";
                str = str + "</ul></li>\n";
            });
            str = str + "</ul></li>";
        }
        if (this.value != null) {
            str = str + "<li><a href=''>Value</a><ul><li><a href=''>" + this.value + "</a></li></ul></li></ul></li>\n";
            return str;
        }
        if (this.id_close == null) {
            str = str + "</ul></li>\n";
            return str;
        }
        if (this.childs != null) {
            str = str + "<li><a href=''>Children</a><ul>";
            this.childs.forEach((value) => {
                str = str + value.getASTXMLTree();
            });
            str = str + "</ul></li>\n";
        }
        str = str + "</ul></li>\n";
        return str;
    }
    /*PROPERTIES*/
    set Att_Arr(value) {
        this.attributes = value;
    }
    set Children(value) {
        if (value == null) {
            return;
        }
        this.childs = value;
        this.childs.forEach((value) => {
            if (value == null) {
                return;
            }
            value.Father = this;
        });
    }
    set Close(value) {
        this.id_close = value;
    }
    set Value(value) {
        this.value = value;
    }
    set Father(value) {
        this.father = value;
    }
    get Children() {
        return this.childs;
    }
    /*DO NOT INCLUDE*/
    printTest(tab_num) {
        let str = "";
        str = this.getDashes(tab_num) + "Nodo: " + this.id_open + "\t";
        if (this.attributes != null) {
            str = str + "\tAtributos:\t";
            this.attributes.forEach((value) => {
                str = str + value.id + ": " + value.value + "   ";
            });
        }
        if (this.value != null) {
            str = str + "*** Valor *** " + this.value;
            console.log(str);
            return;
        }
        if (this.id_close == null) {
            console.log(str);
            return;
        }
        if (this.childs != null) {
            str = str + "*** Children **** ";
            console.log(str);
            this.childs.forEach((value) => {
                value.printTest(tab_num + 1);
            });
        }
    }
    getDashes(num) {
        let a = "";
        for (let i = 0; i < num * 2; i++) {
            a += "-";
        }
        return a;
    }
    printChildren() {
        if (this.childs == null) {
            return;
        }
        this.childs.forEach((value) => {
            console.log(this);
            value.printChildren();
        });
    }
}
exports.Element = Element;


/***/ }),

/***/ "MEUw":
/*!************************************!*\
  !*** ./src/js/model/xpath/Enum.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipos = void 0;
var Tipos;
(function (Tipos) {
    //Nodename unario
    Tipos["NODENAME"] = "NODENAME";
    Tipos["STRING"] = "STRING";
    Tipos["NUMBER"] = "NUMBER";
    Tipos["ASTERISCO"] = "ASTERISCO";
    Tipos["BOOLEANO"] = "BOOLEANO";
    // Selección
    Tipos["SELECT_FROM_ROOT"] = "SELECT_FROM_ROOT";
    Tipos["SELECT_FROM_CURRENT"] = "SELECT_FROM_CURRENT";
    Tipos["SELECT_CURRENT"] = "SELECT_CURRENT";
    Tipos["SELECT_PARENT"] = "SELECT_PARENT";
    Tipos["SELECT_ATTRIBUTES"] = "SELECT_ATTRIBUTES";
    Tipos["SELECT_AXIS"] = "SELECT_AXIS";
    // Aritméticas
    Tipos["OPERACION_SUMA"] = "OPERACION_SUMA";
    Tipos["OPERACION_RESTA"] = "OPERACION_RESTA";
    Tipos["OPERACION_MULTIPLICACION"] = "OPERACION_MULTIPLICACION";
    Tipos["OPERACION_DIVISION"] = "OPERACION_DIVISION";
    Tipos["OPERACION_MODULO"] = "OPERACION_MODULO";
    Tipos["OPERACION_NEGACION_UNARIA"] = "OPERACION_NEGACION_UNARIA";
    // Relacionales
    Tipos["RELACIONAL_IGUAL"] = "RELACIONAL_IGUAL";
    Tipos["RELACIONAL_DIFERENTE"] = "RELACIONAL_DIFERENTE";
    Tipos["RELACIONAL_MENOR"] = "RELACIONAL_MENOR";
    Tipos["RELACIONAL_MENORIGUAL"] = "RELACIONAL_MENORIGUAL";
    Tipos["RELACIONAL_MAYOR"] = "RELACIONAL_MAYOR";
    Tipos["RELACIONAL_MAYORIGUAL"] = "RELACIONAL_MAYORIGUAL";
    // Logicas
    Tipos["LOGICA_OR"] = "LOGICA_OR";
    Tipos["LOGICA_AND"] = "LOGICA_AND";
    // Funciones reservadas
    Tipos["FUNCION_LAST"] = "FUNCION_LAST";
    Tipos["FUNCION_POSITION"] = "FUNCION_POSITION";
    Tipos["FUNCION_TEXT"] = "FUNCION_TEXT";
    Tipos["FUNCION_NODE"] = "FUNCION_NODE";
    // Predicado
    Tipos["PREDICATE"] = "PREDICATE";
    Tipos["EXPRESION"] = "EXPRESION";
    // Combinacional
    Tipos["UNION"] = "SEVERAL_UNION";
    // Expresiones
    Tipos["ELEMENTOS"] = "ELEMENTOS";
    Tipos["ATRIBUTOS"] = "ATRIBUTOS";
    Tipos["TEXTOS"] = "TEXTOS";
    Tipos["COMBINADO"] = "COMBINADO";
    Tipos["EXCLUDE"] = "EXCLUDE";
    // Axisnames
    Tipos["AXIS_ANCESTOR"] = "ANCESTOR";
    Tipos["AXIS_ANCESTOR_OR_SELF"] = "ANCESTOR_OR_SELF";
    Tipos["AXIS_ATTRIBUTE"] = "AXIS_ATTRIBUTE";
    Tipos["AXIS_CHILD"] = "AXIS_CHILD";
    Tipos["AXIS_DESCENDANT"] = "AXIS_DESCENDANT";
    Tipos["AXIS_DESCENDANT_OR_SELF"] = "AXIS_DESCENDANT_OR_SELF";
    Tipos["AXIS_FOLLOWING"] = "AXIS_FOLLOWING";
    Tipos["AXIS_FOLLOWING_SIBLING"] = "AXIS_FOLLOWING_SIBLING";
    Tipos["AXIS_NAMESPACE"] = "AXIS_NAMESPACE";
    Tipos["AXIS_PARENT"] = "AXIS_PARENT";
    Tipos["AXIS_PRECEDING"] = "AXIS_PRECEDING";
    Tipos["AXIS_PRECEDING_SIBLING"] = "AXIS_PRECEDING_SIBLING";
    Tipos["AXIS_SELF"] = "AXIS_SELF";
    // Default
    Tipos["NONE"] = "NONE";
    // Fase 2
    Tipos["LET_CLAUSE"] = "LET_CLAUSE";
    Tipos["FOR_LOOP"] = "FOR_LOOP";
    Tipos["AT_KEYWORD"] = "AT_KEYWORD";
    Tipos["WHERE_CONDITION"] = "WHERE_CONDITION";
    Tipos["ORDER_BY_CLAUSE"] = "ORDER_BY_CLAUSE";
    Tipos["RETURN_STATEMENT"] = "RETURN_STATEMENT";
    Tipos["ASIGNACION"] = "ASIGNACION";
    Tipos["IF_THEN_ELSE"] = "IF_THEN_ELSE";
    Tipos["VARIABLE"] = "VARIABLE";
    Tipos["DECLARACION"] = "DECLARACION";
    Tipos["INTERVALO"] = "INTERVALO";
    Tipos["VALORES"] = "VALORES";
    Tipos["CONTENIDO"] = "CONTENIDO";
    Tipos["INYECCION"] = "INYECCION";
    Tipos["HTML"] = "HTML";
    Tipos["TIPADO_STRING"] = "TIPADO_STRING";
    Tipos["TIPADO_INTEGER"] = "TIPADO_INTEGER";
    Tipos["TIPADO_DECIMAL"] = "TIPADO_DECIMAL";
    Tipos["TIPADO_BOOLEANO"] = "TIPADO_BOOLEANO";
})(Tipos = exports.Tipos || (exports.Tipos = {}));


/***/ }),

/***/ "QFP7":
/*!*******************************************!*\
  !*** ./src/js/model/xml/Ambito/Ambito.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambito = void 0;
const Enum_1 = __webpack_require__(/*! ../../xpath/Enum */ "MEUw");
class Ambito {
    // tablaFunciones: Array<Funcion>;
    constructor(_anterior, _tipo) {
        this.anterior = _anterior;
        this.tipo = _tipo;
        this.tablaSimbolos = [];
        this.tablaVariables = [];
    }
    addSimbolo(_simbolo) {
        this.tablaSimbolos.push(_simbolo);
    }
    addVariabe(_variable) {
        this.tablaVariables.unshift(_variable);
    }
    existeVariable(_id) {
        for (let i = 0; i < this.tablaVariables.length; i++) {
            const variable = this.tablaVariables[i];
            if (_id == variable.id && (variable.contexto || variable.valor))
                return true;
        }
        return false;
    }
    getContextFromVar(_id) {
        for (let i = 0; i < this.tablaVariables.length; i++) {
            const variable = this.tablaVariables[i];
            if (_id == variable.id && (variable.contexto || variable.valor))
                return variable;
        }
        return null;
    }
    nodesFunction(_element, _nodes) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _nodes = this.nodesFunction(child, _nodes);
            });
        }
        if (_element.value) {
            _nodes.push({ elementos: _element });
            _nodes.push({ textos: _element.value });
        }
        return _nodes;
    }
    searchDad(_element, _nodename, _line, _column, _elements) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _elements = this.searchDad(child, _nodename, _line, _column, _elements);
            });
        }
        if (_nodename === _element.id_open && _element.line == _line && _element.column == _column) {
            _elements.push(_element);
        }
        return _elements;
    }
    searchDadFromAttribute(_element, _attribute, _elements) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _elements = this.searchDadFromAttribute(child, _attribute, _elements);
            });
        }
        if (_element.attributes) {
            _element.attributes.forEach(attr => {
                if (attr.id === _attribute.id && attr.line == _attribute.line && attr.column == _attribute.column) {
                    _elements.push(_element);
                    return _elements;
                }
            });
        }
        return _elements;
    }
    searchDadFromText(_element, _text, _elements) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _elements = this.searchDadFromText(child, _text, _elements);
            });
        }
        if (_element.value) {
            if (_element.value === _text) {
                _elements.push(_element);
                return _elements;
            }
        }
        if (_element.attributes) {
            _element.attributes.forEach(attr => {
                if (attr.value === _text) {
                    _elements.push(_element);
                    return _elements;
                }
            });
        }
        return _elements;
    }
    searchDadFromNode(_element, _node, _elements) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _elements = this.searchDadFromNode(child, _node, _elements);
            });
        }
        if (_element.value && _node.textos) {
            if (_element.value == _node.textos)
                _elements.push(_element);
        }
        if (_element.value && _node.elementos) {
            if (_element == _node.elementos)
                _elements.push(_element);
        }
        return _elements;
    }
    searchAnyAttributes(_id, _element, _array) {
        if (_element.attributes) {
            _element.attributes.forEach(attribute => {
                if (attribute.id === _id || _id === "*")
                    _array.push(attribute);
            });
        }
        if (_element.childs) {
            _element.childs.forEach(child => {
                _array = this.searchAnyAttributes(_id, child, _array);
            });
        }
        return _array;
    }
    searchAnyText(_element, _array) {
        if (_element.childs) {
            _element.childs.forEach(child => {
                _array = this.searchAnyText(child, _array);
            });
        }
        if (_element.value) {
            _array.push(_element.value);
        }
        return _array;
    }
    searchSingleNode(_nodename, _element, _array) {
        if (_nodename === _element.id_open) {
            _array.push(_element);
        }
        return _array;
    }
    searchNodes(_nodename, _element, _array) {
        if ((_nodename === _element.id_open) || (_nodename === "*")) {
            _array.push(_element);
        }
        if (_element.childs) {
            _element.childs.forEach(child => {
                _array = this.searchNodes(_nodename, child, _array);
            });
        }
        return _array;
    }
    compareCurrent(_currentNode, _array, _axisname) {
        switch (_axisname) {
            case Enum_1.Tipos.AXIS_ANCESTOR:
            case Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF:
                return this.getBefore(this.tablaSimbolos[0], _currentNode, _array, true, false, false);
            case Enum_1.Tipos.AXIS_PRECEDING:
                return this.getBefore(this.tablaSimbolos[0], _currentNode, _array, false, true, false);
            case Enum_1.Tipos.AXIS_PRECEDING_SIBLING:
                return this.getBefore(this.tablaSimbolos[0], _currentNode, _array, false, true, true);
            case Enum_1.Tipos.AXIS_FOLLOWING:
                return this.getFollowings(this.tablaSimbolos[0], _currentNode, _array, false, false);
            case Enum_1.Tipos.AXIS_FOLLOWING_SIBLING:
                return this.getFollowings(this.tablaSimbolos[0], _currentNode, _array, false, true);
        }
        return _array;
    }
    getBefore(_element, _currentNode, _array, isAncestor, isPreceding, isSibling) {
        if (_element == _currentNode)
            return false;
        if (_element.childs) {
            for (let i = 0; i < _element.childs.length; i++) {
                const child = _element.childs[i];
                if (isPreceding && isSibling)
                    _array.push(child);
                let a = this.getBefore(child, _currentNode, _array, isAncestor, isPreceding, isSibling);
                if (a === false)
                    return _array;
            }
            if (isPreceding && !isSibling)
                _array.push(_element);
        }
        if (isAncestor)
            _array.push(_element);
        return _array;
    }
    getFollowings(_element, _currentNode, _array, _found, isSibling) {
        if (_element == _currentNode)
            _found = true;
        if (_element.childs) {
            for (let i = 0; i < _element.childs.length; i++) {
                const child = _element.childs[i];
                this.getFollowings(child, _currentNode, _array, _found, isSibling);
                return _array;
            }
            if (_found && !isSibling)
                _array.push(_element);
        }
        if (_found && isSibling)
            _array.push(_element);
        return _array;
    }
    searchAncestors(_element, _currentNode, _array) {
        if (_element == _currentNode) {
            return { found: _array };
        }
        if (_element.childs) {
            let a;
            for (let i = 0; i < _element.childs.length; i++) {
                const child = _element.childs[i];
                a = this.searchAncestors(child, _currentNode, _array);
                if (a.found)
                    return a.found;
                else
                    _array = a;
            }
        }
        _array.push(_element);
        return _array;
    }
    getGlobal() {
        let e;
        for (e = this; e != null; e = e.anterior) {
            if (e.anterior === null)
                return e;
        }
        return null;
    }
    // Métodos para obtener la tabla de símbolos
    getArraySymbols() {
        let simbolos = [];
        try {
            this.tablaSimbolos.forEach(element => {
                if (element.attributes || element.childs) {
                    let dad = this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(dad);
                    if (element.attributes) {
                        element.attributes.forEach(attribute => {
                            simbolos.push(this.createSymbolAttribute(attribute, element.id_open));
                        });
                    }
                    if (element.childs) {
                        simbolos.concat(this.toRunTree(simbolos, element.childs, dad.id));
                    }
                }
                else {
                    let symb = this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(symb);
                }
            });
            return simbolos;
        }
        catch (error) {
            console.log(error);
            return simbolos;
        }
    }
    toRunTree(_symbols, _array, _father) {
        _array.forEach(element => {
            if (element.attributes || element.childs) {
                let dad = this.createSymbolElement(element, _father);
                _symbols.push(dad);
                if (element.attributes) {
                    element.attributes.forEach(attribute => {
                        _symbols.push(this.createSymbolAttribute(attribute, _father + "->" + element.id_open));
                    });
                }
                if (element.childs) {
                    let concat = _father + ("->" + dad.id);
                    _symbols.concat(this.toRunTree(_symbols, element.childs, concat));
                }
            }
            else {
                let symb = this.createSymbolElement(element, _father);
                _symbols.push(symb);
            }
        });
        return _symbols;
    }
    createSymbolElement(_element, _entorno) {
        let type = (_element.id_close === null ? 'Tag simple' : 'Tag doble');
        var symb = {
            id: _element.id_open,
            value: _element.value,
            tipo: type,
            entorno: _entorno,
            linea: _element.line,
            columna: _element.column
        };
        return symb;
    }
    createSymbolAttribute(_attribute, _entorno) {
        var symb = {
            id: _attribute.id,
            value: _attribute.value,
            tipo: "Atributo",
            entorno: _entorno,
            linea: _attribute.line,
            columna: _attribute.column
        };
        return symb;
    }
}
exports.Ambito = Ambito;


/***/ }),

/***/ "Rfe7":
/*!*********************************************************!*\
  !*** ./src/js/controller/xquery/Expresion/Expresion.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../../xpath/Expresion/Expresion */ "gajf"));
const Contexto_1 = __webpack_require__(/*! ../../Contexto */ "ivfU");
const Variable_1 = __webpack_require__(/*! ../../../model/xml/Ambito/Variable */ "C8dJ");
function ExpresionQuery(_expresion, _ambito, _contexto, id) {
    let tipo = _expresion.tipo;
    if (tipo === Enum_1.Tipos.DECLARACION) {
        let contexto = new Contexto_1.Contexto();
        let id = Expresion_1.default(_expresion.variable, _ambito, _contexto);
        let it = Expresion_1.default(_expresion.iterators, _ambito, _contexto);
        if (id.valor && it) {
            contexto = it;
            contexto.variable = new Variable_1.Variable(id.valor, Enum_1.Tipos.VARIABLE);
            if (_expresion.atKey)
                contexto.atCounter = new Variable_1.Variable(_expresion.atKey.variable, Enum_1.Tipos.VARIABLE);
        }
        return contexto;
    }
    if (tipo === Enum_1.Tipos.VARIABLE) {
        if (id && _contexto.cadena != Enum_1.Tipos.NONE) {
            if (id === _expresion.variable)
                return _contexto;
            else
                return null;
        }
        return { valor: _expresion.variable };
    }
    if (tipo === Enum_1.Tipos.INTERVALO) {
        let contexto = new Contexto_1.Contexto();
        let val_1 = Expresion_1.default(_expresion.valor1, _ambito, _contexto);
        if (!val_1 || val_1.error)
            return val_1;
        let val_2 = Expresion_1.default(_expresion.valor2, _ambito, _contexto);
        if (!val_2 || val_2.error)
            return val_2;
        for (let i = parseInt(val_1.valor); i <= parseInt(val_2.valor); i++) {
            contexto.items.push(i);
        }
        if (id)
            contexto.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
        contexto.cadena = Enum_1.Tipos.INTERVALO;
        return contexto;
    }
    if (tipo === Enum_1.Tipos.VALORES) {
        let contexto = new Contexto_1.Contexto();
        _expresion.valores.forEach((valor) => {
            const expresion = Expresion_1.default(valor, _ambito, _contexto);
            if (expresion && !expresion.error)
                contexto.items.push(parseInt(expresion.valor));
        });
        if (id)
            contexto.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
        contexto.cadena = Enum_1.Tipos.VALORES;
        return contexto;
    }
    if (tipo === Enum_1.Tipos.HTML) {
        let content = [];
        for (let i = 0; i < _expresion.value.length; i++) {
            const value = Expresion_1.default(_expresion.value[i], _ambito, _contexto, id);
            if (value)
                content = content.concat(value);
            // else content.pop();
        }
        return content;
    }
    if (tipo === Enum_1.Tipos.CONTENIDO) {
        return { valor: _expresion.contenido };
    }
    if (tipo === Enum_1.Tipos.INYECCION) {
        let e_0 = Expresion_1.default(_expresion.path[0], _ambito, _contexto, id);
        if (!e_0)
            return null;
        if (_contexto.items.length > 0)
            return _contexto;
        const Bloque = __webpack_require__(/*! ../Bloque_XQuery */ "+qh/");
        let elements = [];
        /* elements.push(e_0); */
        let _x = Bloque.getIterators(_expresion.path, _ambito, _contexto, id);
        if (_x && _x.length > 0) {
            _contexto = _x;
            elements = elements.concat(_x);
        }
        return elements;
    }
    else {
        // console.log(_expresion, 4444);
        const Bloque = __webpack_require__(/*! ../Bloque_XQuery */ "+qh/");
        let _iterators = Bloque.getIterators(_expresion, _ambito, _contexto, id);
        if (_iterators === null)
            return null;
        return _iterators;
    }
}
module.exports = ExpresionQuery;


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.service */ "F5nt");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @materia-ui/ngx-monaco-editor */ "0LvA");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");





function AppComponent_tr_99_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "th", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const i_r4 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](i_r4 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.tipo);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.entorno);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.linea);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.columna);
} }
function AppComponent_tr_121_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "th", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const i_r6 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](i_r6 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r5.tipo);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r5.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r5.origen);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r5.linea);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r5.columna);
} }
class AppComponent {
    constructor(appService) {
        this.appService = appService;
        this.EditorOptions = {
            theme: "vs-dark",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 13,
            minimap: {
                enabled: true
            },
            language: 'xml'
        };
        this.ConsoleOptions = {
            theme: "vs-dark",
            readOnly: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 14,
            minimap: {
                enabled: true
            },
            language: 'xml'
        };
        this.entrada = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>

<book category="COOKING">
  <title lang="en">Everyday Italian</title>
  <author>Giada De Laurentiis</author>
  <year>2005</year>
  <price>30.00</price>
</book>

<book category="CHILDREN">
  <title lang="en">Harry Potter</title>
  <author>J K. Rowling</author>
  <year>2005</year>
  <price>29.99</price>
</book>

<book category="WEB">
  <title lang="en">XQuery Kick Start</title>
  <author>James McGovern</author>
  <author>Per Bothner</author>
  <author>Kurt Cagle</author>
  <author>James Linn</author>
  <author>Vaidyanathan Nagarajan</author>
  <year>2003</year>
  <price>49.99</price>
</book>

<book category="WEB">
  <title lang="en">Learning XML</title>
  <author>Erik T. Ray</author>
  <year>2003</year>
  <price>39.95</price>
</book>

</bookstore>`;
        this.consulta = `for $x in /bookstore/book
where $x/price>30
order by $x/title
return $x/title`;
        this.salida = '';
        this.fname = '';
        this.simbolos = [];
        this.errores = [];
    }
    newTab() {
        window.open("/tytusx/20211SVAC/G23", "_blank");
    }
    closeTab() {
        window.close();
    }
    onSubmit() {
        var iconvlite = __webpack_require__(/*! iconv-lite */ "rPnE");
        let grammar_value = document.getElementById('grammar_selector').value;
        if (this.entrada != "" && this.consulta != "" && this.entrada != '<?xml version="1.0" encoding="UTF-8"?>') {
            const x = {
                xml: this.entrada,
                query: this.consulta,
                grammar: Number(grammar_value) // gramática 1=ascendente, 2=descendente
            };
            // llamo a la función compile que devuelve un objeto de retorno
            let data = __webpack_require__(/*! ../js/routes/compile */ "i+6F").compile(x);
            if (data.encoding == "ascii" || data.encoding == "latin1")
                this.salida = iconvlite.decode(data.output, data.encoding);
            else
                this.salida = data.output;
            this.errores = data.arreglo_errores;
            this.simbolos = data.arreglo_simbolos;
            console.log('Data received!');
        }
        else
            alert("Alguna entrada se encuentra vacía. Intente de nuevo.");
    }
    getAST() {
        this.simbolos = [];
        this.errores = [];
        if (this.consulta != "") {
            let grammar_value = document.getElementById('grammar_selector').value;
            const x = {
                xml: this.entrada,
                query: this.consulta,
                grammar: Number(grammar_value),
                report: "XPATH-AST",
            };
            let data = __webpack_require__(/*! ../js/routes/reports */ "ieEo").generateReport(x);
            this.salida = data.output;
            this.errores = data.arreglo_errores;
            this.exportFile(data.ast, "AST");
            console.log('AST received!');
        }
        else
            alert("Entrada vacía. No se puede generar el reporte AST.");
    }
    getCST() {
        this.simbolos = [];
        this.errores = [];
        if (this.entrada != "") {
            let grammar_value = document.getElementById('grammar_selector').value;
            const x = {
                xml: this.entrada,
                query: this.consulta,
                grammar: Number(grammar_value),
                report: "XML-CST",
            };
            let data = __webpack_require__(/*! ../js/routes/reports */ "ieEo").generateReport(x);
            this.salida = data.output;
            this.errores = data.arreglo_errores;
            this.exportFile(data.cst, "CST");
            console.log('CST received!');
        }
        else
            alert("Entrada vacía. No se puede generar el reporte CST.");
    }
    getGrammarReport() {
        this.simbolos = [];
        this.errores = [];
        if (this.entrada != "") {
            let grammar_value = document.getElementById('grammar_selector').value;
            const x = {
                xml: this.entrada,
                query: this.consulta,
                grammar: Number(grammar_value),
                report: "XML-GRAMMAR",
            };
            let data = __webpack_require__(/*! ../js/routes/reports */ "ieEo").generateReport(x);
            this.salida = data.output;
            this.errores = data.arreglo_errores;
            this.exportFile(data.grammar_report, "Grammar report");
            console.log('Grammar report received!');
        }
        else
            alert("Entrada vacía. No se puede generar el reporte gramatical.");
    }
    exportFile(data, fname) {
        var f = document.createElement('a');
        f.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        f.setAttribute('download', fname + '.html');
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            f.dispatchEvent(event);
        }
        else {
            f.click();
        }
        console.log('File exported!');
    }
    saveFile(id) {
        var f = document.createElement('a');
        let data = "";
        if (id === 1)
            data = this.entrada;
        else
            data = this.consulta;
        f.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        f.setAttribute('download', this.fname ? this.fname.replace("C:\\fakepath\\", "") : (id === 1 ? 'file.xml' : 'file.xpath'));
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            f.dispatchEvent(event);
        }
        else {
            f.click();
        }
        console.log('File saved!');
    }
    openDialog(id) {
        if (id === 1)
            document.getElementById("fileInput1").click();
        else
            document.getElementById("fileInput2").click();
    }
    readFile(event, id) {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = () => {
            var text = reader.result;
            if (text) {
                switch (id) {
                    case 1:
                        this.entrada = String(text);
                        break;
                    case 2:
                        this.consulta = String(text);
                        break;
                }
            }
        };
        reader.readAsText(input.files[0]);
        this.salida = '';
        console.log('File opened!');
    }
    cleanEditor(id) {
        switch (id) {
            case 1:
                this.entrada = "";
                break;
            case 2:
                this.consulta = "";
                break;
        }
        this.salida = "";
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 126, vars: 10, consts: [[1, "container-fluid", "title", "pt-2", "pb-1"], ["role", "toolbar", 1, "btn-toolbar"], [1, "mb-2", "btn-group"], [1, "dropdown"], ["type", "button", "id", "dropdownMenu", "data-toggle", "dropdown", "aria-haspopup", "flase", "aria-expanded", "false", 1, "btn", "btn-dark", "rounded-0"], [1, "dropdown-menu", "rounded-0", "bg-dark"], ["type", "button", 1, "dropdown-item", "text-white", "item", 3, "click"], ["id", "fileInput1", "type", "file", "accept", ".xml", 2, "display", "none", 3, "ngModel", "change", "ngModelChange"], ["id", "fileInput2", "type", "file", 2, "display", "none", 3, "ngModel", "change", "ngModelChange"], ["type", "button", 1, "btn", "btn-dark", "rounded-0", 3, "click"], ["type", "button", "id", "dropdownMenu", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "btn", "btn-dark", "rounded-0", "dropdown-toggle"], ["role", "group", 1, "btn-group", "sel_g"], ["id", "grammar_selector", 1, "form-select", "btn", "btn-dark", "rounded-0"], ["disabled", ""], ["selected", "", "value", "1"], ["value", "2"], [1, "container-fluid", "px-5", "pt-2"], ["novalidate", "", 1, "mb-4", 3, "ngSubmit"], ["iForm", "ngForm"], [1, "row", "mb-5", "file-editors"], [1, "col-lg-6", "col-sm-12"], [1, "my-0", "text-white", "subtitulo"], ["id", "entrada", "name", "entrada", 1, "codebox", 3, "options", "ngModel", "ngModelChange"], ["id", "consulta", "name", "consulta", 1, "codebox", 3, "options", "ngModel", "ngModelChange"], [1, "row", "text-center"], [1, "col-12"], ["type", "submit", 1, "btn", "btn-outline-light", "btn-lg"], [1, "fas", "fa-play-circle"], [1, "row", "mb-5", "file-console"], ["id", "salida", "name", "salida", 1, "console", 3, "options", "ngModel", "ngModelChange"], [1, "row", "my-5"], [1, "my-1", "text-white", "subtitulo"], [1, "table", "table-striped", "table-dark"], ["scope", "col"], ["scope", "col", 1, "text-center"], [4, "ngFor", "ngForOf"], [1, "mt-2", "mb-1", "text-white", "subtitulo"], [1, "text-center", "text-lg-start"], [1, "text-center", "p-3", 2, "background-color", "rgba(0, 0, 0, 0.2)"], [1, "foot", "my-0"], ["scope", "row"], [1, "text-center"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "TytusX");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Abrir ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_9_listener() { return ctx.openDialog(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function AppComponent_Template_input_change_11_listener($event) { return ctx.readFile($event, 1); })("ngModelChange", function AppComponent_Template_input_ngModelChange_11_listener($event) { return ctx.fname = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_12_listener() { return ctx.openDialog(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function AppComponent_Template_input_change_14_listener($event) { return ctx.readFile($event, 2); })("ngModelChange", function AppComponent_Template_input_ngModelChange_14_listener($event) { return ctx.fname = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Guardar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_19_listener() { return ctx.saveFile(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_21_listener() { return ctx.saveFile(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_23_listener() { return ctx.newTab(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Nueva pesta\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_25_listener() { return ctx.closeTab(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Cerrar pesta\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " Limpiar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_31_listener() { return ctx.cleanEditor(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_33_listener() { return ctx.cleanEditor(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Reportes ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_39_listener() { return ctx.getAST(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "AST");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_41_listener() { return ctx.getCST(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "CST");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_43_listener() { return ctx.getGrammarReport(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Gramatical");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Seleccione gram\u00E1tica");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Ascendente");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Descendente");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "form", 17, 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function AppComponent_Template_form_ngSubmit_54_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Entrada XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "ngx-monaco-editor", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_60_listener($event) { return ctx.entrada = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Editor de consultas");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "ngx-monaco-editor", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_64_listener($event) { return ctx.consulta = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](68, "i", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, " COMPILAR");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Consola de salida");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "ngx-monaco-editor", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_74_listener($event) { return ctx.salida = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](75, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](76, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](80, "Tabla de s\u00EDmbolos");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "table", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "thead");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](87, "Id");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "Tipo");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "Contenido");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, "\u00C1mbito");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, "Fila");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](96, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](97, "Columna");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](98, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](99, AppComponent_tr_99_Template, 15, 7, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](100, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "p", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](104, "Tabla de errores");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "table", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](106, "thead");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](108, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](109, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](110, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](111, "Tipo");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](112, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](113, "Error");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](114, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](115, "Origen");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](116, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](117, "Fila");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](118, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](119, "Columna");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](120, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](121, AppComponent_tr_121_Template, 13, 6, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](122, "footer", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](123, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](124, "p", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](125, " \u00A9 2021 Grupo 23 - Organizaci\u00F3n de Lenguajes y Compiladores 2 - TytusX ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.fname);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.fname);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](46);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx.EditorOptions)("ngModel", ctx.entrada);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx.EditorOptions)("ngModel", ctx.consulta);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx.ConsoleOptions)("ngModel", ctx.salida);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.simbolos);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.errores);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_z"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgForm"], _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_3__["MonacoEditorComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"]], styles: ["*[_ngcontent-%COMP%]:not(i) {\n    font-family: 'Varela Round', sans-serif;\n}\n\n.title[_ngcontent-%COMP%] {\n    background-color: #c1502e;\n    font-family: 'Varela Round', sans-serif;\n}\n\n.tbar[_ngcontent-%COMP%] {\n    height: 38px;\n}\n\n.file-editors[_ngcontent-%COMP%] {\n    height: 415px;\n}\n\n.file-console[_ngcontent-%COMP%] {\n    height: 375px;\n}\n\n.subtitulo[_ngcontent-%COMP%] {\n    font-size: large;\n}\n\n.foot[_ngcontent-%COMP%] {\n    color: lightgrey;\n}\n\nhr[_ngcontent-%COMP%] {\n    border-width: 0.13em;\n    border-color: gray;\n}\n\n.fc[_ngcontent-%COMP%]:first-letter {\n    text-transform: capitalize\n}\n\n.item[_ngcontent-%COMP%]:hover {\n    background-color: #292b2c;\n}\n\n.dropdown-menu[_ngcontent-%COMP%] {\n    padding: 0% !important;\n}\n\n.sel_g[_ngcontent-%COMP%] {\n    position: absolute;\n    right: 0%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksdUNBQXVDO0FBQzNDOztBQUVBO0lBQ0kseUJBQXlCO0lBQ3pCLHVDQUF1QztBQUMzQzs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksYUFBYTtBQUNqQjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLG9CQUFvQjtJQUNwQixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSTtBQUNKOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7QUFDYiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIio6bm90KGkpIHtcbiAgICBmb250LWZhbWlseTogJ1ZhcmVsYSBSb3VuZCcsIHNhbnMtc2VyaWY7XG59XG5cbi50aXRsZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2MxNTAyZTtcbiAgICBmb250LWZhbWlseTogJ1ZhcmVsYSBSb3VuZCcsIHNhbnMtc2VyaWY7XG59XG5cbi50YmFyIHtcbiAgICBoZWlnaHQ6IDM4cHg7XG59XG5cbi5maWxlLWVkaXRvcnMge1xuICAgIGhlaWdodDogNDE1cHg7XG59XG5cbi5maWxlLWNvbnNvbGUge1xuICAgIGhlaWdodDogMzc1cHg7XG59XG5cbi5zdWJ0aXR1bG8ge1xuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XG59XG5cbi5mb290IHtcbiAgICBjb2xvcjogbGlnaHRncmV5O1xufVxuXG5ociB7XG4gICAgYm9yZGVyLXdpZHRoOiAwLjEzZW07XG4gICAgYm9yZGVyLWNvbG9yOiBncmF5O1xufVxuXG4uZmM6Zmlyc3QtbGV0dGVyIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZVxufVxuXG4uaXRlbTpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzI5MmIyYztcbn1cblxuLmRyb3Bkb3duLW1lbnUge1xuICAgIHBhZGRpbmc6IDAlICFpbXBvcnRhbnQ7XG59XG5cbi5zZWxfZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwJTtcbn0iXX0= */"] });


/***/ }),

/***/ "TxV8":
/*!***************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Logica.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function Logica(_expresion, _ambito, _contexto) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _contexto, _expresion.tipo);
    if (operators === null || operators.error)
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.LOGICA_AND:
            return and(operators.op1, operators.op2, _contexto);
        case Enum_1.Tipos.LOGICA_OR:
            return or(operators.op1, operators.op2, _contexto);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _contexto, _tipo) {
    const Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    let op1 = Expresion((Array.isArray(_opIzq)) ? (_opIzq[0]) : (_opIzq), _ambito, _contexto);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion((Array.isArray(_opDer)) ? (_opDer[0]) : (_opDer), _ambito, _contexto);
    if (op2 === null || op2.error)
        return op2;
    let tipo = _tipo;
    // console.log(op1, 888, op2)
    if (op1.tipo === Enum_1.Tipos.ELEMENTOS && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
        return { op1: op1, op2: op2, tipo: tipo };
    }
    if (op1.tipo === Enum_1.Tipos.ATRIBUTOS && op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
        return { op1: op1, op2: op2, tipo: tipo };
    }
    else
        return { error: "Relación lógica no aceptable.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
}
function and(_opIzq, _opDer, _contexto) {
    const op1 = _opIzq; // Tiene sus dos operadores y desigualdad
    const op2 = _opDer;
    let context1 = filterElements(op1.e1, op1.e2, op1.desigualdad, _contexto);
    let context2 = filterElements(op2.e1, op2.e2, op2.desigualdad, _contexto);
    let tmp = [];
    for (let i = 0; i < context1.length; i++) {
        const element1 = context1[i];
        for (let j = 0; j < context2.length; j++) {
            const element2 = context2[j];
            if (element1 == element2) {
                tmp.push(element1);
                break;
            }
        }
    }
    return { tipo: Enum_1.Tipos.LOGICA_AND, elementos: tmp };
}
function or(_opIzq, _opDer, _contexto) {
    const op1 = _opIzq; // Tiene sus dos operadores y desigualdad
    const op2 = _opDer;
    let context1 = filterElements(op1.e1, op1.e2, op1.desigualdad, _contexto);
    let context2 = filterElements(op2.e1, op2.e2, op2.desigualdad, _contexto);
    let tmp = context1.concat(context2.filter((item) => context1.indexOf(item) < 0));
    return { tipo: Enum_1.Tipos.LOGICA_OR, elementos: tmp };
}
function filterElements(e1, e2, desigualdad, _contexto) {
    let condition = false;
    let array = _contexto.getArray();
    let tmp = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.attributes) { // Hace match con un atributo
            for (let j = 0; j < element.attributes.length; j++) {
                const attribute = element.attributes[j];
                condition = verificarDesigualdad(desigualdad, attribute.id, e1, attribute.value, e2);
                if (condition) {
                    tmp.push(element);
                    break; // Sale del ciclo de atributos para pasar al siguiente elemento
                }
            }
        }
        if (element.childs) { // Hace match con algún hijo
            for (let j = 0; j < element.childs.length; j++) {
                const child = element.childs[j];
                condition = verificarDesigualdad(desigualdad, child.id_open, e1, child.value, e2);
                // console.log(desigualdad, child.id_open, e1, child.value, e2);
                if (condition) {
                    tmp.push(element);
                    break;
                }
            }
        }
        if (element.id_open) {
            condition = verificarDesigualdad(desigualdad, element.id_open, e1, element.value, e2); // Hace match con el elemento
            if (condition)
                tmp.push(element);
        }
        else if (element.value) {
            condition = verificarDesigualdad(desigualdad, element.id, e1, element.value, e2); // Hace match con el elemento
            if (condition)
                tmp.push(element);
        }
    }
    return tmp;
}
function verificarDesigualdad(_tipo, v1, e1, v2, e2) {
    switch (_tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return (v1 == e1 && v2 > e2);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return (v1 == e1 && v2 >= e2);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return (v1 == e1 && v2 < e2);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return (v1 == e1 && v2 <= e2);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return (v1 == e1 && v2 == e2);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return (v1 == e1 && v2 != e2);
        default:
            return false;
    }
}
module.exports = Logica;


/***/ }),

/***/ "VvCz":
/*!*******************************************!*\
  !*** ./src/js/model/xml/Encoding/Enum.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Codes = void 0;
var Codes;
(function (Codes) {
    Codes["UTF8"] = "utf-8";
    Codes["ASCII"] = "ascii";
    Codes["ISO8859_1"] = "latin1";
    Codes["INVALID"] = "invalid";
})(Codes = exports.Codes || (exports.Codes = {}));


/***/ }),

/***/ "WHhi":
/*!*****************************************!*\
  !*** ./src/js/model/xquery/XQObjeto.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.XQObjeto = void 0;
const Enum_1 = __webpack_require__(/*! ../xpath/Enum */ "MEUw");
class XQObjeto {
    nuevoFor(_cuerpoDec, _instrucciones, _linea, _columna) {
        return {
            cuerpo: _cuerpoDec,
            instrucciones: _instrucciones,
            tipo: Enum_1.Tipos.FOR_LOOP,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaVariable(_variable, _linea, _columna) {
        return {
            variable: _variable,
            tipo: Enum_1.Tipos.VARIABLE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaExpresion(_variable, _valor, _linea, _columna) {
        return {
            variable: _variable,
            valor: _valor,
            tipo: Enum_1.Tipos.ASIGNACION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoLet(_varName, _valor, _linea, _columna) {
        return {
            id: _varName,
            valor: _valor,
            tipo: Enum_1.Tipos.LET_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoWhere(_condiciones, _linea, _columna) {
        return {
            condiciones: _condiciones,
            tipo: Enum_1.Tipos.WHERE_CONDITION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoOrderBy(_orders, _linea, _columna) {
        return {
            ordenes: _orders,
            tipo: Enum_1.Tipos.ORDER_BY_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoReturn(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.RETURN_STATEMENT,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoValor(_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaDeclaracion(_variables, _at, _iterators, _linea, _columna) {
        return {
            variable: _variables,
            atKey: _at,
            iterators: _iterators,
            tipo: Enum_1.Tipos.DECLARACION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoIntervalo(_valor1, _valor2, _linea, _columna) {
        return {
            valor1: _valor1,
            valor2: _valor2,
            tipo: Enum_1.Tipos.INTERVALO,
            linea: _linea,
            columna: _columna
        };
    }
    nuevosValores(_valores, _linea, _columna) {
        return {
            valores: _valores,
            tipo: Enum_1.Tipos.VALORES,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoContenido(_valor, _linea, _columna) {
        return {
            contenido: _valor,
            tipo: Enum_1.Tipos.CONTENIDO,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaInyeccion(_path, _onlyData, _linea, _columna) {
        return {
            path: _path,
            onlyData: _onlyData,
            tipo: Enum_1.Tipos.INYECCION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoHTML(_id_open, _atributos, _contenido, _id_close, _linea, _columna) {
        return {
            id_open: _id_open,
            id_close: _id_close,
            atributos: _atributos,
            value: _contenido,
            tipo: Enum_1.Tipos.HTML,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoIf_Then_Else(_condicionIf, _instruccionesThen, _instruccionesElse, _linea, _columna) {
        return {
            condicionIf: _condicionIf,
            instruccionesThen: _instruccionesThen,
            instruccionesElse: _instruccionesElse,
            tipo: Enum_1.Tipos.IF_THEN_ELSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoParametro(_id, _tipado, _linea, _columna) {
        return {
            id: _id,
            tipado: _tipado,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaFuncion(_name, _parametros, _tipado, _instrucciones, _linea, _columna) {
        return {
            name: _name,
            parametros: _parametros,
            tipado: _tipado,
            instrucciones: _instrucciones,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaLlamada(_name, _parametros, _linea, _columna) {
        return {
            name: _name,
            parametros: _parametros,
            linea: _linea,
            columna: _columna
        };
    }
}
exports.XQObjeto = XQObjeto;


/***/ }),

/***/ "XhXr":
/*!**************************************************!*\
  !*** ./src/js/controller/xquery/BuildElement.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
function pushIterators(input) {
    let iterators = [];
    // console.log(input, 36363638)
    for (let i = 0; i < input.length; i++) {
        const path = input[i];
        if (path.items && path.items.length > 0) {
            return input;
        }
        if (path.notFound) {
            return [{ notFound: 'No se encontraron elementos.' }];
        }
        if (path.valor || path.valor === 0) {
            iterators.unshift(path.valor);
        }
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = path.texto;
            root.forEach(txt => {
                iterators.push(concatText(txt).substring(1));
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            let root = path.elementos;
            root.forEach(element => {
                iterators.push(concatChilds(element, "").substring(1));
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    iterators.push(concatAttributes(attr).substring(1));
                });
            }
            else {
                let root = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    iterators.push(extractAttributes(element, "").substring(1));
                });
            }
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            let root = path.nodos;
            root.forEach((elemento) => {
                if (elemento.elementos) {
                    iterators.push(concatChilds(elemento.elementos, "").substring(1));
                }
                else if (elemento.textos) {
                    iterators.push(concatText(elemento.textos).substring(1));
                }
            });
        }
    }
    if (iterators.length > 0)
        return [iterators];
    return [{ notFound: 'No se encontraron elementos.' }];
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(child => {
            cadena += concatChilds(child, cadena);
        });
        cadena += ("\n</" + _element.id_close + ">\n");
    }
    else {
        if (_element.id_close === null)
            cadena += "/>";
        else {
            cadena += ">";
            cadena += (_element.value + "</" + _element.id_close + ">");
        }
    }
    return cadena;
}
function concatAttributes(_attribute) {
    return `\n${_attribute.id}="${_attribute.value}"`;
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += `\n${attribute.id}="${attribute.value}"`;
        });
    }
    return cadena;
}
function concatText(_text) {
    return `\n${_text}`;
}
module.exports = pushIterators;


/***/ }),

/***/ "YKiq":
/*!**************************************!*\
  !*** ./src/js/model/xpath/Objeto.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
const Enum_1 = __webpack_require__(/*! ./Enum */ "MEUw");
class Objeto {
    newValue(_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    newOperation(_opIzq, _opDer, _tipo, _linea, _columna) {
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    newNodename(_nodename, _linea, _columna) {
        return {
            nodename: _nodename,
            tipo: Enum_1.Tipos.NODENAME,
            linea: _linea,
            columna: _columna
        };
    }
    newAxis(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_ROOT,
            linea: _linea,
            columna: _columna
        };
    }
    newDoubleAxis(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_CURRENT,
            linea: _linea,
            columna: _columna
        };
    }
    newCurrent(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_CURRENT,
            linea: _linea,
            columna: _columna
        };
    }
    newParent(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_PARENT,
            linea: _linea,
            columna: _columna
        };
    }
    newAttribute(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_ATTRIBUTES,
            linea: _linea,
            columna: _columna
        };
    }
    newAxisObject(_axisname, _nodetest, _linea, _columna) {
        return {
            axisname: _axisname,
            nodetest: _nodetest,
            tipo: Enum_1.Tipos.SELECT_AXIS,
            linea: _linea,
            columna: _columna
        };
    }
    newPredicate(_condicion, _linea, _columna) {
        return {
            condicion: _condicion,
            tipo: Enum_1.Tipos.PREDICATE,
            linea: _linea,
            columna: _columna
        };
    }
    newExpression(_expresion, _predicate, _linea, _columna) {
        return {
            expresion: _expresion,
            predicate: _predicate,
            tipo: Enum_1.Tipos.EXPRESION,
            linea: _linea,
            columna: _columna
        };
    }
}
exports.Objeto = Objeto;


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.service */ "F5nt");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @materia-ui/ngx-monaco-editor */ "0LvA");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ providers: [
        _app_service__WEBPACK_IMPORTED_MODULE_3__["AppService"],
        {
            provide: _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_5__["MONACO_PATH"],
            useValue: 'https://unpkg.com/monaco-editor@0.19.3/min/vs'
        }
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
            _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_5__["MonacoEditorModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
        _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_5__["MonacoEditorModule"]] }); })();


/***/ }),

/***/ "cW0F":
/*!**************************************!*\
  !*** ./src/js/analyzers/xml_down.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xml_down = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,12],$V2=[1,17],$V3=[1,15],$V4=[1,16],$V5=[2,13],$V6=[1,20],$V7=[1,21],$V8=[1,22],$V9=[1,23],$Va=[2,21,22,23],$Vb=[2,6,21,23],$Vc=[2,11,12,21,22,23,24],$Vd=[2,11,12,14,16,17,18,21,22,23,24],$Ve=[2,6,23];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INI":3,"XML_DECLARATION":4,"ROOT":5,"EOF":6,"XML":7,"tk_open_declaration":8,"ATTRIBUTE_LIST":9,"XML_CLOSE_DECLARATION":10,"tk_close_delcaraton":11,"tk_close":12,"ATTRIBUTE":13,"tk_attribute_name":14,"tk_string":15,"tk_equal":16,"tk_tag_name":17,"cadena_err":18,"XML_OPEN":19,"CHILDREN":20,"tk_open_end_tag":21,"tk_content":22,"tk_open":23,"tk_bar":24,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",8:"tk_open_declaration",11:"tk_close_delcaraton",12:"tk_close",14:"tk_attribute_name",15:"tk_string",16:"tk_equal",17:"tk_tag_name",18:"cadena_err",21:"tk_open_end_tag",22:"tk_content",23:"tk_open",24:"tk_bar"},
productions_: [0,[3,3],[3,2],[3,2],[3,1],[3,2],[5,2],[5,1],[4,3],[10,1],[10,1],[10,2],[9,2],[9,0],[13,2],[13,1],[13,2],[13,1],[13,2],[13,1],[7,5],[7,5],[7,5],[7,4],[7,3],[7,3],[7,4],[7,4],[7,6],[7,4],[7,4],[7,4],[7,3],[7,3],[7,2],[19,4],[19,3],[19,1],[19,2],[20,2],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
/*$$[$0-2][0].printTest(0);console.log($$[$0-2][0].getTree());*/
                                            prod_1 = grammar_stack.pop();
                                            prod_2 = grammar_stack.pop();
                                            grammar_stack.push({'INI-> XML_DECLARATION ROOT EOF {﹩ = [﹩1, ﹩2]}': [prod_2, prod_1, 'EOF' ]});
                                            //printstrack(grammar_stack, 0); //TODO: Delete is just for testing purposes
                                            grammar_report =  getGrammarReport(grammar_stack);
                                            cst = getCST(grammar_stack);

                                            if($$[$0-2]!= null){
                                                encoding = new Encoding($$[$0-2]);
                                                ast = { ast: $$[$0-1], encoding: encoding, errors: errors, cst: cst, grammar_report: grammar_report};
                                            } else{
                                                errors.push({ tipo: "Sintáctico", error: "La codificación del XML no es válida.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 });
                                                ast = { ast: $$[$0-1], encoding: null,  errors: errors, cst: cst, grammar_report: grammar_report};
                                            }
                                            errors = [];
                                            return ast;
                                            
break;
case 2:

                                            prod_1 = grammar_stack.pop();
                                            grammar_stack.push({'INI -> XML_DECLARATION  EOF {	errors.add(new Error()); ﹩﹩ = null;}': [prod_1, 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);

                                            ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 3:

                                            prod_1 = grammar_stack.pop();
                                            grammar_stack.push({'INI -> ROOT EOF {	errors.add(new Error()); ﹩﹩ = null;}': [prod_1, 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);

                                            errors.push({ tipo: "Sintáctico", error: "Falta declaracion del XML", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 4:

                                            grammar_stack.push({'INI -> EOF {	errors.add(new Error()); ﹩﹩ = null;}': [ 'EOF']});
                                            grammar_report =  getGrammarReport(grammar_stack);
                                            errors.push({ tipo: "Sintáctico", error: "El archivo viene vacio.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

	                                        ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report }
	                                        errors = [];
	                                        return ast;
	                                        
break;
case 5:

	                                        grammar_stack.push({'INI -> error EOF {	errors.add(new Error()); ﹩﹩ = null;}': ['Token: error\t Lexema: ', 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);

                                            errors.push({ tipo: "Sintáctico", error: "Token no esperado.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 6:
if($$[$0-1] != null && $$[$0] != null){ $$[$0].push($$[$0-1]); this.$ = $$[$0]; } else if($$[$0] == null){this.$ = []; this.$.push($$[$0-1]); }else{this.$ = null;}
                                                prod_1 = grammar_stack.pop();
                                                prod_2 = grammar_stack.pop();
                                                grammar_stack.push({'ROOT ->  XML ROOT  {﹩﹩ = ﹩2.push(﹩1);}': [prod_2, prod_1 ]});
                                                
break;
case 7:
this.$ = []; this.$.push($$[$0]);
	                                            prod_1 = grammar_stack.pop();
	                                            grammar_stack.push({'ROOT -> XML {﹩﹩ = []; ﹩﹩.push(﹩1);}': [prod_1 ]});
	                                            
break;
case 8:
if($$[$0-1] == null || $$[$0] == null){
                                                                            this.$ = null}else{
                                                                            let str = "";
                                                                           $$[$0-1].forEach((value)=>{
                                                                           str = str + value.id+value.value;
                                                                           });
                                                                           this.$=str;
                                                                           }

                                                                           prod_3 = grammar_stack.pop();
                                                                           prod_2 = grammar_stack.pop();
                                                                           grammar_stack.push({'XML_DECLARATION -> tk_open_declaration ATTRIBUTE_LIST XML_CLOSE_DECLARATION {﹩﹩ = ﹩2}': ['Token: tk_open_declaration\t Lexema: ' + '&lt;?', prod_2, prod_3]} );
                                                                           
break;
case 9:
  this.$ = "?>"
                                                grammar_stack.push({'XML_CLOSE_DECLARATION -> tk_close_delcaraton { ﹩﹩= ﹩1}': ['Token: tk_close_delcaraton\t Lexema: ' + '?&gt;']});
                                                
break;
case 10:
this.$ = null;
                                                 errors.push({ tipo: "Sintáctico", error: "Se esperaba token /", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                grammar_stack.push({'XML_CLOSE_DECLARATION -> tk_close {errors.add(new Error()); ﹩﹩ = null;}': ['Token: tk_close\t Lexema: ' + '&gt;']});
                                                
break;
case 11:
 this.$ = null;
                                                 errors.push({ tipo: "Sintáctico", error: "Token no esperado. " + $$[$0-1], origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                 grammar_stack.push({'XML_CLOSE_DECLARATION -> error tk_close {	errors.add(new Error()); ﹩﹩ = null;}': ['Token: error\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                 
break;
case 12:
if($$[$0-1] != null && $$[$0] != null){$$[$0].push($$[$0-1]); this.$ = $$[$0]}else if($$[$0] == null){this.$ = []; this.$.push($$[$0-1]);}else{this.$ = null;}
                                            prod_1 = grammar_stack.pop();
                                            prod_2 = grammar_stack.pop();
                                            grammar_stack.push({'ATTRIBUTE_LIST -> ATTRIBUTE ATTRIBUTE_LIST {if(﹩2 == null){﹩﹩=[]; ﹩﹩.push(﹩1)}else{﹩2.push(﹩1)}}': [ prod_2, prod_1 ] });
                                          
break;
case 13:
this.$ = null;             grammar_stack.push({'ATTRIBUTE_LIST -> Empty {﹩﹩ = null}': ['EMPTY'] });      
break;
case 14:
attr = new Atributo($$[$0-1].slice(0, -1), $$[$0].slice(1,-1), this._$.first_line, this._$.first_column+1);
                                            attr.Cst= `<li><a href=''>ATTRIBUTE</a>
                                            <ul>
                                            <li><a href=''>tk_attribute_name</a><ul>\n<li><a href=''>${$$[$0-1]}</a></li></ul></li>
                                            <li><a href=''>tk_string</a><ul>\n<li><a href=''>${$$[$0]}</a></li></ul></li>
                                            </ul>
                                            </li>`;
                                            this.$ = attr;
                                            grammar_stack.push({'ATTRIBUTE -> tk_attribute_name tk_string {	﹩﹩ = new Attribute(﹩1, ﹩2)}': ['Token: tk_attribute_name\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0] ]});
                                            
break;
case 15:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un atributo despues de =.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_attribute_name {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_attribute_name\t Lexema: ' + $$[$0]]});
                                            
break;
case 16:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un nombre para atributo antes de =.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_equal tk_string {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_equal\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0]]});
                                            
break;
case 17:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba signo =", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_tag_name {	errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_tag_name\t Lexema: ' + $$[$0]]});
                                            
break;
case 18:
 this.$ = null;
                                            errors.push({ tipo: "Lexico", error: "Nombre del atributo no puede empezar con digitos.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> cadena_err tk_string {errors.add(new Error()); ﹩﹩ = null;}':['Token: cadena_err\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0]]});
                                            
break;
case 19:
 this.$ = null;
                                            errors.push({ tipo: "Lexico", error: "Nombre del atributo no puede empezar con digitos, y debe tener signo = y atributo a continuacion.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> cadena_err {	errors.add(new Error()); ﹩﹩ = null;}':['Token: cadena_err\t Lexema: ' + $$[$0]]});
                                            
break;
case 20:
if($$[$0-4] != null){  $$[$0-4].Children = $$[$0-3]; $$[$0-4].Close = $$[$0-1]; this.$ = $$[$0-4];
                                                                                let hasConflict = $$[$0-4].verificateNames();
                                                                                if(hasConflict === "") {
                                                                                    if($$[$0-4].childs){
                                                                                        $$[$0-4].childs.forEach(child => {
                                                                                        child.Father = {id: $$[$0-4].id_open, line: $$[$0-4].line, column: $$[$0-4].column};
                                                                                        });
                                                                                        this.$ = $$[$0-4];
                                                                                    }
																				}
                                                                                else {
																					errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                                                    this.$ = null;
																				}
                                                                                 }else{this.$ = null;}
                                                                                 prod_1 = grammar_stack.pop();
                                                                                 prod_2 = grammar_stack.pop();
                                                                                 grammar_stack.push({'XML-> XML_OPEN CHILDREN tk_open_end_tag tk_tag_name tk_close {﹩﹩ = ﹩1; ﹩1.children = ﹩2}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                                                 
break;
case 21:
if($$[$0-4] != null){$$[$0-4].Value = $$[$0-3]; $$[$0-4].Close = $$[$0-1];  this.$ = $$[$0-4];
                                                                                let hasConflict = $$[$0-4].verificateNames();
                                                                                if(hasConflict !== ""){
                                                                                 errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                                                 this.$ = null;
                                                                                 }
	                                                                             }else{this.$ = null;}
	                                                                             prod_1 = grammar_stack.pop();
	                                                                             grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag tk_tag_name tk_close {﹩﹩ = ﹩1; ﹩﹩.content = ﹩2}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-3], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                             
break;
case 22:
this.$ = new Element($$[$0-3], $$[$0-2], null, null, _$[$0-4].first_line, _$[$0-4].first_column+1, null);

                                                                                prod_1 = grammar_stack.pop();
                                                                                grammar_stack.push({'XML -> tk_open tk_tag_name ATTRIBUTE_LIST tk_bar tk_close {﹩﹩ = new Element(); ﹩﹩.attributes = ﹩3}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-3], prod_1, 'Token: tk_bar\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 23:
if($$[$0-3] != null){$$[$0-3].Close = $$[$0-1]; this.$ = $$[$0-3];
	                                                                            let hasConflict = $$[$0-3].verificateNames();
	                                                                             if(hasConflict !== ""){
                                                                                errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                                                this.$ = null;

                                                                                prod_1 = grammar_stack.pop();
                                                                                }
	                                                                            }else{this.$ = null;}
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag tk_tag_name tk_close {	﹩﹩ = ﹩1;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: '  + '&gt;']});
	                                                                            
break;
case 24:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Falta etiquta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: '  + $$[$0]]});
	                                                                            
break;
case 25:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador. ", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 26:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Falta etiquta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
	                                                                            
break;
case 27:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador. ", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: ' + $$[$0]  ]});
                                                                            	
break;
case 28:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba etiqueta de cierre. ", origen: "XML", linea: _$[$0-4].first_line, columna: _$[$0-4].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_content  tk_open tk_tag_name ATTRIBUTE_LIST tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, 'Token: tk_content\t Lexema: ' + $$[$0-4],  'Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-2], prod_1, 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 29:
this.$ =null;
	                                                                            errors.push({ tipo: "Sintáctico", error: "Falta etiquta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN CHILDREN tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
	                                                                            
break;
case 30:
this.$ =null;
	                                                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN CHILDREN tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: '  + '&gt;']});
	                                                                            
break;
case 31:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-3], origen: "XML", linea: _$[$0-3].first_line, columna: _$[$0-3].first_column+1 });

                                                                             grammar_stack.push({'XML -> error tk_open_end_tag tk_tag_name tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-3], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: '  + '&gt;']});
                                                                             
break;
case 32:
this.$ =null;
    	                                                                    errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-2], origen: "XML", linea: _$[$0-2].first_line, columna: _$[$0-2].first_column+1 });

                                                                            grammar_stack.push({'XML -> error tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
                                                                            
break;
case 33:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-2], origen: "XML", linea: _$[$0-2].first_line, columna: _$[$0-2].first_column+1 });

	                                                                        grammar_stack.push({'XML -> error tk_bar tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-2], 'Token: tk_bar\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                        
break;
case 34:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-1], origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

	                                                                        grammar_stack.push({'XML -> error  tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-1],  'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                        
break;
case 35:
 this.$ = new Element($$[$0-2], $$[$0-1], null, null,  _$[$0-3].first_line,  _$[$0-3].first_column+1);

                                                        prod_1 = grammar_stack.pop();
                                                        grammar_stack.push({'XML_OPEN -> tk_open tk_tag_name ATTRIBUTE_LIST tk_close {﹩﹩ = new Element(); ﹩﹩.attributes = ﹩3}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-2], prod_1, 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                         
break;
case 36:

                                                        this.$ = null;
                                                        errors.push({ tipo: "Sintáctico", error: "Se esperaba \">\" despues de la cadena de atributos.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                        prod_1 = grammar_stack.pop();
                                                        grammar_stack.push({'XML_OPEN -> tk_open tk_tag_name ATTRIBUTE_LIST {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], prod_1]});
                                                        
break;
case 37:
 this.$ = null;
                                                        errors.push({ tipo: "Sintáctico", error: "", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                        grammar_stack.push({'XML_OPEN -> tk_open {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;']});
                                                        
break;
case 38:
 this.$ = null;
                                                         errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador para la etiqueta", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                         grammar_stack.push({'XML_OPEN -> tk_open tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                         
break;
case 39:
if($$[$0-1] != null && $$[$0] != null){ $$[$0].push($$[$0-1]); this.$ = $$[$0]; } else if($$[$0] == null){this.$ = []; this.$.push($$[$0-1]); }else{this.$ = null;}
                                                            prod_1 = grammar_stack.pop();
                                                            prod_2 = grammar_stack.pop();
                                                             grammar_stack.push({'CHILDREN -> XML CHILDREN {﹩2.push(﹩1); ﹩﹩ = ﹩2;}':[prod_2,  prod_1]});
                                                            
break;
case 40:
this.$ = []; this.$.push($$[$0]);
	                                                        prod_1 = grammar_stack.pop();
	                                                        grammar_stack.push({'CHILDREN -> XML {﹩﹩ = [﹩1]}': [prod_1] });
	                                                        
break;
}
},
table: [{2:[1,5],3:1,4:2,5:3,6:[1,4],7:7,8:[1,6],19:8,23:$V0},{1:[3]},{2:$V1,5:10,6:[1,11],7:7,19:8,23:$V0},{6:[1,13]},{1:[2,4]},{6:[1,14],12:$V2,21:$V3,24:$V4},o([2,11,12],$V5,{9:18,13:19,14:$V6,16:$V7,17:$V8,18:$V9}),{2:$V1,5:24,6:[2,7],7:7,19:8,23:$V0},{2:$V1,7:28,19:8,20:25,21:[1,27],22:[1,26],23:$V0},o($Va,[2,37],{12:[1,30],17:[1,29]}),{6:[1,31]},{1:[2,2]},{12:$V2,21:$V3,24:$V4},{1:[2,3]},{1:[2,5]},{17:[1,32]},{12:[1,33]},o($Vb,[2,34]),{2:[1,37],10:34,11:[1,35],12:[1,36]},o($Vc,$V5,{13:19,9:38,14:$V6,16:$V7,17:$V8,18:$V9}),o($Vd,[2,15],{15:[1,39]}),{15:[1,40]},o($Vd,[2,17]),o($Vd,[2,19],{15:[1,41]}),{6:[2,6]},{21:[1,42]},{21:[1,43],23:[1,44]},{12:[1,46],17:[1,45]},{2:$V1,7:28,19:8,20:47,21:[2,40],23:$V0},o([2,12,21,22,23,24],$V5,{13:19,9:48,14:$V6,16:$V7,17:$V8,18:$V9}),o($Va,[2,38]),{1:[2,1]},o($Vb,[2,32],{12:[1,49]}),o($Vb,[2,33]),o($Ve,[2,8]),o($Ve,[2,9]),o($Ve,[2,10]),{12:[1,50]},o($Vc,[2,12]),o($Vd,[2,14]),o($Vd,[2,16]),o($Vd,[2,18]),{12:[1,52],17:[1,51]},{12:[1,54],17:[1,53]},{17:[1,55]},o($Vb,[2,24],{12:[1,56]}),o($Vb,[2,25]),{21:[2,39]},o($Va,[2,36],{12:[1,58],24:[1,57]}),o($Vb,[2,31]),o($Ve,[2,11]),o($Vb,[2,29],{12:[1,59]}),o($Vb,[2,30]),o($Vb,[2,26],{12:[1,60]}),o($Vb,[2,27]),{9:61,12:$V5,13:19,14:$V6,16:$V7,17:$V8,18:$V9},o($Vb,[2,23]),{12:[1,62]},o($Va,[2,35]),o($Vb,[2,20]),o($Vb,[2,21]),{12:[1,63]},o($Vb,[2,22]),o($Vb,[2,28])],
defaultActions: {4:[2,4],11:[2,2],13:[2,3],14:[2,5],24:[2,6],31:[2,1],47:[2,39]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

	var attribute = '';
	var errors = [];
	let re = /[^\n\t\r ]+/g
	//let ast = null;
	let grammar_stack = [];



    function getGrammarReport(obj){
        let str = `<!DOCTYPE html>
                     <html lang="en" xmlns="http://www.w3.org/1999/html">
                     <head>
                         <meta charset="UTF-8">
                         <meta
                         content="width=device-width, initial-scale=1, shrink-to-fit=no"
                         name="viewport">
                         <!-- Bootstrap CSS -->
                         <link
                         crossorigin="anonymous"
                         href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                               integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                               rel="stylesheet">
                         <title>Reporte gramatical</title>
                         <style>
                             table, th, td {
                                 border: 1px solid black;
                             }
                             ul, .ul-tree-view {
                                 list-style-type: none;
                             }

                             #div-table{
                                 width: 1200px;
                                 margin: 100px;
                                 border: 3px solid #73AD21;
                             }

                             .ul-tree-view {
                                 margin: 0;
                                 padding: 0;
                             }

                             .caret {
                                 cursor: pointer;
                                 -webkit-user-select: none; /* Safari 3.1+ */
                                 -moz-user-select: none; /* Firefox 2+ */
                                 -ms-user-select: none; /* IE 10+ */
                                 user-select: none;
                             }

                             .caret::before {
                                 content: "\u25B6";
                                 color: black;
                                 display: inline-block;
                                 margin-right: 6px;
                             }

                             .caret-down::before {
                                 -ms-transform: rotate(90deg); /* IE 9 */
                                 -webkit-transform: rotate(90deg); /* Safari */'
                             transform: rotate(90deg);
                             }

                             .nested {
                                 display: none;
                             }

                             .active {
                                 display: block;
                             }

                             li span:hover {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             li span:hover + ul li  {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             .tree-view{
                                 display: inline-block;
                             }

                             li.string {
                                 list-style-type: square;
                             }
                             li.string:hover {
                                 color : white;
                                 background-color: #dc5b27;
                             }
                             .center {
                                margin: auto;
                                width: 50%;
                                border: 3px solid green;
                                padding-left: 15%;
                             }
                         </style>
                     </head>
                     <body>
                     <h1 class="center">Reporte Gramatical</h1>
                     <div class="tree-view">
                     <ul class="ul-tree-view" id="tree-root">`;


        str = str + buildGrammarReport(obj);


        str = str + `
                    </ul>
                    </ul>
                    </div>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                        <button onclick="fun1()">Expand Grammar Tree</button>

                     <div id="div-table">
                     <table style="width:100%">
                         <tr>
                         <th>Produccion</th>
                         <th>Cuerpo</th>
                         <th>Accion</th>
                         </tr>

                         <tr>
                         <th>INI-&gt;</th>
                         <td>XML_DECLARATION ROOT EOF</td>
                         <td>$$ = [$1, $2] </td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_DECLARATION  EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>ROOT EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>error EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>



                         <tr>
                         <th>ROOT-&gt;</th>
                         <td>XML ROOT</td>
                         <td>$$ = $2.push($1);</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>XML</td>
                         <td>$$ = []; $$.push($1);</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>XML_DECLARATION-&gt;</th>
                         <td>tk_open_declaration ATTRIBUTE_LIST XML_CLOSE_DECLARATION</td>
                         <td>$$ = $2</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>





                         <tr>
                         <th>XML_CLOSE_DECLARATION-&gt;</th>
                         <td>tk_close_delcaraton</td>
                         <td>$$ = $1</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td>error tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>ATTRIBUTE_LIST-&gt;</th>
                         <td>ATTRIBUTE ATTRIBUTE_LIST </td>
                         <td>if($2 == null){$$=[]; $$.push($1)}else{$2.push($1)}</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>Empty</td>
                         <td>$$ = null</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>



                         <tr>
                         <th>ATTRIBUTE-&gt;</th>
                         <td>tk_attribute_name tk_string  </td>
                         <td>$$ = new Attribute($1, $2)</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_attribute_name</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_equal tk_string   </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_tag_name</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>cadena_err tk_string </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>cadena_err</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>XML-&gt;</th>
                         <td>XML_OPEN CHILDREN tk_open_end_tag tk_tag_name tk_close   </td>
                         <td>$$ = $1; $1.children = $2</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag tk_tag_name tk_close  </td>
                         <td>$$ = $1; $$.content = $2</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST tk_bar tk_close </td>
                         <td>$$ = new Element(); $$.attributes = $3</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag tk_tag_name tk_close </td>
                         <td>$$ = $1; </td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content  tk_open tk_tag_name ATTRIBUTE_LIST tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN CHILDREN tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN CHILDREN tk_open_end_tag  tk_close  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_open_end_tag tk_tag_name tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_bar tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>


                         <tr>
                         <th>XML_OPEN-&gt;</th>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST tk_close </td>
                         <td>$$ = new Element(); $$.attributes = $3</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open   tk_close  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>


                         <tr>
                         <th>CHILDREN-&gt;</th>
                         <td>XML CHILDREN</td>
                         <td>$2.push($1); $$ = $2;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>XML</td>
                         <td>$$ = [$1]</td>
                         </tr>

                     </table>

                     </div>

                     <script
                     src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js">
                     </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                             src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js">
                             </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                             src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js">
                             </script>

                             <script>
                                 var toggler = document.getElementsByClassName("caret");
                                 var i;

                                 for (i = 0; i < toggler.length; i++) {
                                     toggler[i].addEventListener("click", function() {
                                         this.parentElement
                                         .querySelector(".nested")
                                         .classList.toggle("active");
                                         this.classList.toggle("caret-down");
                                     });
                                 }


                                    function fun1() {
                                                                                if ($("#tree-root").length > 0) {

                                                                                    $("#tree-root").find("li").each
                                                                                    (
                                                                                        function () {
                                                                                            var $span = $("<span></span>");
                                                                                            //$(this).toggleClass("expanded");
                                                                                            if ($(this).find("ul:first").length > 0) {
                                                                                                $span.removeAttr("class");
                                                                                                $span.attr("class", "expanded");
                                                                                                $(this).find("ul:first").css("display", "block");
                                                                                                $(this).append($span);
                                                                                            }

                                                                                        }
                                                                                    )
                                                                                }

                                                                            }
                             </script>

                     </body>
                     </html>`;
                     return str;
    }

    function buildGrammarReport(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                str = str + `<li class= "string">
                ${value}
                </li>
                `;
            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildGrammarReport(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){
                str = `<li><span class="caret">
                ${key}
                </span>
                <ul class="nested">
                `;
                str = str + buildGrammarReport(obj[key]);
                str = str + `
                </ul>
                </li>`;
            }
        }
        return str;
    }



    function getCST(obj){
        let str = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
            <!-- Bootstrap CSS -->
            <link crossorigin="anonymous" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                  integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" rel="stylesheet">
            <title>CST</title>
            <style>

                #divheight{
                    height: 400px;
                    width: 1050px;
                }

                .nav-tabs > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

                .nav-tabs2 > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

            </style>

            <style>
                body {
                    font-family: sans-serif;
                    font-size: 15px;
                }

                .tree ul {
                    position: relative;
                    padding: 1em 0;
                    white-space: nowrap;
                    margin: 0 auto;
                    text-align: center;
                }
                .tree ul::after {
                    content: "";
                    display: table;
                    clear: both;
                }

                .tree li {
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    list-style-type: none;
                    position: relative;
                    padding: 1em 0.5em 0 0.5em;
                }
                .tree li::before, .tree li::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 50%;
                    border-top: 1px solid #ccc;
                    width: 50%;
                    height: 1em;
                }
                .tree li::after {
                    right: auto;
                    left: 50%;
                    border-left: 1px solid #ccc;
                }
                /*
                ul:hover::after  {
                    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport)
                }*/

                .tree li:only-child::after, .tree li:only-child::before {
                    display: none;
                }
                .tree li:only-child {
                    padding-top: 0;
                }
                .tree li:first-child::before, .tree li:last-child::after {
                    border: 0 none;
                }
                .tree li:last-child::before {
                    border-right: 1px solid #ccc;
                    border-radius: 0 5px 0 0;
                }
                .tree li:first-child::after {
                    border-radius: 5px 0 0 0;
                }

                .tree ul ul::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    border-left: 1px solid #ccc;
                    width: 0;
                    height: 1em;
                }

                .tree li a {
                    border: 1px solid #ccc;
                    padding: 0.5em 0.75em;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    color: #333;
                    position: relative;
                    top: 1px;
                }

                .tree li a:hover,
                .tree li a:hover + ul li a {
                    background: #e9453f;
                    color: #fff;
                    border: 1px solid #e9453f;
                }

                .tree li a:hover + ul li::after,
                .tree li a:hover + ul li::before,
                .tree li a:hover + ul::before,
                .tree li a:hover + ul ul::before {
                    border-color: #e9453f;
                }


            </style>
        </head>
        <body>



        <div class="tree">
            <ul id="tree-list">

            <!--AQUI-->
        `;
        str = str + buildCSTTree(obj);
        str = str + `
        </ul>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
        <script crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
        <script crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
        </body>
        </html>
        `;
        return str;
    }

    function buildCSTTree(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                let words = value.split('Lexema:');
                if(words.length == 2){
                    let lex = words[1];     //TODO check not go out of bounds
                    let token = words[0];
                    str = str + `<li><a href="">${token}</a><ul>
                    <li><a href="">${lex}
                    </a></li>
                    </ul></li>
                    `;
                }else{
                    str = str + `<li><a href="">${value}</a></li>
                    `;
                }


            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildCSTTree(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){
                const words = key.split('->');
                //console.log(words[3]);
                str = `<li><a href="">${words[0]}</a>
                <ul>
                `;
                str = str + buildCSTTree(obj[key]) + `
                </ul>
                </li>`;
            }
        }
        return str;
    }






	const { Atributo } = __webpack_require__(/*! ../model/xml/Atributo */ "tSns");
	const { Element } = __webpack_require__(/*! ../model/xml/Element */ "Kypw");
	const { Encoding } = __webpack_require__(/*! ../model/xml/Encoding/Encoding */ "EfzR");
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Whitespace
break;
case 1:/* MultiLineComment*/
break;
case 2:return 8;
break;
case 3:return 11;
break;
case 4:return 14;
break;
case 5:return 17;
break;
case 6:return 21
break;
case 7:return 23;
break;
case 8: this.pushState('content');  return 12;
break;
case 9:return 24;
break;
case 10:return 16;
break;
case 11:return 15;
break;
case 12:return cadena_err;
break;
case 13:return id_err;
break;
case 14:/* MultiLineComment*/
break;
case 15:
                                    if(yy_.yytext.match(re)){return 22;}
                                 
break;
case 16:return 6
break;
case 17:this.popState(); return 12;
break;
case 18: this.popState(); return 21
break;
case 19:  this.popState();
                                    return 23;
break;
case 20: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
case 21:return 6
break;
case 22: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!--([^-]|-[^-])*-->)/i,/^(?:<\?([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*))/i,/^(?:\?>)/i,/^(?:(([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*)\s*=))/i,/^(?:([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*))/i,/^(?:<\/)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:(("[^\"\n]*[\"\n])|('[^\'\n]*[\'\n])))/i,/^(?:([0-9]+(\.[0-9]+)?([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*=?))/i,/^(?:{id_err})/i,/^(?:<!--([^-]|-[^-])*-->)/i,/^(?:(([^<>&\"]|&lt;|&gt;|&amp;|&apos;|&quot;)+))/i,/^(?:$)/i,/^(?:>)/i,/^(?:<\/)/i,/^(?:<)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"content":{"rules":[14,15,16,17,18,19,20],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,21,22],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = xml_down;
exports.Parser = xml_down.Parser;
exports.parse = function () { return xml_down.parse.apply(xml_down, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(/*! fs */ 3).readFileSync(__webpack_require__(/*! path */ 4).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "gajf":
/*!********************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Expresion.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../model/xpath/Enum */ "MEUw");
function Expresion(_expresion, _ambito, _contexto, id) {
    var _a;
    // if (!_expresion) return null;
    let tipo = (Array.isArray(_expresion)) ? Enum_1.Tipos.NONE : _expresion.tipo;
    if (tipo === Enum_1.Tipos.EXPRESION) {
        return Expresion(_expresion.expresion, _ambito, _contexto, id);
    }
    else if (tipo === Enum_1.Tipos.NODENAME) {
        return { valor: _expresion.nodename, tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.STRING || tipo === Enum_1.Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Enum_1.Tipos.SELECT_CURRENT) {
        let exp = _expresion.expresion;
        if (id) {
            if (id === exp)
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
            if (((_a = _contexto.atCounter) === null || _a === void 0 ? void 0 : _a.id) === exp) {
                let length = _contexto.getLength();
                for (let i = 1; i <= length; i++) {
                    _contexto.items.push(i);
                }
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
            }
            return null;
        }
        if (_ambito.existeVariable(exp)) {
            let valueFromVar = _ambito.getContextFromVar(exp);
            if (valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.contexto) {
                _ambito.contextFromVar = valueFromVar;
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna, contextFromVar: valueFromVar.contexto };
            }
            else if (valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.valor)
                return valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.valor;
        }
        if (exp !== ".")
            return null;
        return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_ATTRIBUTES) {
        return { valor: _expresion.expresion, tipo: Enum_1.Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_AXIS) {
        let nodetest = Expresion(_expresion.nodetest.expresion, _ambito, _contexto);
        if (nodetest.error)
            return nodetest;
        return { axisname: _expresion.axisname, nodetest: nodetest, predicate: _expresion.nodetest.predicate, tipo: Enum_1.Tipos.SELECT_AXIS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.ASTERISCO) {
        return { valor: "*", tipo: Enum_1.Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Enum_1.Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_LAST) {
        return { valor: "last()", tipo: Enum_1.Tipos.FUNCION_LAST, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_POSITION) {
        return { valor: "position()", tipo: Enum_1.Tipos.FUNCION_POSITION, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_TEXT) {
        return { valor: "text()", tipo: Enum_1.Tipos.FUNCION_TEXT, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.OPERACION_SUMA || tipo === Enum_1.Tipos.OPERACION_RESTA || tipo === Enum_1.Tipos.OPERACION_MULTIPLICACION
        || tipo === Enum_1.Tipos.OPERACION_DIVISION || tipo === Enum_1.Tipos.OPERACION_MODULO || tipo === Enum_1.Tipos.OPERACION_NEGACION_UNARIA) {
        const Aritmetica = __webpack_require__(/*! ./Operators/Aritmetica */ "qbRd");
        return Aritmetica(_expresion, _ambito, _contexto);
    }
    else if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        const Relacional = __webpack_require__(/*! ./Operators/Relacional */ "r8U1");
        return Relacional(_expresion, _ambito, _contexto, id);
    }
    else if (tipo === Enum_1.Tipos.LOGICA_AND || tipo === Enum_1.Tipos.LOGICA_OR) {
        const Logica = __webpack_require__(/*! ./Operators/Logica */ "TxV8");
        return Logica(_expresion, _ambito, _contexto);
    }
    else if (tipo === Enum_1.Tipos.IF_THEN_ELSE) {
        const IfConditional = __webpack_require__(/*! ../../xquery/If */ "tJF2");
        return IfConditional(_expresion.condicionIf, _expresion.instruccionesThen, _expresion.instruccionesElse, _ambito, _contexto, id);
    }
    else {
        const ExpresionQuery = __webpack_require__(/*! ../../xquery/Expresion/Expresion */ "Rfe7");
        return ExpresionQuery(_expresion, _ambito, _contexto, id);
    }
}
module.exports = Expresion;


/***/ }),

/***/ "hC0Z":
/*!*****************************************!*\
  !*** ./src/js/controller/xquery/Let.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Contexto_1 = __webpack_require__(/*! ../Contexto */ "ivfU");
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
const Variable_1 = __webpack_require__(/*! ../../model/xml/Ambito/Variable */ "C8dJ");
function LetClause(_id, _valor, _ambito, _contexto, id) {
    const Expresion = __webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf");
    let tmp = new Contexto_1.Contexto(_contexto);
    let variable = new Variable_1.Variable(_id.variable, Enum_1.Tipos.VARIABLE);
    let contexto = Expresion(_valor, _ambito, tmp, id);
    // console.log(_valor,3020220)
    if (contexto) {
        variable.setValue(contexto);
        _ambito.addVariabe(variable);
    }
    // console.log(variable, 3333333);
}
module.exports = LetClause;


/***/ }),

/***/ "i+6F":
/*!**********************************!*\
  !*** ./src/js/routes/compile.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Contexto_1 = __webpack_require__(/*! ../controller/Contexto */ "ivfU");
const Bloque_XQuery_1 = __importDefault(__webpack_require__(/*! ../controller/xquery/Bloque_XQuery */ "+qh/"));
const Bloque_XPath_1 = __importDefault(__webpack_require__(/*! ../controller/xpath/Bloque_XPath */ "7QFG"));
const Ambito_1 = __webpack_require__(/*! ../model/xml/Ambito/Ambito */ "QFP7");
const Global_1 = __webpack_require__(/*! ../model/xml/Ambito/Global */ "IRxg");
const Element_1 = __webpack_require__(/*! ../model/xml/Element */ "Kypw");
function compile(req) {
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
                parser_xml = __webpack_require__(/*! ../analyzers/xml_up */ "nxic");
                parser_xQuery = __webpack_require__(/*! ../analyzers/xquery */ "lv3P");
                break;
            case 2:
                parser_xml = __webpack_require__(/*! ../analyzers/xml_up */ "nxic");
                parser_xQuery = __webpack_require__(/*! ../analyzers/xquery */ "lv3P");
                break;
        }
        // Análisis de XML
        let xml_ast = parser_xml.parse(xml);
        let encoding = xml_ast.encoding; // Encoding del documento XML
        if (encoding.encoding === encoding.codes.INVALID) {
            errors.push({ tipo: "Léxico", error: "La codificación del XML no es válida.", origen: "XML", linea: "1", columna: "1" });
        }
        if (xml_ast.errors.length > 0 || xml_ast.ast === null || xml_ast === true) {
            if (xml_ast.errors.length > 0)
                errors = errors.concat(xml_ast.errors);
            if (xml_ast.ast === null || xml_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: "1", columna: "1" });
                return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }
        let xml_parse = xml_ast.ast; // AST que genera Jison
        let global = new Ambito_1.Ambito(null, "global"); // Ámbito global
        let cadena = new Global_1.Global(xml_parse, global); // Llena la tabla de símbolos
        let simbolos = cadena.ambito.getArraySymbols(); // Arreglo con los símbolos
        // Análisis de xQuery
        let xQuery_ast = parser_xQuery.parse(xQuery);
        let ast = (xQuery_ast.xquery) ? (xQuery_ast.xquery) : (xQuery_ast.xpath); // AST que genera Jison
        // console.log(xQuery_ast.ast, "ast");
        if (xQuery_ast.errors.length > 0 || ast === null || xQuery_ast === true) {
            if (xQuery_ast.errors.length > 0)
                errors = xQuery_ast.errors;
            if (ast === null || xQuery_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta digitada.", origen: "XQuery", linea: "1", columna: "1" });
                return { output: "La consulta contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }
        let root = new Contexto_1.Contexto();
        root.elementos = [new Element_1.Element("[object XMLDocument]", [], "", cadena.ambito.tablaSimbolos, "0", "0", "[object XMLDocument]")];
        let bloque;
        if (xQuery_ast.xquery) {
            bloque = Bloque_XQuery_1.default.getOutput(xQuery_ast.xquery, cadena.ambito, root); // Procesa las instrucciones de XQuery (fase 2)
        }
        else if (xQuery_ast.xpath) {
            bloque = Bloque_XPath_1.default(xQuery_ast.xpath, cadena.ambito, root); // Procesa las instrucciones si sólo viene XPath (fase 1)
        }
        let output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: errors,
            output: bloque === null || bloque === void 0 ? void 0 : bloque.cadena,
            encoding: encoding,
            codigo3d: bloque === null || bloque === void 0 ? void 0 : bloque.codigo3d
        };
        errors = [];
        return output;
    }
    catch (error) {
        console.log(error);
        errors.push({ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" });
        let output = {
            arreglo_simbolos: [],
            arreglo_errores: errors,
            output: (error.message) ? String(error.message) : String(error),
            encoding: "utf-8"
        };
        errors = [];
        return output;
    }
}
module.exports = { compile: compile };


/***/ }),

/***/ "iGkZ":
/*!******************************************!*\
  !*** ./src/js/model/xml/Ambito/Hijos.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Ambito_1 = __webpack_require__(/*! ./Ambito */ "QFP7");
function exec(_expresiones, _ambito) {
    _expresiones.forEach(element => {
        if (element) {
            if (element.childs) {
                let nuevoAmbito = new Ambito_1.Ambito(_ambito, "hijo");
                exec(element.childs, nuevoAmbito);
            }
            _ambito.addSimbolo(element);
        }
    });
}
module.exports = { exec: exec };


/***/ }),

/***/ "ieEo":
/*!**********************************!*\
  !*** ./src/js/routes/reports.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function generateReport(req) {
    let errors = [];
    try {
        // Datos de la petición desde Angular
        let xml = req.xml;
        let xPath = req.query;
        let grammar_selected = req.grammar;
        let report = req.report;
        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        let parser_xml, parser_xPath;
        switch (grammar_selected) {
            case 1:
                parser_xml = __webpack_require__(/*! ../analyzers/xml_up */ "nxic");
                parser_xPath = __webpack_require__(/*! ../analyzers/xpath_up */ "9ArA");
                break;
            case 2:
                parser_xml = __webpack_require__(/*! ../analyzers/xml_down */ "cW0F");
                parser_xPath = __webpack_require__(/*! ../analyzers/xpath_down */ "jiUV");
                break;
        }
        switch (report) {
            case "XML-CST":
                return CST_xml(parser_xml, xml);
            case "XML-GRAMMAR":
                return GrammarReport_xml(parser_xml, xml);
            case "XPATH-AST":
                return AST_xml(parser_xml, xml); // Se dejó el del xml
            default:
                return { output: "Algo salió mal." };
        }
    }
    catch (error) {
        console.log(error);
        errors.push({ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" });
        let output = {
            arreglo_errores: errors,
            output: (error.message) ? String(error.message) : String(error),
            cst: ""
        };
        errors = [];
        return output;
    }
}
function CST_xml(parser_xml, xml) {
    let errors = [];
    // Análisis de XML
    let xml_ast = parser_xml.parse(xml);
    let _cst = xml_ast.cst;
    if (xml_ast.errors.length > 0 || xml_ast.ast === null || xml_ast === true) {
        if (xml_ast.errors.length > 0)
            errors = xml_ast.errors;
        if (xml_ast.ast === null || xml_ast === true) {
            errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 });
            return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
        }
    }
    let output = {
        arreglo_errores: errors,
        output: "CST generado.",
        cst: _cst
    };
    return output;
}
function GrammarReport_xml(parser_xml, xml) {
    let errors = [];
    // Análisis de XML
    let xml_ast = parser_xml.parse(xml);
    let _grammar = xml_ast.grammar_report;
    if (xml_ast.errors.length > 0 || xml_ast.ast === null || xml_ast === true) {
        if (xml_ast.errors.length > 0)
            errors = xml_ast.errors;
        if (xml_ast.ast === null || xml_ast === true) {
            errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 });
            return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
        }
    }
    let output = {
        arreglo_errores: errors,
        output: "Reporte gramatical generado.",
        grammar_report: _grammar
    };
    return output;
}
function AST_xml(parser_xml, xml) {
    let errors = [];
    // Análisis de XML
    let xpath_xml = parser_xml.parse(xml);
    let _ast = xpath_xml.ast;
    if (xpath_xml.errors.length > 0 || xpath_xml.ast === null || xpath_xml === true) {
        if (xpath_xml.errors.length > 0)
            errors = xpath_xml.errors;
        if (xpath_xml.ast === null || xpath_xml === true) {
            errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 });
            return { output: "El documento XML contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
        }
    }
    let str = _ast[0].getASTXMLTree();
    let output = {
        arreglo_errores: errors,
        output: "AST generado.",
        ast: str
    };
    return output;
}
function AST_xpath(parser_xpath, xpath) {
    let errors = [];
    // Análisis de XPath
    let xpath_ast = parser_xpath.parse(xpath);
    let _ast = xpath_ast.arbolAST;
    if (xpath_ast.errors.length > 0 || xpath_ast.ast === null || xpath_ast === true) {
        if (xpath_ast.errors.length > 0)
            errors = xpath_ast.errors;
        if (xpath_ast.ast === null || xpath_ast === true) {
            errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta.", origen: "XPath", linea: 1, columna: 1 });
            return { output: "La consulta contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
        }
    }
    let output = {
        arreglo_errores: errors,
        output: "AST generado.",
        ast: _ast
    };
    return output;
}
module.exports = { generateReport: generateReport };


/***/ }),

/***/ "ivfU":
/*!***************************************!*\
  !*** ./src/js/controller/Contexto.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Contexto = void 0;
const Enum_1 = __webpack_require__(/*! ../model/xpath/Enum */ "MEUw");
class Contexto {
    constructor(_context) {
        if (_context) {
            this.elementos = _context.elementos;
            this.atributos = _context.atributos;
            this.texto = _context.texto;
            this.nodos = _context.nodos;
            this.cadena = _context.cadena;
            this.items = _context.items;
            if (_context.variable)
                this.variable = _context.variable;
            if (_context.atCounter)
                this.atCounter = _context.atCounter;
        }
        else {
            this.elementos = [];
            this.atributos = [];
            this.texto = [];
            this.nodos = [];
            this.items = [];
            this.cadena = Enum_1.Tipos.NONE;
        }
        this.error = this.notFound = null;
    }
    pushElement(_v) {
        this.elementos.push(_v);
    }
    pushAttribute(_v) {
        this.atributos.push(_v);
    }
    pushText(_v) {
        this.texto.push(_v);
    }
    pushNode(_v) {
        this.nodos.push(_v);
    }
    pushItem(_v) {
        this.items.push(_v);
    }
    removeDuplicates() {
        if (this.elementos.length > 0) {
            this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.line === v.line && t.column === v.column)) === i);
        }
    }
    removeDadDuplicates() {
        this.removeDuplicates();
        if (this.atributos.length > 0)
            this.atributos = this.atributos.filter((v, i, a) => a.findIndex(t => (t.line === v.line)) === i);
        this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.father.line === v.father.line && t.father.column === v.father.column)) === i);
        return this.getArray();
    }
    /* addArray(_array: Array<any>) {
        if (this.atributos.length > 0)
            this.atributos = _array;
        else if (this.elementos.length > 0)
            this.elementos = _array;
        else if (this.texto.length > 0)
            this.texto = _array;
        else if (this.nodos.length > 0)
            this.nodos = _array;
    } */
    getLength() {
        if (this.items.length > 0)
            return this.items.length;
        if (this.atributos.length > 0)
            return this.atributos.length;
        if (this.elementos.length > 0)
            return this.elementos.length;
        if (this.texto.length > 0)
            return this.texto.length;
        if (this.nodos.length > 0)
            return this.nodos.length;
        return 0;
    }
    getArray() {
        if (this.atributos.length > 0)
            return this.atributos;
        if (this.elementos.length > 0)
            return this.elementos;
        if (this.texto.length > 0)
            return this.texto;
        if (this.nodos.length > 0)
            return this.nodos;
        return [];
    }
    set setCadena(v) {
        this.cadena = v;
    }
    set setElements(v) {
        this.elementos = v;
    }
    set setAttributes(v) {
        this.atributos = v;
    }
    set setTexto(v) {
        this.texto = v;
    }
    set setNodos(v) {
        this.nodos = v;
    }
}
exports.Contexto = Contexto;


/***/ }),

/***/ "jdP8":
/*!**************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Match.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function filterElements(valor, desigualdad, _contexto, _root) {
    try {
        let condition = false;
        let out = [];
        let array = _contexto.removeDadDuplicates();
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            condition = verificarDesigualdad(desigualdad, obj, valor);
            if (condition) { // Si la condición cumple, apilar los elementos en esa posición
                out.push(_root.elementos[i]);
            }
        }
        _root.elementos = out;
        // console.log(_root,33333333333333)
        return [_root];
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
function verificarDesigualdad(_tipo, v1, e1) {
    switch (_tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return (v1.value > e1) || (v1.id > e1);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return (v1.value >= e1) || (v1.id >= e1);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return (v1.value < e1) || (v1.id < e1);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return (v1.value <= e1) || (v1.id <= e1);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return (v1.value == e1) || (v1.id == e1);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return (v1.value != e1) && (v1.id != e1);
        default:
            return false;
    }
}
module.exports = filterElements;


/***/ }),

/***/ "jiUV":
/*!****************************************!*\
  !*** ./src/js/analyzers/xpath_down.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xpath_down = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,20],$V3=[1,16],$V4=[1,17],$V5=[1,18],$V6=[1,19],$V7=[1,21],$V8=[1,22],$V9=[1,23],$Va=[1,12],$Vb=[1,13],$Vc=[1,14],$Vd=[1,15],$Ve=[1,24],$Vf=[1,25],$Vg=[1,26],$Vh=[1,27],$Vi=[1,28],$Vj=[1,29],$Vk=[1,30],$Vl=[1,31],$Vm=[1,32],$Vn=[1,33],$Vo=[1,34],$Vp=[1,35],$Vq=[1,36],$Vr=[2,5],$Vs=[1,39],$Vt=[1,40],$Vu=[5,8,9],$Vv=[2,8],$Vw=[5,8,9,12,13,19,22,23,24,25,26,27,28,29,30,32,33,34,35,36,39,40,41,42,43,44,45,46,47,48,49,52,53,54,55,56,57,58,59,60,61,62,63,64],$Vx=[2,17],$Vy=[1,47],$Vz=[5,8,9,12,13,17,19,22,23,24,25,26,27,28,29,30,32,33,34,35,36,39,40,41,42,43,44,45,46,47,48,49,52,53,54,55,56,57,58,59,60,61,62,63,64],$VA=[1,60],$VB=[1,61],$VC=[1,71],$VD=[1,72],$VE=[1,73],$VF=[1,74],$VG=[1,75],$VH=[1,76],$VI=[1,77],$VJ=[1,78],$VK=[1,79],$VL=[1,80],$VM=[1,81],$VN=[1,82],$VO=[1,83],$VP=[19,22,23,24,25,26,27,28,29,30,32,33,34,35,36],$VQ=[2,15],$VR=[1,87],$VS=[19,22,23,24,25,32,33,34,35,36],$VT=[19,22,23,24,25,26,27,32,33,34,35,36];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"XPATH_U":4,"EOF":5,"XPATH":6,"XPATH_Up":7,"tk_line":8,"tk_2line":9,"QUERY":10,"XPATHp":11,"tk_2bar":12,"tk_bar":13,"EXP_PR":14,"AXIS":15,"CORCHET":16,"tk_corA":17,"E":18,"tk_corC":19,"CORCHETpp":20,"CORCHETP":21,"tk_menorigual":22,"tk_menor":23,"tk_mayorigual":24,"tk_mayor":25,"tk_mas":26,"tk_menos":27,"tk_asterisco":28,"tk_div":29,"tk_mod":30,"tk_ParA":31,"tk_ParC":32,"tk_or":33,"tk_and":34,"tk_equal":35,"tk_diferent":36,"FUNC":37,"PRIMITIVO":38,"tk_id":39,"tk_attribute_d":40,"tk_attribute_s":41,"num":42,"tk_punto":43,"tk_2puntos":44,"tk_arroba":45,"tk_text":46,"tk_last":47,"tk_position":48,"tk_node":49,"AXISNAME":50,"tk_4puntos":51,"tk_ancestor":52,"tk_ancestor2":53,"tk_attribute":54,"tk_child":55,"tk_descendant":56,"tk_descendant2":57,"tk_following":58,"tk_following2":59,"tk_namespace":60,"tk_parent":61,"tk_preceding":62,"tk_preceding2":63,"tk_self":64,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"tk_line",9:"tk_2line",12:"tk_2bar",13:"tk_bar",17:"tk_corA",19:"tk_corC",22:"tk_menorigual",23:"tk_menor",24:"tk_mayorigual",25:"tk_mayor",26:"tk_mas",27:"tk_menos",28:"tk_asterisco",29:"tk_div",30:"tk_mod",31:"tk_ParA",32:"tk_ParC",33:"tk_or",34:"tk_and",35:"tk_equal",36:"tk_diferent",39:"tk_id",40:"tk_attribute_d",41:"tk_attribute_s",42:"num",43:"tk_punto",44:"tk_2puntos",45:"tk_arroba",46:"tk_text",47:"tk_last",48:"tk_position",49:"tk_node",51:"tk_4puntos",52:"tk_ancestor",53:"tk_ancestor2",54:"tk_attribute",55:"tk_child",56:"tk_descendant",57:"tk_descendant2",58:"tk_following",59:"tk_following2",60:"tk_namespace",61:"tk_parent",62:"tk_preceding",63:"tk_preceding2",64:"tk_self"},
productions_: [0,[3,2],[4,2],[7,3],[7,3],[7,0],[6,2],[11,2],[11,0],[10,2],[10,2],[10,1],[10,1],[16,4],[20,4],[20,0],[21,1],[21,0],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,2],[18,3],[18,3],[18,3],[18,3],[18,3],[18,1],[14,2],[14,2],[38,1],[38,1],[38,1],[38,1],[38,1],[38,1],[38,1],[38,2],[38,2],[37,3],[37,3],[37,3],[37,3],[15,3],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

	prod_1 = grammar_stack.pop();
	prod_2 = grammar_stack.pop();
	grammar_stack.push({'ini -: XPATH_U EOF ':[prod_2, prod_1]});
	printstrack(grammar_stack, 0);
	console.log('gramatica descendente');
	
break;
case 2:

		prod_1 = grammar_stack.pop();
		prod_2 = grammar_stack.pop();
		grammar_stack.push({'XPATH_U -: XPATH XPATH_Up ':[prod_2, prod_1]});

break;
case 3:

		prod_1 = grammar_stack.pop();
		prod_2 = grammar_stack.pop();
		grammar_stack.push({'XPATH_Up -: tk_line XPATH XPATH_Up ':['token: tk_line\t Lexema: ' + $$[$0-2], prod_2, prod_1]});
break;
case 4:

            prod_1 = grammar_stack.pop();
            prod_2 = grammar_stack.pop();
            grammar_stack.push({'XPATH_Up -: tk_2line XPATH XPATH_Up ':['token: tk_2line\t Lexema: ' + $$[$0-2], prod_2, prod_1]});
break;
case 5:
 grammar_stack.push({'XPATH_Up -: Empty': ['EMPTY']}); 
break;
case 6:

		prod_1 = grammar_stack.pop();
		prod_2 = grammar_stack.pop();
		grammar_stack.push({'XPATH -: QUERY XPATHp ':[prod_2, prod_1]});

break;
case 7:

		prod_1 = grammar_stack.pop();
		prod_2 = grammar_stack.pop();
		grammar_stack.push({'XPATHp -: QUERY XPATHp ':[prod_2, prod_1]});

break;
case 8:
 grammar_stack.push({'XPATHp -: Empty': ['EMPTY']}); 
break;
case 9:
 //this.$=builder.newDoubleAxis($$[$0], this._$.first_line, this._$.first_column+1);
					   prod_1 = grammar_stack.pop();
			 		   grammar_stack.push({'QUERY -: tk_2bar QUERY': ['token: tk_2bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 10:
 //this.$=builder.newAxis($$[$0], this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
			 		 grammar_stack.push({'QUERY -: tk_bar QUERY': ['token: tk_bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 11:
 //this.$=$$[$0];
			   prod_1 = grammar_stack.pop();
			   grammar_stack.push({'QUERY -: EXP_PR': [prod_1]}); 
break;
case 12:
 //this.$=$$[$0];
			 prod_1 = grammar_stack.pop();
			 grammar_stack.push({'QUERY -: AXIS': [prod_1]}); 
break;
case 13:

			prod_1 = grammar_stack.pop();
			prod_2 = grammar_stack.pop();
			grammar_stack.push({'CORCHET -: tk_corA E tk_corC CORCHETpp': ['token: tk_menorigual\t Lexema: ' + $$[$0-3], prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]});	

break;
case 14:

										prod_1 = grammar_stack.pop();
										prod_2 = grammar_stack.pop();
										grammar_stack.push({'CORCHETpp -: tk_corA E tk_corC CORCHETpp ':['token: tk_menorigual\t Lexema: ' + $$[$0-3], prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]});	

break;
case 15:
 grammar_stack.push({'CORCHETpp -: Empty': ['EMPTY']}); 
break;
case 16:
 prod_1 = grammar_stack.pop();
					grammar_stack.push({'CORCHETP -: CORCHET': [prod_1]}) 
break;
case 17:
 grammar_stack.push({'CORCHETP -: Empty': ['EMPTY']}); 
break;
case 18:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENORIGUAL, this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
				 		prod_2 = grammar_stack.pop();
					    grammar_stack.push({'E -: E tk_menorigual E': [prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 19:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -: E tk_menor E': [prod_2, 'token: tk_menor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 20:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYORIGUAL, this._$.first_line, this._$.first_column+1);
						  prod_1 = grammar_stack.pop();
				 		  prod_2 = grammar_stack.pop();
						  grammar_stack.push({'E -: E tk_mayorigual E': [prod_2, 'token: tk_mayorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 21:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -: E tk_mayor E': [prod_2, 'token: tk_mayor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 22:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_SUMA, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -: E tk_mas E': [prod_2, 'token: tk_mas\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 23:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				  	 grammar_stack.push({'E -: E tk_menos E': [prod_2, 'token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 24:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MULTIPLICACION, this._$.first_line, this._$.first_column+1);
						 prod_1 = grammar_stack.pop();
				 		 prod_2 = grammar_stack.pop();
				  		 grammar_stack.push({'E -: E tk_asterisco E': [prod_2, 'token: tk_asterisco\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 25:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_DIVISION, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -: E tk_div E': [prod_2, 'token: tk_div\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 26:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MODULO, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -: E tk_mod E': [prod_2, 'token: tk_mod\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 27:
 //this.$=builder.newOperation($$[$0], null, Tipos.OPERACION_NEGACION_UNARIA, this._$.first_line, this._$.first_column+1); 
								prod_1 = grammar_stack.pop();
						  		grammar_stack.push({'E -: tk_menos E': ['token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]});
break;
case 28:
 //this.$=$$[$0-1];
						  prod_1 = grammar_stack.pop();
						  grammar_stack.push({'E -: tk_ParA E tk_ParC': ['token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 29:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_OR, this._$.first_line, this._$.first_column+1);
				  prod_1 = grammar_stack.pop();
				  prod_2 = grammar_stack.pop();
				  grammar_stack.push({'E -: E tk_or E': [prod_2, 'token: tk_or\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 30:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_AND, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -: E tk_and E': [prod_2, 'token: tk_and\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 31:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_IGUAL, this._$.first_line, this._$.first_column+1); 
					 prod_1 = grammar_stack.pop();
					 prod_2 = grammar_stack.pop();
					 grammar_stack.push({'E -: E tk_equal E': [prod_2, 'token: tk_equal\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 32:
 //this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_DIFERENTE, this._$.first_line, this._$.first_column+1); 
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'E -: E tk_diferent E': [prod_2, 'token: tk_diferent\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 33:
 //this.$=$$[$0];
			  prod_1 = grammar_stack.pop();
			  grammar_stack.push({'E -: QUERY': [prod_1]}); 
break;
case 34:
 //this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'EXP_PR -: FUNC CORCHETP': [prod_2, prod_1]}); 
break;
case 35:
 //this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'EXP_PR -: PRIMITIVO CORCHETP': [prod_2, prod_1]}); 
break;
case 36:
 //this.$=builder.newNodename($$[$0], this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -: tk_id':['token: tk_text\t Lexema: ' + $$[$0]]}); 
break;
case 37:
 //this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1);
						   grammar_stack.push({'PRIMITIVO -: tk_attribute_d':['token: tk_attribute_d\t Lexema: ' + $$[$0]]}); 
break;
case 38:
 //this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1); 
						   grammar_stack.push({'PRIMITIVO -: tk_attribute_s':['token: tk_attribute_s\t Lexema: ' + $$[$0]]}); 
break;
case 39:
 //this.$=builder.newValue($$[$0], Tipos.NUMBER, this._$.first_line, this._$.first_column+1);
				grammar_stack.push({'PRIMITIVO -: num':['token: num\t Lexema: ' + $$[$0]]}); 
break;
case 40:
 //this.$=builder.newValue($$[$0], Tipos.ASTERISCO, this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -: tk_asterisco':['token: tk_asterisco\t Lexema: ' + $$[$0]]}); 
break;
case 41:
 //this.$=builder.newCurrent($$[$0], this._$.first_line, this._$.first_column+1); 
					 grammar_stack.push({'PRIMITIVO -: tk_punto':['token: tk_punto\t Lexema: ' + $$[$0]]}); 
break;
case 42:
 //this.$=builder.newParent($$[$0], this._$.first_line, this._$.first_column+1);
					   grammar_stack.push({'PRIMITIVO -: tk_2puntos':['token: tk_2puntos\t Lexema: ' + $$[$0]]}); 
break;
case 43:
 //this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1);
							grammar_stack.push({'PRIMITIVO -: tk_arroba tk_id':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_id\t Lexema: ' + $$[$0]]}); 
break;
case 44:
 //this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1); 
							 grammar_stack.push({'PRIMITIVO -: tk_arroba tk_asterisco':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_asterisco\t Lexema: ' + $$[$0]]});
break;
case 45:
 //this.$=builder.newValue($$[$0-2], Tipos.FUNCION_TEXT, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -: tk_text tk_ParA tk_ParC':['token: tk_text\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 46:
 //this.$=builder.newValue($$[$0-2], Tipos.FUNCION_LAST, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -: tk_last tk_ParA tk_ParC':['token: tk_last\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 47:
 //this.$=builder.newValue($$[$0-2], Tipos.FUNCION_POSITION, this._$.first_line, this._$.first_column+1); 
									grammar_stack.push({'FUNC -: tk_position tk_ParA tk_ParC':['token: tk_position\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 48:
 //this.$=builder.newValue($$[$0-2], Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); 
								grammar_stack.push({'FUNC -: tk_node tk_ParA tk_ParC':['token: tk_node\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 49:
 //this.$=builder.newAxisObject($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'AXIS -: AXISNAME tk_4puntos QUERY':[prod_2, 'token: tk_4puntos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 50:
 //this.$ = Tipos.AXIS_ANCESTOR;
						grammar_stack.push({'AXISNAME -: tk_ancestor':['token: tk_ancestor\t Lexema: ' + $$[$0]]}); 
break;
case 51:
 //this.$ = Tipos.AXIS_ANCESTOR_OR_SELF;
						grammar_stack.push({'AXISNAME -: tk_ancestor2':['token: tk_ancestor2\t Lexema: ' + $$[$0]]}); 
break;
case 52:
 //this.$ = Tipos.AXIS_ATTRIBUTE;
						grammar_stack.push({'AXISNAME -: tk_attribute':['token: tk_attribute\t Lexema: ' + $$[$0]]}); 
break;
case 53:
 //this.$ = Tipos.AXIS_CHILD;
						grammar_stack.push({'AXISNAME -: tk_child':['token: tk_child\t Lexema: ' + $$[$0]]}); 
break;
case 54:
 //this.$ = Tipos.AXIS_DESCENDANT;
						grammar_stack.push({'AXISNAME -: tk_descendant':['token: tk_descendant\t Lexema: ' + $$[$0]]}); 
break;
case 55:
 //this.$ = Tipos.AXIS_DESCENDANT_OR_SELF;
						grammar_stack.push({'AXISNAME -: tk_descendant2':['token: tk_descendant2\t Lexema: ' + $$[$0]]}); 
break;
case 56:
 //this.$ = Tipos.AXIS_FOLLOWING;
						grammar_stack.push({'AXISNAME -: tk_following':['token: tk_following\t Lexema: ' + $$[$0]]}); 
break;
case 57:
 //this.$ = Tipos.AXIS_FOLLOWING_SIBLING;
						grammar_stack.push({'AXISNAME -: tk_following2':['token: tk_follownig2\t Lexema: ' + $$[$0]]}); 
break;
case 58:
 //this.$ = Tipos.AXIS_NAMESPACE;
						grammar_stack.push({'AXISNAME -: tk_namespace':['token: tk_namespace\t Lexema: ' + $$[$0]]}); 
break;
case 59:
 //this.$ = Tipos.AXIS_PARENT;
						grammar_stack.push({'AXISNAME -: tk_parent':['token: tk_parent\t Lexema: ' + $$[$0]]}); 
break;
case 60:
 //this.$ = Tipos.AXIS_PRECEDING;
						grammar_stack.push({'AXISNAME -: tk_preceding':['token: tk_preceding\t Lexema: ' + $$[$0]]}); 
break;
case 61:
 //this.$ = Tipos.AXIS_PRECEDING_SIBLING;
						grammar_stack.push({'AXISNAME -: tk_preceding2':['token: tk_preceding2\t Lexema: ' + $$[$0]]}); 
break;
case 62:
 //this.$ = Tipos.AXIS_SELF;
						grammar_stack.push({'AXISNAME -: tk_self':['token: tk_self\t Lexema: ' + $$[$0]]}); 
break;
}
},
table: [{3:1,4:2,6:3,10:4,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{1:[3]},{5:[1,37]},{5:$Vr,7:38,8:$Vs,9:$Vt},o($Vu,$Vv,{14:7,15:8,37:9,38:10,50:11,11:41,10:42,12:$V0,13:$V1,28:$V2,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq}),{10:43,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:44,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($Vw,[2,11]),o($Vw,[2,12]),o($Vw,$Vx,{21:45,16:46,17:$Vy}),o($Vw,$Vx,{16:46,21:48,17:$Vy}),{51:[1,49]},{31:[1,50]},{31:[1,51]},{31:[1,52]},{31:[1,53]},o($Vz,[2,36]),o($Vz,[2,37]),o($Vz,[2,38]),o($Vz,[2,39]),o($Vz,[2,40]),o($Vz,[2,41]),o($Vz,[2,42]),{28:[1,55],39:[1,54]},{51:[2,50]},{51:[2,51]},{51:[2,52]},{51:[2,53]},{51:[2,54]},{51:[2,55]},{51:[2,56]},{51:[2,57]},{51:[2,58]},{51:[2,59]},{51:[2,60]},{51:[2,61]},{51:[2,62]},{1:[2,1]},{5:[2,2]},{6:56,10:4,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{6:57,10:4,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($Vu,[2,6]),o($Vu,$Vv,{14:7,15:8,37:9,38:10,50:11,10:42,11:58,12:$V0,13:$V1,28:$V2,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq}),o($Vw,[2,9]),o($Vw,[2,10]),o($Vw,[2,34]),o($Vw,[2,16]),{10:62,12:$V0,13:$V1,14:7,15:8,18:59,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($Vw,[2,35]),{10:63,12:$V0,13:$V1,14:7,15:8,28:$V2,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{32:[1,64]},{32:[1,65]},{32:[1,66]},{32:[1,67]},o($Vz,[2,43]),o($Vz,[2,44]),{5:$Vr,7:68,8:$Vs,9:$Vt},{5:$Vr,7:69,8:$Vs,9:$Vt},o($Vu,[2,7]),{19:[1,70],22:$VC,23:$VD,24:$VE,25:$VF,26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK,33:$VL,34:$VM,35:$VN,36:$VO},{10:62,12:$V0,13:$V1,14:7,15:8,18:84,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:85,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($VP,[2,33]),o($Vw,[2,49]),o($Vz,[2,45]),o($Vz,[2,46]),o($Vz,[2,47]),o($Vz,[2,48]),{5:[2,3]},{5:[2,4]},o($Vw,$VQ,{20:86,17:$VR}),{10:62,12:$V0,13:$V1,14:7,15:8,18:88,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:89,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:90,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:91,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:92,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:93,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:94,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:95,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:96,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:97,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:98,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:99,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},{10:62,12:$V0,13:$V1,14:7,15:8,18:100,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($VP,[2,27]),{22:$VC,23:$VD,24:$VE,25:$VF,26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK,32:[1,101],33:$VL,34:$VM,35:$VN,36:$VO},o($Vw,[2,13]),{10:62,12:$V0,13:$V1,14:7,15:8,18:102,27:$VA,28:$V2,31:$VB,37:9,38:10,39:$V3,40:$V4,41:$V5,42:$V6,43:$V7,44:$V8,45:$V9,46:$Va,47:$Vb,48:$Vc,49:$Vd,50:11,52:$Ve,53:$Vf,54:$Vg,55:$Vh,56:$Vi,57:$Vj,58:$Vk,59:$Vl,60:$Vm,61:$Vn,62:$Vo,63:$Vp,64:$Vq},o($VS,[2,18],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VS,[2,19],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VS,[2,20],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VS,[2,21],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VT,[2,22],{28:$VI,29:$VJ,30:$VK}),o($VT,[2,23],{28:$VI,29:$VJ,30:$VK}),o($VP,[2,24]),o($VP,[2,25]),o($VP,[2,26]),o([19,32,33],[2,29],{22:$VC,23:$VD,24:$VE,25:$VF,26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK,34:$VM,35:$VN,36:$VO}),o([19,32,33,34],[2,30],{22:$VC,23:$VD,24:$VE,25:$VF,26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK,35:$VN,36:$VO}),o($VS,[2,31],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VS,[2,32],{26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK}),o($VP,[2,28]),{19:[1,103],22:$VC,23:$VD,24:$VE,25:$VF,26:$VG,27:$VH,28:$VI,29:$VJ,30:$VK,33:$VL,34:$VM,35:$VN,36:$VO},o($Vw,$VQ,{20:104,17:$VR}),o($Vw,[2,14])],
defaultActions: {24:[2,50],25:[2,51],26:[2,52],27:[2,53],28:[2,54],29:[2,55],30:[2,56],31:[2,57],32:[2,58],33:[2,59],34:[2,60],35:[2,61],36:[2,62],37:[2,1],38:[2,2],68:[2,3],69:[2,4]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

	var attribute = '';
	var errors = [];
	let re = /[^\n\t\r ]+/g
	//let ast = null;
	let grammar_stack = [];

    function getGrammarReport(obj){
        let str = `<!DOCTYPE html>
                     <html lang="en" xmlns="http://www.w3.org/1999/html">
                     <head>
                         <meta charset="UTF-8">
                         <meta
                         content="width=device-width, initial-scale=1, shrink-to-fit=no"
                         name="viewport">
                         <!-- Bootstrap CSS -->
                         <link
                         crossorigin="anonymous"
                         href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                               integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                               rel="stylesheet">
                         <title>Title</title>
                         <style>
                             table, th, td {
                                 border: 1px solid black;
                             }
                             ul, .ul-tree-view {
                                 list-style-type: none;
                             }

                             #div-table{
                                 width: 1200px;
                                 margin: 100px;
                                 border: 3px solid #73AD21;
                             }

                             .ul-tree-view {
                                 margin: 0;
                                 padding: 0;
                             }

                             .caret {
                                 cursor: pointer;
                                 -webkit-user-select: none; /* Safari 3.1+ */
                                 -moz-user-select: none; /* Firefox 2+ */
                                 -ms-user-select: none; /* IE 10+ */
                                 user-select: none;
                             }

                             .caret::before {
                                 content: "\u25B6";
                                 color: black;
                                 display: inline-block;
                                 margin-right: 6px;
                             }

                             .caret-down::before {
                                 -ms-transform: rotate(90deg); /* IE 9 */
                                 -webkit-transform: rotate(90deg); /* Safari */'
                             transform: rotate(90deg);
                             }

                             .nested {
                                 display: none;
                             }

                             .active {
                                 display: block;
                             }

                             li span:hover {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             li span:hover + ul li  {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             .tree-view{
                                 display: inline-block;
                             }

                             li.string {
                                 list-style-type: square;
                             }
                             li.string:hover {
                                 color : white;
                                 background-color: #dc5b27;
                             }
                             .center {
                                margin: auto;
                                width: 50%;
                                border: 3px solid green;
                                padding-left: 15%;
                             }
                         </style>
                     </head>
                     <body>
                     <h1 class="center">Reporte Gramatical</h1>
                     <div class="tree-view">
                     <ul class="ul-tree-view" id="tree-root">`;

        str = str + buildGrammarReport(obj);

        str = str + `
                    </ul>
                    </ul>
                    </div>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                        <button onclick="fun1()">Expand Grammar Tree</button>

                    <div id="div-table">
                    <table style="width:100%">

                    <tr><th>produccion</th><th>Cuerpo</th><th>Accion</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>ini</th><th>XPATH_U EOF</th><th>SS= S1</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>XPATH_U</th><th>XPATH XPATH_Up</th><th>S1.push(S3); SS = S1;</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>XPATH_Up</th><th>QUERY XPATHp</th><th>S1.push(S2); SS = S1;</th></tr>
                    <tr><th></th><th>Empty</th><th>SS=null</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>XPATH</th><th>QUERY XPATHp</th><th></th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>XPATHp</th><th>QUERY XPATHp</th><th>S1.push(S2); SS = S1;</th></tr>
                    <tr><th></th><th>Empty</th><th>SS=null</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>QUERY</th><th>tk_2bar QUERY</th><th>SS=builder.newDoubleAxis(Param);</th></tr>
                    <tr><th></th><th>tk_bar QUERY</th><th>SS=builder.newAxis(Param);</th></tr>
                    <tr><th></th><th>EXP_PR</th><th>SS=S1</th></tr>
                    <tr><th></th><th>AXIS</th><th>SS=S1</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>CORCHET</th><th>tk_corA E tk_corC CORCHETpp</th><th>SS=builder.newPredicate(Param)</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>CORCHETpp</th><th>tk_corA E tk_corC CORCHETpp</th><th>S1.push(builder.NewPredicate(Param))</th></tr>
                    <tr><th></th><th>Empty</th><th>SS=null</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>CORCHETP</th><th>CORCHET</th><th>SS=S1</th></tr>
                    <tr><th></th><th>Empty</th><th>SS=null</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>E</th><th>E tk_menorigual E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_menor E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_mayorigual E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_mayor E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_mas E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_menos E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_asterisco E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_div E </th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_mod E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>tk_ParA E tk_ParC</th><th>SS=S2</th></tr>
                    <tr><th></th><th>E tk_or E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_and E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_equal E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>E tk_diferent E</th><th>SS=builder.newOperation(Param)</th></tr>
                    <tr><th></th><th>QUERY</th><th>SS = [S1]</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>EXP_PR</th><th>FUNC CORCHETP</th><th>SS=builder.newExpression(Param)</th></tr>
                    <tr><th></th><th>PRIMITIVO CORCHETP</th><th>SS=builder.newExpression(Param)</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>PRIMITIVO</th><th>tk_id</th><th>SS=builder.newNodename(Param)</th></tr>
                    <tr><th></th><th>tk_attribute_d</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_attribute_s</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>num</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_asterisco</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_punto</th><th>SS=builder.newCurrent(Param)</th></tr>
                    <tr><th></th><th>tk_2puntos</th><th>SS=builder.newParent(Param)</th></tr>
                    <tr><th></th><th>tk_arroba tk_id</th><th>SS=builder.newAttribute(Param)</th></tr>
                    <tr><th></th><th>tk_arroba tk_asterisco</th><th>SS=builder.newAttribute(Param)</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>FUNC</th><th>tk_text tk_ParA tk_tk_ParC</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_last tk_ParA tk_ParC</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_position tk_ParA tk_ParC</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><th></th><th>tk_node tk_ParA tk_ParC</th><th>SS=builder.newValue(Param)</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>AXIS</th><th>AXISNAME tk_4puntos QUERY</th><th>SS=builder.newAxisObject(Param)</th></tr>
                    <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr>
                    <tr><th>AXISNAME</th><th>tk_ancestor</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_ancestor2</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_attribute</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_child</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_descendant</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_descendant2</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_following</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_following2</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_namespace</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_parent</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_preceding</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_preceding2</th><th>SS = Tipos.'AxisTipo'</th></tr>
                    <tr><th></th><th>tk_self</th><th>SS = Tipos.'AxisTipo'</th></tr>

                        </table>
                    </div>

                     <script
                     src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js">
                     </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                             src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js">
                             </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                             src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js">
                             </script>

                             <script>
                                 var toggler = document.getElementsByClassName("caret");
                                 var i;

                                 for (i = 0; i < toggler.length; i++) {
                                     toggler[i].addEventListener("click", function() {
                                         this.parentElement
                                         .querySelector(".nested")
                                         .classList.toggle("active");
                                         this.classList.toggle("caret-down");
                                     });
                                 }


                                        function fun1() {
                                            if ($("#tree-root").length > 0) {

                                                $("#tree-root").find("li").each
                                                (
                                                    function () {
                                                        var $span = $("<span></span>");
                                                        //$(this).toggleClass("expanded");
                                                        if ($(this).find("ul:first").length > 0) {
                                                            $span.removeAttr("class");
                                                            $span.attr("class", "expanded");
                                                            $(this).find("ul:first").css("display", "block");
                                                            $(this).append($span);
                                                        }

                                                    }
                                                )
                                            }

                                        }




                             </script>

                     </body>
                     </html>`;
                     return str;
    }
    // .replace("₤","$")
    function buildGrammarReport(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                str = str + `<li class= "string">
                ${value}
                </li>
                `;
            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildGrammarReport(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){

                str = `<li class="grammar-tree"><span class="caret">
                ${key}
                </span>
                <ul class="nested">
                `;
                str = str + buildGrammarReport(obj[key]);
                str = str + `
                </ul>
                </li>`;
            }
        }
        return str;
    }


    function getCST(obj){
        let str = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
            <!-- Bootstrap CSS -->
            <link crossorigin="anonymous" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                  integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" rel="stylesheet">
            <title>Title</title>
            <style>

                #divheight{
                    height: 400px;
                    width: 1050px;
                }

                .nav-tabs > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

                .nav-tabs2 > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

            </style>

            <style>
                body {
                    font-family: sans-serif;
                    font-size: 15px;
                }

                .tree ul {
                    position: relative;
                    padding: 1em 0;
                    white-space: nowrap;
                    margin: 0 auto;
                    text-align: center;
                }
                .tree ul::after {
                    content: "";
                    display: table;
                    clear: both;
                }

                .tree li {
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    list-style-type: none;
                    position: relative;
                    padding: 1em 0.5em 0 0.5em;
                }
                .tree li::before, .tree li::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 50%;
                    border-top: 1px solid #ccc;
                    width: 50%;
                    height: 1em;
                }
                .tree li::after {
                    right: auto;
                    left: 50%;
                    border-left: 1px solid #ccc;
                }
                /*
                ul:hover::after  {
                    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport)
                }*/

                .tree li:only-child::after, .tree li:only-child::before {
                    display: none;
                }
                .tree li:only-child {
                    padding-top: 0;
                }
                .tree li:first-child::before, .tree li:last-child::after {
                    border: 0 none;
                }
                .tree li:last-child::before {
                    border-right: 1px solid #ccc;
                    border-radius: 0 5px 0 0;
                }
                .tree li:first-child::after {
                    border-radius: 5px 0 0 0;
                }

                .tree ul ul::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    border-left: 1px solid #ccc;
                    width: 0;
                    height: 1em;
                }

                .tree li a {
                    border: 1px solid #ccc;
                    padding: 0.5em 0.75em;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    color: #333;
                    position: relative;
                    top: 1px;
                }

                .tree li a:hover,
                .tree li a:hover + ul li a {
                    background: #e9453f;
                    color: #fff;
                    border: 1px solid #e9453f;
                }

                .tree li a:hover + ul li::after,
                .tree li a:hover + ul li::before,
                .tree li a:hover + ul::before,
                .tree li a:hover + ul ul::before {
                    border-color: #e9453f;
                }

            </style>
        </head>
        <body>

        <div class="tree">
            <ul id="tree-list">

            <!--AQUI-->
        `;
        str = str + buildCSTTree(obj);
        str = str + `
        </ul>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
        <script crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
        <script crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
        </body>
        </html>
        `;
        return str;
    }

    function buildCSTTree(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                let words = value.split('Lexema:');
                if(words.length == 2){
                    let lex = words[1];     //TODO check not go out of bounds
                    let token = words[0];
                    str = str + `<li><a href="">${token}</a><ul>
                    <li><a href="">${lex}
                    </a></li>
                    </ul></li>
                    `;
                }else{
                    str = str + `<li><a href="">${value}</a></li>
                    `;
                }


            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildCSTTree(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){
                const words = key.split('->');
                //console.log(words[3]);
                str = `<li><a href="">${words[0]}</a>
                <ul>
                `;
                str = str + buildCSTTree(obj[key]) + `
                </ul>
                </li>`;
            }
        }
        return str;
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Whitespace
break;
case 1:// XPATHComment
break;
case 2:// MultiLineComment
break;
case 3:// Declaration XML
break;
case 4:return 29
break;
case 5:return 42
break;
case 6:return 22
break;
case 7:return 24
break;
case 8:return 23
break;
case 9:return 25
break;
case 10:return 12
break;
case 11:return 13
break;
case 12:return 35
break;
case 13:return 44
break;
case 14:return 43
break;
case 15:return 51
break;
case 16:return 45
break;
case 17:return 17
break;
case 18:return 19
break;
case 19:return 31
break;
case 20:return 32
break;
case 21:return 28
break;
case 22:return 53
break;
case 23:return 52
break;
case 24:return 54
break;
case 25:return 55
break;
case 26:return 57
break;
case 27:return 56
break;
case 28:return 59
break;
case 29:return 58
break;
case 30:return 60
break;
case 31:return 61
break;
case 32:return 63
break;
case 33:return 62
break;
case 34:return 64
break;
case 35:return 49
break;
case 36:return 47
break;
case 37:return 46
break;
case 38:return 48
break;
case 39:return 8
break;
case 40:return 9
break;
case 41:return 26
break;
case 42:return 27
break;
case 43:return 36
break;
case 44:return 33
break;
case 45:return 34
break;
case 46:return 30
break;
case 47:return 39
break;
case 48: attribute = ''; this.begin("string_doubleq"); 
break;
case 49: attribute += yy_.yytext; 
break;
case 50: attribute += "\""; 
break;
case 51: attribute += "\n"; 
break;
case 52: attribute += " ";  
break;
case 53: attribute += "\t"; 
break;
case 54: attribute += "\\"; 
break;
case 55: attribute += "\'"; 
break;
case 56: attribute += "\r"; 
break;
case 57: yy_.yytext = attribute; this.popState(); return 40; 
break;
case 58: attribute = ''; this.begin("string_singleq"); 
break;
case 59: attribute += yy_.yytext; 
break;
case 60: attribute += "\""; 
break;
case 61: attribute += "\n"; 
break;
case 62: attribute += " ";  
break;
case 63: attribute += "\t"; 
break;
case 64: attribute += "\\"; 
break;
case 65: attribute += "\'"; 
break;
case 66: attribute += "\r"; 
break;
case 67: yy_.yytext = attribute; this.popState(); return 41; 
break;
case 68:return 5
break;
case 69: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XPath", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:\(:[\s\S\n]*?:\))/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:<\?xml[\s\S\n]*?\?>)/i,/^(?:div\b)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/\/)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:::)/i,/^(?:@)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\()/i,/^(?:\))/i,/^(?:\*)/i,/^(?:ancestor-or-self\b)/i,/^(?:ancestor\b)/i,/^(?:attribute\b)/i,/^(?:child\b)/i,/^(?:descendant-or-self\b)/i,/^(?:descendant\b)/i,/^(?:following-sibling\b)/i,/^(?:following\b)/i,/^(?:namespace\b)/i,/^(?:parent\b)/i,/^(?:preceding-sibling\b)/i,/^(?:preceding\b)/i,/^(?:self\b)/i,/^(?:node\b)/i,/^(?:last\b)/i,/^(?:text\b)/i,/^(?:position\b)/i,/^(?:\|)/i,/^(?:\|\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:!=)/i,/^(?:or\b)/i,/^(?:and\b)/i,/^(?:mod\b)/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"string_singleq":{"rules":[59,60,61,62,63,64,65,66,67],"inclusive":false},"string_doubleq":{"rules":[49,50,51,52,53,54,55,56,57],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,58,68,69],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = xpath_down;
exports.Parser = xpath_down.Parser;
exports.parse = function () { return xpath_down.parse.apply(xpath_down, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(/*! fs */ 3).readFileSync(__webpack_require__(/*! path */ 4).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "lv3P":
/*!************************************!*\
  !*** ./src/js/analyzers/xquery.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xquery = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[27,57,69,76,95,96,97,98,99,100,101,102,103,104,107,108,109,110,111,112,113,114,115,116,117,118,119],$V1=[2,49],$V2=[1,20],$V3=[1,17],$V4=[1,18],$V5=[1,14],$V6=[1,15],$V7=[1,16],$V8=[1,13],$V9=[5,74],$Va=[1,38],$Vb=[1,44],$Vc=[1,27],$Vd=[1,26],$Ve=[1,40],$Vf=[1,41],$Vg=[1,42],$Vh=[1,43],$Vi=[1,58],$Vj=[1,59],$Vk=[1,34],$Vl=[1,35],$Vm=[1,36],$Vn=[1,37],$Vo=[1,45],$Vp=[1,46],$Vq=[1,47],$Vr=[1,48],$Vs=[1,49],$Vt=[1,50],$Vu=[1,51],$Vv=[1,52],$Vw=[1,53],$Vx=[1,54],$Vy=[1,55],$Vz=[1,56],$VA=[1,57],$VB=[5,17,23,25,33,42,48,55],$VC=[1,71],$VD=[1,69],$VE=[1,73],$VF=[1,70],$VG=[5,17,20,22,23,25,27,33,35,42,48,52,53,55,57,61,65,67,69,73,74,76,77,83,84,85,86,87,88,89,90,91,92,95,96,97,98,99,100,101,102,103,104,107,108,109,110,111,112,113,114,115,116,117,118,119],$VH=[2,77],$VI=[1,87],$VJ=[5,17,20,22,23,25,27,33,35,42,48,52,53,55,57,61,65,67,69,73,74,76,77,82,83,84,85,86,87,88,89,90,91,92,95,96,97,98,99,100,101,102,103,104,107,108,109,110,111,112,113,114,115,116,117,118,119],$VK=[1,106],$VL=[1,107],$VM=[35,48,52,53,55],$VN=[1,112],$VO=[1,114],$VP=[1,122],$VQ=[1,117],$VR=[1,111],$VS=[1,113],$VT=[1,115],$VU=[1,116],$VV=[1,118],$VW=[1,119],$VX=[1,120],$VY=[1,121],$VZ=[1,123],$V_=[1,124],$V$=[5,17,20,22,23,25,33,35,42,48,52,53,55,61,65,67,73,77,83,84,85,86,87,88,89,90,91,92],$V01=[48,52,53,55],$V11=[1,152],$V21=[67,69],$V31=[1,171],$V41=[5,17,23,25,33,35,42,48,52,53,55],$V51=[5,17,20,22,23,25,33,35,42,48,52,53,55,61,65,67,73,83,84,85,90,91,92],$V61=[5,17,20,22,23,25,33,35,42,48,52,53,55,61,65,67,73,83,84,85,86,87,90,91,92],$V71=[1,202],$V81=[1,203],$V91=[20,35],$Va1=[27,31,65,67,69],$Vb1=[5,17,23,25,27,31,33,42,48,55,65,67,69],$Vc1=[1,239];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"XPATH_U":4,"EOF":5,"XQUERY":6,"INSTR_QUERY":7,"FOR_LOOP":8,"LET_CLAUSE":9,"RETURN_STATEMENT":10,"FUNCIONES":11,"LLAMADA":12,"IF_THEN_ELSE":13,"IF":14,"THEN":15,"ELSE":16,"tk_if":17,"tk_ParA":18,"E":19,"tk_ParC":20,"tk_then":21,"tk_else":22,"tk_declare":23,"tk_function":24,"tk_local":25,"tk_dospts":26,"tk_id":27,"LISTA_PARAMETROS":28,"tk_as":29,"DATATPYE":30,"tk_labre":31,"INSTR_FUNCIONES":32,"tk_lcierra":33,"tk_ptcoma":34,"tk_coma":35,"PARAMETRO":36,"VARIABLE":37,"tk_xs":38,"RESERVED_TYPES":39,"tk_interrogacion":40,"VALORES":41,"tk_for":42,"DECLARACION":43,"INSTRUCCIONES_FOR":44,"INSTR_FOR_P":45,"WHERE_CONDITION":46,"ORDER_BY":47,"tk_let":48,"tk_2puntos_igual":49,"DECLARACIONPP":50,"COMA_AUX":51,"tk_where":52,"tk_order":53,"tk_by":54,"tk_return":55,"HTML":56,"tk_dolar":57,"DECLARACIONP":58,"tk_in":59,"tk_at":60,"tk_to":61,"DOC":62,"tk_doc":63,"STRING":64,"tk_menor":65,"ATTRIBUTE_LIST":66,"tk_mayor":67,"CONTENT_LL":68,"tk_bar":69,"CONTENT_TAG":70,"XPATH":71,"tk_data":72,"tk_equal":73,"tk_line":74,"QUERY":75,"tk_2bar":76,"tk_asterisco":77,"CORCHETP":78,"EXP_PR":79,"AXIS":80,"CORCHET":81,"tk_corA":82,"tk_corC":83,"tk_menorigual":84,"tk_mayorigual":85,"tk_mas":86,"tk_menos":87,"tk_div":88,"tk_mod":89,"tk_or":90,"tk_and":91,"tk_diferent":92,"FUNC":93,"PRIMITIVO":94,"num":95,"tk_punto":96,"tk_2puntos":97,"tk_arroba":98,"tk_string_d":99,"tk_string_s":100,"tk_text":101,"tk_last":102,"tk_position":103,"tk_node":104,"AXISNAME":105,"tk_4puntos":106,"tk_ancestor":107,"tk_ancestor2":108,"tk_attribute":109,"tk_child":110,"tk_descendant":111,"tk_descendant2":112,"tk_following":113,"tk_following2":114,"tk_namespace":115,"tk_parent":116,"tk_preceding":117,"tk_preceding2":118,"tk_self":119,"tk_string":120,"tk_integer":121,"tk_decimal":122,"tk_boolean":123,"tk_normalizedString":124,"tk_token":125,"tk_date":126,"tk_dateTime":127,"tk_duration":128,"tk_time":129,"hexBinary":130,"tk_uri":131,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",17:"tk_if",18:"tk_ParA",20:"tk_ParC",21:"tk_then",22:"tk_else",23:"tk_declare",24:"tk_function",25:"tk_local",26:"tk_dospts",27:"tk_id",29:"tk_as",31:"tk_labre",33:"tk_lcierra",34:"tk_ptcoma",35:"tk_coma",38:"tk_xs",40:"tk_interrogacion",42:"tk_for",48:"tk_let",49:"tk_2puntos_igual",52:"tk_where",53:"tk_order",54:"tk_by",55:"tk_return",57:"tk_dolar",59:"tk_in",60:"tk_at",61:"tk_to",63:"tk_doc",65:"tk_menor",67:"tk_mayor",69:"tk_bar",72:"tk_data",73:"tk_equal",74:"tk_line",76:"tk_2bar",77:"tk_asterisco",82:"tk_corA",83:"tk_corC",84:"tk_menorigual",85:"tk_mayorigual",86:"tk_mas",87:"tk_menos",88:"tk_div",89:"tk_mod",90:"tk_or",91:"tk_and",92:"tk_diferent",95:"num",96:"tk_punto",97:"tk_2puntos",98:"tk_arroba",99:"tk_string_d",100:"tk_string_s",101:"tk_text",102:"tk_last",103:"tk_position",104:"tk_node",106:"tk_4puntos",107:"tk_ancestor",108:"tk_ancestor2",109:"tk_attribute",110:"tk_child",111:"tk_descendant",112:"tk_descendant2",113:"tk_following",114:"tk_following2",115:"tk_namespace",116:"tk_parent",117:"tk_preceding",118:"tk_preceding2",119:"tk_self",120:"tk_string",121:"tk_integer",122:"tk_decimal",123:"tk_boolean",124:"tk_normalizedString",125:"tk_token",126:"tk_date",127:"tk_dateTime",128:"tk_duration",129:"tk_time",130:"hexBinary",131:"tk_uri"},
productions_: [0,[3,2],[3,2],[6,2],[6,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,3],[14,4],[15,2],[16,2],[16,3],[16,2],[11,14],[28,3],[28,1],[36,3],[30,4],[32,1],[12,6],[8,4],[8,3],[44,2],[44,1],[45,1],[45,1],[45,1],[9,4],[51,3],[51,1],[46,2],[47,3],[47,3],[10,2],[10,2],[10,2],[37,2],[43,3],[43,1],[58,3],[58,5],[50,5],[50,5],[50,1],[62,4],[62,0],[41,3],[41,1],[56,9],[56,8],[56,5],[68,2],[68,1],[68,1],[70,1],[70,3],[70,6],[66,3],[66,3],[66,0],[4,3],[4,1],[71,2],[71,2],[75,2],[75,2],[75,3],[75,3],[75,1],[75,1],[81,4],[81,3],[78,1],[78,0],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,2],[19,3],[19,3],[19,3],[19,3],[19,3],[19,1],[19,4],[19,1],[79,2],[79,2],[79,2],[94,1],[94,1],[94,1],[94,1],[94,1],[94,2],[94,2],[64,1],[64,1],[93,3],[93,3],[93,3],[93,3],[80,3],[80,4],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[105,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
   prod_1 = grammar_stack.pop();
					prod_2 = grammar_stack.pop();
			 		grammar_stack.push({'ini -> XPATH_U EOF': [prod_2, prod_1]});
					// grammar_report =  getGrammarReport(grammar_stack); // cst = getCST(grammar_stack); // let arbol_ast = getASTTree($$[$0-1]);
					ast = { xpath: $$[$0-1], errors: errors, cst: "cst", grammar_report: "grammar_report",  arbolAST : "arbol_ast" }; return ast;
                
break;
case 2:
 ast = { xquery: $$[$0-1], errors: errors, cst: "cst", grammar_report: "grammar_report",  arbolAST : "arbol_ast" }; return ast; 
break;
case 3: case 26: case 55:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1]; 
break;
case 4: case 19: case 27: case 33: case 51: case 56:
 this.$=[$$[$0]]; 
break;
case 5: case 6: case 7: case 8: case 9: case 10: case 13: case 14: case 16: case 22: case 30: case 35: case 36: case 47: case 61: case 62: case 72: case 73: case 93: case 95:
 this.$=$$[$0]; 
break;
case 11:
 this.$=queryBuilder.nuevoIf_Then_Else($$[$0-2], $$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 12: case 21:
 this.$=$$[$0-1]; 
break;
case 15:
 this.$=[]; 
break;
case 17:
 this.$=queryBuilder.nuevaFuncion($$[$0-9], $$[$0-7], $$[$0-4], $$[$0-2], this._$.first_line, this._$.first_column+1); 
break;
case 18: case 32: case 41: case 50:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2]; 
break;
case 20:
 this.$=queryBuilder.nuevoParametro($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 23:
 this.$=queryBuilder.nuevaLlamada($$[$0-3], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 24:
 $$[$0-1].push($$[$0]); this.$ = queryBuilder.nuevoFor($$[$0-2], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 25:
 this.$ = queryBuilder.nuevoFor($$[$0-1], [$$[$0]], this._$.first_line, this._$.first_column+1); 
break;
case 28: case 100:
 this.$ = $$[$0]; 
break;
case 29:
 this.$ = queryBuilder.nuevoOrderBy($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 31:
 this.$ = queryBuilder.nuevoLet($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 34:
 this.$ = queryBuilder.nuevoWhere($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 37: case 38: case 39:
 this.$ = queryBuilder.nuevoReturn($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 40:
 this.$=queryBuilder.nuevaVariable("$"+$$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 42:
 this.$=[$$[$0]] 
break;
case 43:
 this.$ = queryBuilder.nuevaDeclaracion($$[$0-2], null, $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 44:
 this.$ = queryBuilder.nuevaDeclaracion($$[$0-4], $$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 45:
 this.$ = queryBuilder.nuevoIntervalo($$[$0-3], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 46:
 $$[$0-1].unshift($$[$0-3]); this.$ = queryBuilder.nuevosValores($$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 52:
 this.$ = queryBuilder.nuevoHTML($$[$0-7], $$[$0-6], $$[$0-4], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 53:
 this.$ = queryBuilder.nuevoHTML($$[$0-6], $$[$0-5], null, $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 54:
 this.$ = queryBuilder.nuevoHTML($$[$0-3], $$[$0-2], null, null, this._$.first_line, this._$.first_column+1); 
break;
case 58:
 this.$ = queryBuilder.nuevoContenido($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 59:
 this.$ = queryBuilder.nuevaInyeccion($$[$0-1], false, this._$.first_line, this._$.first_column+1); 
break;
case 60:
 this.$ = queryBuilder.nuevaInyeccion($$[$0-2], true, this._$.first_line, this._$.first_column+1); 
break;
case 63:
 this.$=null; 
break;
case 64:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2];
								 prod_1 = grammar_stack.pop();
								 prod_2 = grammar_stack.pop();
			 					 grammar_stack.push({'XPATH_U -> XPATH_U tk_line XPATH {S1.push(S3); SS = S1;}': [prod_2, 'token: tk_line\t Lexema: ' + $$[$0-2], prod_1]}); 
break;
case 65:
 this.$=[$$[$0]];
				  prod_1 = grammar_stack.pop();
			 	  grammar_stack.push({'XPATH_U -> XPATH {SS = [S1]}': [prod_1]}); 
break;
case 66:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1];
					  prod_1 = grammar_stack.pop();
					  prod_2 = grammar_stack.pop();
			 		  grammar_stack.push({'XPATH -> XPATH QUERY {S1.push(S2); SS = S1;}': [prod_2, prod_1]}); 
break;
case 67:
 this.$=[$$[$0]];
			   prod_1 = grammar_stack.pop();
			   grammar_stack.push({'XPATH -> QUERY {SS = [S1]}': [prod_1]}); 
break;
case 68:
 this.$=builder.newDoubleAxis($$[$0], this._$.first_line, this._$.first_column+1);
					   prod_1 = grammar_stack.pop();
			 		   grammar_stack.push({'QUERY -> tk_2bar QUERY SS=builder.newDoubleAxis(Param);': ['token: tk_2bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 69:
 this.$=builder.newAxis($$[$0], this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
			 		 grammar_stack.push({'QUERY -> tk_bar QUERY {SS=builder.newAxis(Param);}': ['token: tk_bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 70:

			var linea = this._$.first_line;
			var columna = this._$.first_column+1;
			this.$=builder.newAxis(builder.newExpression(builder.newValue($$[$0-1], Tipos.ASTERISCO, linea, columna), $$[$0], linea, columna), linea, columna);
		
break;
case 71:

			var linea = this._$.first_line;
			var columna = this._$.first_column+1;
			this.$=builder.newDoubleAxis(builder.newExpression(builder.newValue($$[$0-1], Tipos.ASTERISCO, linea, columna), $$[$0], linea, columna), linea, columna);
		
break;
case 74:
 $$[$0-3].push(builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)); this.$=$$[$0-3];
									 prod_1 = grammar_stack.pop();
									 prod_2 = grammar_stack.pop();
						 			 grammar_stack.push({'CORCHET -> CORCHET tk_ParA E tk_ParC {S1.push(builder.NewPredicate(Param))}': [prod_2, 'token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 75:
 this.$=[builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)];
						 prod_1 = grammar_stack.pop();
						 grammar_stack.push({'CORCHET -> tk_corA E tk_corC {SS=builder.newPredicate(Param)}': ['token: tk_corA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_corC\t Lexema: ' + $$[$0]]}); 
break;
case 76:
 this.$=$$[$0];
					prod_1 = grammar_stack.pop();
					grammar_stack.push({'CORCHETP -> CORCHET {SS=S1;}': [prod_1]}); 
break;
case 77:
 this.$=null;
			grammar_stack.push({'CORCHETP -> Empty {SS=null}': ['EMPTY'] }); 
break;
case 78:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENORIGUAL, this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
				 		prod_2 = grammar_stack.pop();
					    grammar_stack.push({'E -> E tk_menorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 79:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_menor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 80:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYORIGUAL, this._$.first_line, this._$.first_column+1);
						  prod_1 = grammar_stack.pop();
				 		  prod_2 = grammar_stack.pop();
						  grammar_stack.push({'E -> E tk_mayorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 81:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_mayor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 82:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_SUMA, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mas E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mas\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 83:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				  	 grammar_stack.push({'E -> E tk_menos E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 84:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MULTIPLICACION, this._$.first_line, this._$.first_column+1);
						 prod_1 = grammar_stack.pop();
				 		 prod_2 = grammar_stack.pop();
				  		 grammar_stack.push({'E -> E tk_asterisco E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_asterisco\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 85:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_DIVISION, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_div E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_div\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 86:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MODULO, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mod E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mod\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 87:
 this.$=builder.newOperation(builder.newValue(0, Tipos.NUMBER, _$[$0-1].first_line, _$[$0-1].first_column+1), $$[$0], Tipos.OPERACION_RESTA, this.$.first_line, this.$.first_column+1); 
								prod_1 = grammar_stack.pop();
						  		grammar_stack.push({'E -: tk_menos E': ['token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]});
break;
case 88:
 this.$=$$[$0-1];
						  prod_1 = grammar_stack.pop();
						  grammar_stack.push({'E -> tk_ParA E tk_ParC {SS=S2}': ['token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 89:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_OR, this._$.first_line, this._$.first_column+1);
				  prod_1 = grammar_stack.pop();
				  prod_2 = grammar_stack.pop();
				  grammar_stack.push({'E -> E tk_or E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_or\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 90:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_AND, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_and E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_and\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 91:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_IGUAL, this._$.first_line, this._$.first_column+1); 
					 prod_1 = grammar_stack.pop();
					 prod_2 = grammar_stack.pop();
					 grammar_stack.push({'E -> E tk_equal E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_equal\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 92:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_DIFERENTE, this._$.first_line, this._$.first_column+1); 
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'E -> E tk_diferent E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_diferent\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 94:
 $$[$0-1].push(insert_text(this._$.first_line, this._$.first_column+1)); this.$ = $$[$0-1]; 
break;
case 96:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'EXP_PR -> FUNC CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 97:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'EXP_PR -> PRIMITIVO CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 98:
 this.$=insert_current($$[$0-1].variable, $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 99:
 this.$=builder.newNodename($$[$0], this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -> tk_id {SS=builder.newNodename(Param)}':['token: tk_text\t Lexema: ' + $$[$0]]}); 
break;
case 101:
 this.$=builder.newValue(Number($$[$0]), Tipos.NUMBER, this._$.first_line, this._$.first_column+1);
				grammar_stack.push({'PRIMITIVO -> num {SS=builder.newValue(Param)}':['token: num\t Lexema: ' + $$[$0]]}); 
break;
case 102:
 this.$=builder.newCurrent($$[$0], this._$.first_line, this._$.first_column+1); 
					 grammar_stack.push({'PRIMITIVO -> tk_punto {SS=builder.newCurrent(Param)}':['token: tk_punto\t Lexema: ' + $$[$0]]}); 
break;
case 103:
 this.$=builder.newParent($$[$0], this._$.first_line, this._$.first_column+1);
					   grammar_stack.push({'PRIMITIVO -> tk_2puntos {SS=builder.newParent(Param)}':['token: tk_2puntos\t Lexema: ' + $$[$0]]}); 
break;
case 104:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1);
							grammar_stack.push({'PRIMITIVO -> tk_arroba tk_id {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_id\t Lexema: ' + $$[$0]]}); 
break;
case 105:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1); 
							 grammar_stack.push({'PRIMITIVO -> tk_arroba tk_asterisco {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_asterisco\t Lexema: ' + $$[$0]]});
break;
case 106:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1);
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_d {SS=builder.newValue(Param)}':['token: tk_attribute_d\t Lexema: ' + $$[$0]]}); 
break;
case 107:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1); 
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_s {SS=builder.newValue(Param)}':['token: tk_attribute_s\t Lexema: ' + $$[$0]]}); 
break;
case 108:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_TEXT, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_text tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_text\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 109:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_LAST, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_last tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_last\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 110:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_POSITION, this._$.first_line, this._$.first_column+1); 
									grammar_stack.push({'FUNC -> tk_position tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_position\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 111:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); 
								grammar_stack.push({'FUNC -> tk_node tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_node\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 112:
 this.$=builder.newAxisObject($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'AXIS -> AXISNAME tk_4puntos QUERY {SS=builder.newAxisObject(Param)}':[prod_2, 'token: tk_4puntos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 113:
 
		var linea = this._$.first_line;
		var columna = this._$.first_column+1;
		this.$=builder.newAxisObject($$[$0-3], builder.newExpression(builder.newValue($$[$0-1], Tipos.ASTERISCO, linea, columna), $$[$0], linea, columna), linea, columna);
	
break;
case 114:
 this.$ = Tipos.AXIS_ANCESTOR;
						grammar_stack.push({'AXISNAME -> tk_ancestor {SS = Tipos.AxisTipo}':['token: tk_ancestor\t Lexema: ' + $$[$0]]}); 
break;
case 115:
 this.$ = Tipos.AXIS_ANCESTOR_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_ancestor2 {SS = Tipos.AxisTipo}':['token: tk_ancestor2\t Lexema: ' + $$[$0]]}); 
break;
case 116:
 this.$ = Tipos.AXIS_ATTRIBUTE;
						grammar_stack.push({'AXISNAME -> tk_attribute {SS = Tipos.AxisTipo}':['token: tk_attribute\t Lexema: ' + $$[$0]]}); 
break;
case 117:
 this.$ = Tipos.AXIS_CHILD;
						grammar_stack.push({'AXISNAME -> tk_child {SS = Tipos.AxisTipo}':['token: tk_child\t Lexema: ' + $$[$0]]}); 
break;
case 118:
 this.$ = Tipos.AXIS_DESCENDANT;
						grammar_stack.push({'AXISNAME -> tk_descendant {SS = Tipos.AxisTipo}':['token: tk_descendant\t Lexema: ' + $$[$0]]}); 
break;
case 119:
 this.$ = Tipos.AXIS_DESCENDANT_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_descendant2 {SS = Tipos.AxisTipo}':['token: tk_descendant2\t Lexema: ' + $$[$0]]}); 
break;
case 120:
 this.$ = Tipos.AXIS_FOLLOWING;
						grammar_stack.push({'AXISNAME -> tk_following {SS = Tipos.AxisTipo}':['token: tk_following\t Lexema: ' + $$[$0]]}); 
break;
case 121:
 this.$ = Tipos.AXIS_FOLLOWING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_following2 {SS = Tipos.AxisTipo}':['token: tk_follownig2\t Lexema: ' + $$[$0]]}); 
break;
case 122:
 this.$ = Tipos.AXIS_NAMESPACE;
						grammar_stack.push({'AXISNAME -> tk_namespace {SS = Tipos.AxisTipo}':['token: tk_namespace\t Lexema: ' + $$[$0]]}); 
break;
case 123:
 this.$ = Tipos.AXIS_PARENT;
						grammar_stack.push({'AXISNAME -> tk_parent {SS = Tipos.AxisTipo}':['token: tk_parent\t Lexema: ' + $$[$0]]}); 
break;
case 124:
 this.$ = Tipos.AXIS_PRECEDING;
						grammar_stack.push({'AXISNAME -> tk_preceding {SS = Tipos.AxisTipo}':['token: tk_preceding\t Lexema: ' + $$[$0]]}); 
break;
case 125:
 this.$ = Tipos.AXIS_PRECEDING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_preceding2 {SS = Tipos.AxisTipo}':['token: tk_preceding2\t Lexema: ' + $$[$0]]}); 
break;
case 126:
 this.$ = Tipos.AXIS_SELF;
						grammar_stack.push({'AXISNAME -> tk_self {SS = Tipos.AxisTipo}':['token: tk_self\t Lexema: ' + $$[$0]]}); 
break;
case 127: case 131: case 132: case 133: case 134: case 135: case 136: case 137: case 138:
 this.$ = Tipos.TIPADO_STRING; 
break;
case 128:
 this.$ = Tipos.TIPADO_INTEGER; 
break;
case 129:
 this.$ = Tipos.TIPADO_DECIMAL; 
break;
case 130:
 this.$ = Tipos.TIPADO_BOOLEANO; 
break;
}
},
table: [o($V0,$V1,{3:1,4:2,6:3,71:4,7:5,62:6,8:7,9:8,10:9,11:10,12:11,13:12,14:19,17:$V2,23:$V3,25:$V4,42:$V5,48:$V6,55:$V7,63:$V8}),{1:[3]},{5:[1,21],74:[1,22]},{5:[1,23],7:24,8:7,9:8,10:9,11:10,12:11,13:12,14:19,17:$V2,23:$V3,25:$V4,42:$V5,48:$V6,55:$V7},o($V9,[2,65],{75:25,79:28,80:29,93:30,94:31,37:32,105:33,64:39,27:$Va,57:$Vb,69:$Vc,76:$Vd,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA}),o($VB,[2,4]),{27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:60,76:$Vd,79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},o($VB,[2,5]),o($VB,[2,6]),o($VB,[2,7]),o($VB,[2,8]),o($VB,[2,9]),o($VB,[2,10]),{18:[1,61]},{37:64,43:62,57:$Vb,58:63},{37:65,57:$Vb},o($V0,$V1,{62:6,14:19,56:66,19:67,13:68,71:72,12:74,17:$V2,18:$VC,25:$V4,63:$V8,65:$VD,72:$VE,87:$VF}),{24:[1,75]},{26:[1,76]},{15:77,21:[1,78]},{18:[1,79]},{1:[2,1]},o($V0,$V1,{62:6,71:80,63:$V8}),{1:[2,2]},o($VB,[2,3]),o($VG,[2,66]),{27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:81,76:$Vd,77:[1,82],79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},{27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:83,76:$Vd,77:[1,84],79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},o($VG,[2,72]),o($VG,[2,73]),o($VG,$VH,{78:85,81:86,82:$VI}),o($VG,$VH,{81:86,78:88,82:$VI}),o($VG,$VH,{81:86,78:89,82:$VI}),{106:[1,90]},{18:[1,91]},{18:[1,92]},{18:[1,93]},{18:[1,94]},o($VJ,[2,99]),o($VJ,[2,100]),o($VJ,[2,101]),o($VJ,[2,102]),o($VJ,[2,103]),{27:[1,95],77:[1,96]},{27:[1,97]},{106:[2,114]},{106:[2,115]},{106:[2,116]},{106:[2,117]},{106:[2,118]},{106:[2,119]},{106:[2,120]},{106:[2,121]},{106:[2,122]},{106:[2,123]},{106:[2,124]},{106:[2,125]},{106:[2,126]},o($VJ,[2,106]),o($VJ,[2,107]),o($VG,[2,67]),{64:98,99:$Vi,100:$Vj},{9:105,10:100,35:[1,101],44:99,45:102,46:103,47:104,48:$V6,52:$VK,53:$VL,55:$V7},o($VM,[2,42]),{59:[1,108],60:[1,109]},{49:[1,110]},o($VB,[2,37]),o($VB,[2,38],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($VB,[2,39]),{27:$V_},o($V0,$V1,{62:6,71:72,12:74,19:125,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:126,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V$,[2,93],{75:25,79:28,80:29,93:30,94:31,37:32,105:33,64:39,27:$Va,57:$Vb,69:$Vc,76:$Vd,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA}),{18:[1,127]},o($V$,[2,95]),{25:[1,128]},{27:[1,129]},{16:130,22:[1,131]},o($V0,$V1,{62:6,71:72,12:74,19:132,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:133,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V9,[2,64],{75:25,79:28,80:29,93:30,94:31,37:32,105:33,64:39,27:$Va,57:$Vb,69:$Vc,76:$Vd,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA}),o($VG,[2,68]),o($VG,$VH,{81:86,78:134,82:$VI}),o($VG,[2,69]),o($VG,$VH,{81:86,78:135,82:$VI}),o($VG,[2,96]),o($VG,[2,76],{82:[1,136]}),o($V0,$V1,{62:6,71:72,12:74,19:137,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($VG,[2,97]),o($VG,[2,98]),{27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:138,76:$Vd,77:[1,139],79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},{20:[1,140]},{20:[1,141]},{20:[1,142]},{20:[1,143]},o($VJ,[2,104]),o($VJ,[2,105]),o([5,17,20,22,23,25,27,29,33,35,42,48,49,52,53,55,57,59,60,61,65,67,69,73,74,76,77,82,83,84,85,86,87,88,89,90,91,92,95,96,97,98,99,100,101,102,103,104,107,108,109,110,111,112,113,114,115,116,117,118,119],[2,40]),{20:[1,144]},{9:105,10:145,45:146,46:103,47:104,48:$V6,52:$VK,53:$VL,55:$V7},o($VB,[2,25]),{37:64,57:$Vb,58:147},o($V01,[2,27]),o($V01,[2,28]),o($V01,[2,29],{35:[1,148]}),o($V01,[2,30]),o($V0,$V1,{62:6,71:72,12:74,19:149,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),{54:[1,150]},o($V0,$V1,{62:6,71:72,12:74,50:151,19:153,18:$V11,25:$V4,63:$V8,72:$VE,87:$VF}),{37:154,57:$Vb},o($V0,$V1,{62:6,71:72,12:74,19:153,50:155,18:$V11,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:156,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:157,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:158,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:159,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:160,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:161,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:162,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:163,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:164,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:165,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:166,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:167,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,19:168,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V21,[2,63],{66:169,27:[1,170]}),o($V$,[2,87]),{20:$V31,65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},o($V0,$V1,{62:6,71:172,63:$V8}),{26:[1,173]},{18:[1,174]},o($VB,[2,11]),o($V0,$V1,{62:6,14:19,71:72,12:74,19:175,13:177,17:$V2,18:[1,176],25:$V4,63:$V8,72:$VE,87:$VF}),{22:[2,13],65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},{20:[1,178],65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},o($VG,[2,71]),o($VG,[2,70]),o($V0,$V1,{62:6,71:72,12:74,19:179,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),{65:$VN,67:$VO,73:$VP,77:$VQ,83:[1,180],84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},o($VG,[2,112]),o($VG,$VH,{81:86,78:181,82:$VI}),o($VJ,[2,108]),o($VJ,[2,109]),o($VJ,[2,110]),o($VJ,[2,111]),o($V0,[2,48]),o($VB,[2,24]),o($V01,[2,26]),o($VM,[2,41]),o($V0,$V1,{62:6,71:72,12:74,19:182,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V01,[2,34],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($V0,$V1,{62:6,71:72,12:74,19:183,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($VM,[2,43]),o($V0,$V1,{62:6,71:72,12:74,19:184,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V41,[2,47],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),{59:[1,185]},o([5,17,23,25,33,42,48,52,53,55],[2,31]),o($V51,[2,78],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),o($V51,[2,79],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),o($V51,[2,80],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),o($V51,[2,81],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),o($V61,[2,82],{77:$VQ,88:$VV,89:$VW}),o($V61,[2,83],{77:$VQ,88:$VV,89:$VW}),o($V$,[2,84]),o($V$,[2,85]),o($V$,[2,86]),o([5,17,20,22,23,25,33,35,42,48,52,53,55,61,83,90],[2,89],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,91:$VY,92:$VZ}),o([5,17,20,22,23,25,33,35,42,48,52,53,55,61,83,90,91],[2,90],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,92:$VZ}),o($V51,[2,91],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),o($V51,[2,92],{77:$VQ,86:$VT,87:$VU,88:$VV,89:$VW}),{67:[1,186],69:[1,187]},{73:[1,188]},o($V$,[2,88]),{20:[1,189],27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:25,76:$Vd,79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},{27:[1,190]},o($V0,$V1,{62:6,71:72,12:74,41:191,19:192,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($VB,[2,14],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($V0,$V1,{62:6,71:72,12:74,19:126,18:$VC,20:[1,193],25:$V4,63:$V8,72:$VE,87:$VF}),o($VB,[2,16]),{21:[2,12]},{65:$VN,67:$VO,73:$VP,77:$VQ,83:[1,194],84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},o($VJ,[2,75]),o($VG,[2,113]),o($VM,[2,35],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($VM,[2,36],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),{20:$V31,35:[1,196],61:[1,195],65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},o($V0,$V1,{62:6,71:72,12:74,19:153,50:197,18:$V11,25:$V4,63:$V8,72:$VE,87:$VF}),{27:$V71,31:$V81,56:201,65:[1,199],68:198,70:200},{67:[1,204]},{27:$V71,31:$V81,56:201,64:205,65:$VD,68:206,70:200,99:$Vi,100:$Vj},o($V$,[2,94]),{18:[1,207]},{20:[1,208],35:[1,209]},o($V91,[2,51],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($VB,[2,15]),o($VJ,[2,74]),o($V0,$V1,{62:6,71:72,12:74,19:210,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($V0,$V1,{62:6,71:72,12:74,51:211,19:212,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),o($VM,[2,44]),{27:$V71,31:$V81,65:[1,213],70:214},{27:$V_,69:[1,215]},o($Va1,[2,56]),o($Va1,[2,57]),o($Va1,[2,58]),o($V0,$V1,{62:6,71:216,63:$V8,72:[1,217]}),o($Vb1,[2,54]),o($V21,[2,61]),o($V21,[2,62],{70:214,27:$V71,31:$V81}),{28:218,36:219,37:220,57:$Vb},o($V$,[2,23]),o($V0,$V1,{62:6,71:72,12:74,19:221,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),{20:[1,222],65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ},{20:[1,223],35:[1,224]},o($V91,[2,33],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),{69:[1,225]},o($Va1,[2,55]),{27:[1,226]},{27:$Va,33:[1,227],37:32,57:$Vb,64:39,69:$Vc,75:25,76:$Vd,79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},{18:[1,228]},{20:[1,229],35:[1,230]},o($V91,[2,19]),{29:[1,231]},o($V91,[2,50],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),o($V41,[2,45]),o($V41,[2,46]),o($V0,$V1,{62:6,71:72,12:74,19:232,18:$VC,25:$V4,63:$V8,72:$VE,87:$VF}),{27:[1,233]},{67:[1,234]},o($Va1,[2,59]),o($V0,$V1,{62:6,71:235,63:$V8}),{29:[1,236]},{36:237,37:220,57:$Vb},{30:238,38:$Vc1},o($V91,[2,32],{65:$VN,67:$VO,73:$VP,77:$VQ,84:$VR,85:$VS,86:$VT,87:$VU,88:$VV,89:$VW,90:$VX,91:$VY,92:$VZ}),{67:[1,240]},o($Vb1,[2,53]),{20:[1,241],27:$Va,37:32,57:$Vb,64:39,69:$Vc,75:25,76:$Vd,79:28,80:29,93:30,94:31,95:$Ve,96:$Vf,97:$Vg,98:$Vh,99:$Vi,100:$Vj,101:$Vk,102:$Vl,103:$Vm,104:$Vn,105:33,107:$Vo,108:$Vp,109:$Vq,110:$Vr,111:$Vs,112:$Vt,113:$Vu,114:$Vv,115:$Vw,116:$Vx,117:$Vy,118:$Vz,119:$VA},{30:242,38:$Vc1},o($V91,[2,18]),o($V91,[2,20]),{26:[1,243]},o($Vb1,[2,52]),{33:[1,244]},{31:[1,245]},{39:246,120:[1,247],121:[1,248],122:[1,249],123:[1,250],124:[1,251],125:[1,252],126:[1,253],127:[1,254],128:[1,255],129:[1,256],130:[1,257],131:[1,258]},o($Va1,[2,60]),{6:260,7:5,8:7,9:8,10:9,11:10,12:11,13:12,14:19,17:$V2,23:$V3,25:$V4,32:259,42:$V5,48:$V6,55:$V7},{40:[1,261]},{40:[2,127]},{40:[2,128]},{40:[2,129]},{40:[2,130]},{40:[2,131]},{40:[2,132]},{40:[2,133]},{40:[2,134]},{40:[2,135]},{40:[2,136]},{40:[2,137]},{40:[2,138]},{33:[1,262]},{7:24,8:7,9:8,10:9,11:10,12:11,13:12,14:19,17:$V2,23:$V3,25:$V4,33:[2,22],42:$V5,48:$V6,55:$V7},o([20,31,35],[2,21]),{34:[1,263]},o($VB,[2,17])],
defaultActions: {21:[2,1],23:[2,2],45:[2,114],46:[2,115],47:[2,116],48:[2,117],49:[2,118],50:[2,119],51:[2,120],52:[2,121],53:[2,122],54:[2,123],55:[2,124],56:[2,125],57:[2,126],178:[2,12],247:[2,127],248:[2,128],249:[2,129],250:[2,130],251:[2,131],252:[2,132],253:[2,133],254:[2,134],255:[2,135],256:[2,136],257:[2,137],258:[2,138]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

var attribute = '';
var errors = [];
let grammar_stack = [];
let re = /[^\n\t\r ]+/g

	const { Objeto } = __webpack_require__(/*! ../model/xpath/Objeto */ "YKiq");
	const { Tipos } = __webpack_require__(/*! ../model/xpath/Enum */ "MEUw");
    const { XQObjeto } = __webpack_require__(/*! ../model/xquery/XQObjeto */ "WHhi");
    var builder = new Objeto();
    var queryBuilder = new XQObjeto();
    // const getASTTree = require('./ast_xpath');

	function insert_current(_variable, _predicate, _linea, _columna) {
		return builder.newAxis(builder.newExpression(builder.newCurrent(_variable, _linea, _columna), _predicate, _linea, _columna), _linea, _columna);
	}
	function insert_text(_linea, _columna) {
		return builder.newDoubleAxis(builder.newExpression(builder.newValue("text()", Tipos.FUNCION_TEXT, _linea, _columna), null, _linea, _columna), _linea, _columna);
	}
	function insert_let_values(_id, _valores, _linea, _columna) {
		return queryBuilder.nuevoLet(_id, queryBuilder.nuevosValores(_valores, _linea, _columna), _linea, _columna);
	}
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Whitespace
break;
case 1:// XQUERYComment
break;
case 2:// MultiLineComment
break;
case 3:return 95
break;
case 4:return 48
break;
case 5:return 84
break;
case 6:return 85
break;
case 7:return 65
break;
case 8:return 67
break;
case 9:return 76
break;
case 10:return 69
break;
case 11:return 49
break;
case 12:return 73
break;
case 13:return 97
break;
case 14:return 96
break;
case 15:return 106
break;
case 16:return 98
break;
case 17:return 57
break;
case 18:return 82
break;
case 19:return 83
break;
case 20:return 18
break;
case 21:return 20
break;
case 22:return 31
break;
case 23:return 33
break;
case 24:return 77
break;
case 25:return 88
break;
case 26:return 108
break;
case 27:return 107
break;
case 28:return 109
break;
case 29:return 110
break;
case 30:return 112
break;
case 31:return 111
break;
case 32:return 114
break;
case 33:return 113
break;
case 34:return 115
break;
case 35:return 116
break;
case 36:return 118
break;
case 37:return 117
break;
case 38:return 119
break;
case 39:return 104
break;
case 40:return 102
break;
case 41:return 101
break;
case 42:return 103
break;
case 43:return 74
break;
case 44:return 86
break;
case 45:return 87
break;
case 46:return 92
break;
case 47:return 90
break;
case 48:return 91
break;
case 49:return 89
break;
case 50:return 63
break;
case 51:return 42
break;
case 52:return 60
break;
case 53:return 59
break;
case 54:return 52
break;
case 55:return 53
break;
case 56:return 54
break;
case 57:return 55
break;
case 58:return 61
break;
case 59:return 35
break;
case 60:return 72
break;
case 61:return 17
break;
case 62:return 21
break;
case 63:return 22
break;
case 64:return 23
break;
case 65:return 24
break;
case 66:return 25
break;
case 67:return 29
break;
case 68:return 38
break;
case 69:return 26
break;
case 70:return 34
break;
case 71:return 40
break;
case 72:return 120
break;
case 73:return 124
break;
case 74:return 125
break;
case 75:return 126
break;
case 76:return 127
break;
case 77:return 128
break;
case 78:return 129
break;
case 79:return 121
break;
case 80:return 122
break;
case 81:return 123
break;
case 82:return 'tk_true'
break;
case 83:return 'tk_false'
break;
case 84:return 130
break;
case 85:return 131
break;
case 86: attribute = ''; this.begin("string_doubleq"); 
break;
case 87: attribute += yy_.yytext; 
break;
case 88: attribute += "\""; 
break;
case 89: attribute += "\n"; 
break;
case 90: attribute += " ";  
break;
case 91: attribute += "\t"; 
break;
case 92: attribute += "\\"; 
break;
case 93: attribute += "\'"; 
break;
case 94: attribute += "\r"; 
break;
case 95: yy_.yytext = attribute; this.popState(); return 99; 
break;
case 96: attribute = ''; this.begin("string_singleq"); 
break;
case 97: attribute += yy_.yytext; 
break;
case 98: attribute += "\""; 
break;
case 99: attribute += "\n"; 
break;
case 100: attribute += " ";  
break;
case 101: attribute += "\t"; 
break;
case 102: attribute += "\\"; 
break;
case 103: attribute += "\'"; 
break;
case 104: attribute += "\r"; 
break;
case 105: yy_.yytext = attribute; this.popState(); return 100; 
break;
case 106:return 27
break;
case 107:return 5
break;
case 108: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XQuery", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:\(:[\s\S\n]*?:\))/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:let\b)/i,/^(?:(<=|le))/i,/^(?:(>=|ge))/i,/^(?:(<|lt))/i,/^(?:(>|gt))/i,/^(?:\/\/)/i,/^(?:\/)/i,/^(?::=)/i,/^(?:(=|eq))/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:::)/i,/^(?:@)/i,/^(?:\$)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\()/i,/^(?:\))/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\*)/i,/^(?:div\b)/i,/^(?:ancestor-or-self\b)/i,/^(?:ancestor\b)/i,/^(?:attribute\b)/i,/^(?:child\b)/i,/^(?:descendant-or-self\b)/i,/^(?:descendant\b)/i,/^(?:following-sibling\b)/i,/^(?:following\b)/i,/^(?:namespace\b)/i,/^(?:parent\b)/i,/^(?:preceding-sibling\b)/i,/^(?:preceding\b)/i,/^(?:self\b)/i,/^(?:node\b)/i,/^(?:last\b)/i,/^(?:text\b)/i,/^(?:position\b)/i,/^(?:\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:(!=|ne))/i,/^(?:or\b)/i,/^(?:and\b)/i,/^(?:mod\b)/i,/^(?:doc\b)/i,/^(?:for\b)/i,/^(?:at\b)/i,/^(?:in\b)/i,/^(?:where\b)/i,/^(?:order\b)/i,/^(?:by\b)/i,/^(?:return\b)/i,/^(?:to\b)/i,/^(?:,)/i,/^(?:data\b)/i,/^(?:if\b)/i,/^(?:then\b)/i,/^(?:else\b)/i,/^(?:declare\b)/i,/^(?:function\b)/i,/^(?:local\b)/i,/^(?:as\b)/i,/^(?:xs\b)/i,/^(?::)/i,/^(?:;)/i,/^(?:\?)/i,/^(?:string\b)/i,/^(?:normalizedString\b)/i,/^(?:token\b)/i,/^(?:date\b)/i,/^(?:dateTime\b)/i,/^(?:duration\b)/i,/^(?:time\b)/i,/^(?:integer\b)/i,/^(?:decimal\b)/i,/^(?:boolean\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:hexBinary\b)/i,/^(?:anyURI\b)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"content":{"rules":[],"inclusive":false},"string_singleq":{"rules":[97,98,99,100,101,102,103,104,105],"inclusive":false},"string_doubleq":{"rules":[87,88,89,90,91,92,93,94,95],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,96,106,107,108],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = xquery;
exports.Parser = xquery.Parser;
exports.parse = function () { return xquery.parse.apply(xquery, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(/*! fs */ 3).readFileSync(__webpack_require__(/*! path */ 4).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "mo2C":
/*!*********************************************!*\
  !*** ./src/js/controller/xquery/OrderBy.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(__webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf"));
function OrderBy(_instruccion, _ambito, _iterators) {
    var _a;
    let sorted = [];
    try {
        for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
            const iterator = _iterators[i]; // { Contexto }
            let _x = Expresion_1.default(_instruccion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _instruccion = [comparissons]
            if (_x)
                sorted.push(sortIterators(_x, iterator));
        }
    }
    catch (error) {
        console.log(error);
    }
    return sorted;
}
function sortIterators(_contexto, _root) {
    let array = _contexto.removeDadDuplicates();
    let swapped = true;
    do {
        swapped = false;
        for (let j = 0; j < array.length; j++) {
            if (array[j + 1])
                if (array[j].value.charCodeAt(0) > array[j + 1].value.charCodeAt(0)) { // Compara valor inicial de ASCII
                    let temp = array[j];
                    let tmp = _root.elementos[j];
                    array[j] = array[j + 1];
                    _root.elementos[j] = _root.elementos[j + 1];
                    array[j + 1] = temp;
                    _root.elementos[j + 1] = tmp;
                    swapped = true;
                }
        }
    } while (swapped);
    return _root;
}
module.exports = OrderBy;


/***/ }),

/***/ "nxic":
/*!************************************!*\
  !*** ./src/js/analyzers/xml_up.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var xml_up = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,12],$V2=[1,18],$V3=[1,16],$V4=[1,17],$V5=[2,13],$V6=[2,6,23],$V7=[2,21,22,23],$V8=[2,6,21,23],$V9=[1,34],$Va=[1,35],$Vb=[1,36],$Vc=[1,37],$Vd=[2,21,23],$Ve=[2,11,12,14,16,17,18,21,22,23,24];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INI":3,"XML_DECLARATION":4,"ROOT":5,"EOF":6,"XML":7,"tk_open_declaration":8,"ATTRIBUTE_LIST":9,"XML_CLOSE_DECLARATION":10,"tk_close_delcaraton":11,"tk_close":12,"ATTRIBUTE":13,"tk_attribute_name":14,"tk_string":15,"tk_equal":16,"tk_tag_name":17,"cadena_err":18,"XML_OPEN":19,"CHILDREN":20,"tk_open_end_tag":21,"tk_content":22,"tk_open":23,"tk_bar":24,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",8:"tk_open_declaration",11:"tk_close_delcaraton",12:"tk_close",14:"tk_attribute_name",15:"tk_string",16:"tk_equal",17:"tk_tag_name",18:"cadena_err",21:"tk_open_end_tag",22:"tk_content",23:"tk_open",24:"tk_bar"},
productions_: [0,[3,3],[3,2],[3,2],[3,1],[3,2],[5,2],[5,1],[4,3],[10,1],[10,1],[10,2],[9,2],[9,0],[13,2],[13,1],[13,2],[13,1],[13,2],[13,1],[7,5],[7,5],[7,5],[7,4],[7,3],[7,3],[7,4],[7,4],[7,6],[7,4],[7,4],[7,4],[7,3],[7,3],[7,2],[19,4],[19,3],[19,1],[19,2],[20,2],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
/*$$[$0-2][0].printTest(0);console.log($$[$0-2][0].getTree());*/
                                            prod_1 = grammar_stack.pop();
                                            prod_2 = grammar_stack.pop();
                                            grammar_stack.push({'INI-> XML_DECLARATION ROOT EOF {﹩ = [﹩1, ﹩2]}': [prod_2, prod_1, 'EOF' ]});
                                            //printstrack(grammar_stack, 0); //TODO: Delete is just for testing purposes
                                            grammar_report =  getGrammarReport(grammar_stack);
                                            cst = getCST(grammar_stack);

                                            if($$[$0-2]!= null){
                                                encoding = new Encoding($$[$0-2]);
                                                ast = { ast: $$[$0-1], encoding: encoding, errors: errors, cst: cst, grammar_report: grammar_report};
                                            } else{
                                                errors.push({ tipo: "Sintáctico", error: "La codificación del XML no es válida.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 });
                                                ast = { ast: $$[$0-1], encoding: null,  errors: errors, cst: cst, grammar_report: grammar_report};
                                            }
                                            errors = [];
                                            return ast;
                                            
break;
case 2:

                                            prod_1 = grammar_stack.pop();
                                            grammar_stack.push({'INI -> XML_DECLARATION  EOF {	errors.add(new Error()); ﹩﹩ = null;}': [prod_1, 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);
                                            encoding = new Encoding($$[$0-1]);
                                            ast = { ast: null, encoding: encoding,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 3:

                                            prod_1 = grammar_stack.pop();
                                            grammar_stack.push({'INI -> ROOT EOF {	errors.add(new Error()); ﹩﹩ = null;}': [prod_1, 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);

                                            errors.push({ tipo: "Sintáctico", error: "Falta declaración del XML", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 4:

                                            grammar_stack.push({'INI -> EOF {	errors.add(new Error()); ﹩﹩ = null;}': [ 'EOF']});
                                            grammar_report =  getGrammarReport(grammar_stack);
                                            errors.push({ tipo: "Sintáctico", error: "El archivo viene vacío.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

	                                        ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report }
	                                        errors = [];
	                                        return ast;
	                                        
break;
case 5:

	                                        grammar_stack.push({'INI -> error EOF {	errors.add(new Error()); ﹩﹩ = null;}': ['Token: error\t Lexema: ', 'EOF' ]});
                                            grammar_report =  getGrammarReport(grammar_stack);

                                            errors.push({ tipo: "Sintáctico", error: "Token no esperado.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            ast = { ast: null, encoding: null,  errors: errors, cst: null, grammar_report: grammar_report };
                                            errors = [];
                                            return ast;
                                            
break;
case 6:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
                                                prod_1 = grammar_stack.pop();
                                                prod_2 = grammar_stack.pop();
                                                grammar_stack.push({'ROOT -> ROOT XML {﹩﹩ = ﹩1.push(₤2);}': [prod_2, prod_1 ]});
                                                
break;
case 7:
this.$ = [$$[$0]];
	                                            prod_1 = grammar_stack.pop();
	                                            grammar_stack.push({'ROOT -> XML{﹩﹩ = []; ﹩﹩.push($$[$0]);}': [prod_1 ]});
	                                            
break;
case 8:
if($$[$0-1] == null || $$[$0] == null){
                                                                            this.$ = null}else{
                                                                            let str = "";
                                                                           $$[$0-1].forEach((value)=>{
                                                                           str = str + value.id+value.value;
                                                                           });
                                                                           this.$=str;
                                                                           }

                                                                           prod_3 = grammar_stack.pop();
                                                                           prod_2 = grammar_stack.pop();
                                                                           grammar_stack.push({'XML_DECLARATION -> tk_open_declaration ATTRIBUTE_LIST XML_CLOSE_DECLARATION {﹩﹩ = ﹩2}': ['Token: tk_open_declaration\t Lexema: ' + '&lt;?', prod_2, prod_3]} );
                                                                           
break;
case 9:
  this.$ = "?>"
                                                grammar_stack.push({'XML_CLOSE_DECLARATION -> tk_close_delcaraton { ﹩﹩= ﹩1}': ['Token: tk_close_delcaraton\t Lexema: ' + '?&gt;']});
                                                
break;
case 10:
this.$ = null;
                                                 errors.push({ tipo: "Sintáctico", error: "Se esperaba token /", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                grammar_stack.push({'XML_CLOSE_DECLARATION -> tk_close {errors.add(new Error()); ﹩﹩ = null;}': ['Token: tk_close\t Lexema: ' + '&gt;']});
                                                
break;
case 11:
 this.$ = null;
                                                 errors.push({ tipo: "Sintáctico", error: "Token no esperado. " + $$[$0-1], origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                 grammar_stack.push({'XML_CLOSE_DECLARATION -> error tk_close {	errors.add(new Error()); ﹩﹩ = null;}': ['Token: error\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                 
break;
case 12:
if($$[$0] == null){this.$ = null}else if($$[$0-1] == null){this.$ = [$$[$0]]}else{$$[$0-1].push($$[$0]); this.$ = $$[$0-1]}
                                            prod_1 = grammar_stack.pop();
                                            prod_2 = grammar_stack.pop();
                                            grammar_stack.push({'ATTRIBUTE_LIST -> ATTRIBUTE_LIST ATTRIBUTE {if(﹩1 == null){﹩﹩=[]; ﹩﹩.push(﹩2)}else{﹩1.push(﹩2)}}': [ prod_2, prod_1 ] });
                                          
break;
case 13:
this.$ = null;             grammar_stack.push({'ATTRIBUTE_LIST -> Empty {﹩﹩ = null}': ['EMPTY'] });      
break;
case 14:
attr = new Atributo($$[$0-1].slice(0, -1), $$[$0].slice(1,-1), this._$.first_line, this._$.first_column+1);
                                            attr.Cst= `<li><a href=''>ATTRIBUTE</a>
                                            <ul>
                                            <li><a href=''>tk_attribute_name</a><ul>\n<li><a href=''>${$$[$0-1]}</a></li></ul></li>
                                            <li><a href=''>tk_string</a><ul>\n<li><a href=''>${$$[$0]}</a></li></ul></li>
                                            </ul>
                                            </li>`;
                                            this.$ = attr;
                                            grammar_stack.push({'ATTRIBUTE -> tk_attribute_name tk_string {	﹩﹩ = new Attribute(﹩1, ﹩2)}': ['Token: tk_attribute_name\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0] ]});
                                            
break;
case 15:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un atributo despues de =.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_attribute_name {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_attribute_name\t Lexema: ' + $$[$0]]});
                                            
break;
case 16:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un nombre para atributo antes de =.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_equal tk_string {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_equal\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0]]});
                                            
break;
case 17:
 this.$ = null;
                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba signo =", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> tk_tag_name {	errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_tag_name\t Lexema: ' + $$[$0]]});
                                            
break;
case 18:
 this.$ = null;
                                            errors.push({ tipo: "Lexico", error: "Nombre del atributo no puede empezar con dígitos.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> cadena_err tk_string {errors.add(new Error()); ﹩﹩ = null;}':['Token: cadena_err\t Lexema: ' + $$[$0-1], 'Token: tk_string\t Lexema: ' + $$[$0]]});
                                            
break;
case 19:
 this.$ = null;
                                            errors.push({ tipo: "Lexico", error: "Nombre del atributo no puede empezar con dígitos, y debe tener signo = y atributo a continuación.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                            grammar_stack.push({'ATTRIBUTE -> cadena_err {	errors.add(new Error()); ﹩﹩ = null;}':['Token: cadena_err\t Lexema: ' + $$[$0]]});
                                            
break;
case 20:
if($$[$0-4] != null){  $$[$0-4].Children = $$[$0-3]; $$[$0-4].Close = $$[$0-1]; this.$ = $$[$0-4];
                                                                                let hasConflict = $$[$0-4].verificateNames();
                                                                                if(hasConflict === "") {
                                                                                    if($$[$0-4].childs){
                                                                                        $$[$0-4].childs.forEach(child => {
                                                                                        child.Father = {id: $$[$0-4].id_open, line: $$[$0-4].line, column: $$[$0-4].column};
                                                                                        });
                                                                                        this.$ = $$[$0-4];
                                                                                    }
																				}
                                                                                 else {
																					errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                                                    this.$ = null;
																				 }
                                                                                } else{this.$ = null;}
                                                                                 prod_1 = grammar_stack.pop();
                                                                                 prod_2 = grammar_stack.pop();
                                                                                 grammar_stack.push({'XML-> XML_OPEN CHILDREN tk_open_end_tag tk_tag_name tk_close {﹩﹩ = ﹩1; ﹩1.children = ﹩2}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                                                 
break;
case 21:
if($$[$0-4] != null){$$[$0-4].Value = $$[$0-3]; $$[$0-4].Close = $$[$0-1];  this.$ = $$[$0-4];
                                                                                let hasConflict = $$[$0-4].verificateNames();
                                                                                if(hasConflict !== ""){
                                                                                 errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                                                 this.$ = null;
                                                                                 }
	                                                                             }else{this.$ = null;}
	                                                                             prod_1 = grammar_stack.pop();
	                                                                             grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag tk_tag_name tk_close {﹩﹩ = ﹩1; ﹩﹩.content = ﹩2}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-3], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                             
break;
case 22:
this.$ = new Element($$[$0-3], $$[$0-2], null, null, _$[$0-4].first_line, _$[$0-4].first_column+1, null);

                                                                                prod_1 = grammar_stack.pop();
                                                                                grammar_stack.push({'XML -> tk_open tk_tag_name ATTRIBUTE_LIST tk_bar tk_close {﹩﹩ = new Element(); ﹩﹩.attributes = ﹩3}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-3], prod_1, 'Token: tk_bar\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 23:
if($$[$0-3] != null){$$[$0-3].Close = $$[$0-1]; this.$ = $$[$0-3];
	                                                                            let hasConflict = $$[$0-3].verificateNames();
	                                                                             if(hasConflict !== ""){
                                                                                errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                                                this.$ = null;

                                                                                prod_1 = grammar_stack.pop();
                                                                                }
	                                                                            }else{this.$ = null;}
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag tk_tag_name tk_close {	﹩﹩ = ﹩1;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: '  + '&gt;']});
	                                                                            
break;
case 24:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Falta etiqueta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: '  + $$[$0]]});
	                                                                            
break;
case 25:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador. ", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 26:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Falta etiqueta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
	                                                                            
break;
case 27:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador. ", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                grammar_stack.push({'XML -> XML_OPEN tk_content tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_1, 'Token: tk_content\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: ' + $$[$0]  ]});
                                                                            	
break;
case 28:
this.$ =null;
                                                                                errors.push({ tipo: "Sintáctico", error: "Se esperaba etiqueta de cierre. ", origen: "XML", linea: _$[$0-4].first_line, columna: _$[$0-4].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN tk_content  tk_open tk_tag_name ATTRIBUTE_LIST tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, 'Token: tk_content\t Lexema: ' + $$[$0-4],  'Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-2], prod_1, 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                            
break;
case 29:
this.$ =null;
	                                                                            errors.push({ tipo: "Sintáctico", error: "Falta etiqueta de cierre \">\". ", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN CHILDREN tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
	                                                                            
break;
case 30:
this.$ =null;
	                                                                            errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador.", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

                                                                                prod_1 = grammar_stack.pop();
                                                                                prod_2 = grammar_stack.pop();
	                                                                            grammar_stack.push({'XML -> XML_OPEN CHILDREN tk_open_end_tag  tk_close {errors.add(new Error()); ﹩﹩ = null;}':[prod_2, prod_1, 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/',  'Token: tk_close\t Lexema: '  + '&gt;']});
	                                                                            
break;
case 31:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-3], origen: "XML", linea: _$[$0-3].first_line, columna: _$[$0-3].first_column+1 });

                                                                             grammar_stack.push({'XML -> error tk_open_end_tag tk_tag_name tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-3], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: '  + '&gt;']});
                                                                             
break;
case 32:
this.$ =null;
    	                                                                    errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-2], origen: "XML", linea: _$[$0-2].first_line, columna: _$[$0-2].first_column+1 });

                                                                            grammar_stack.push({'XML -> error tk_open_end_tag tk_tag_name {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-2], 'Token: tk_open_end_tag\t Lexema: ' + '&lt;/', 'Token: tk_tag_name\t Lexema: ' + $$[$0]]});
                                                                            
break;
case 33:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-2], origen: "XML", linea: _$[$0-2].first_line, columna: _$[$0-2].first_column+1 });

	                                                                        grammar_stack.push({'XML -> error tk_bar tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-2], 'Token: tk_bar\t Lexema: ' + $$[$0-1], 'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                        
break;
case 34:
this.$ =null;
	                                                                        errors.push({ tipo: "Sintáctico", error: "Token no esperado " + $$[$0-1], origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });

	                                                                        grammar_stack.push({'XML -> error  tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: error\t Lexema: ' + $$[$0-1],  'Token: tk_close\t Lexema: ' + '&gt;']});
	                                                                        
break;
case 35:
 this.$ = new Element($$[$0-2], $$[$0-1], null, null,  _$[$0-3].first_line,  _$[$0-3].first_column+1);

                                                        prod_1 = grammar_stack.pop();
                                                        grammar_stack.push({'XML_OPEN -> tk_open tk_tag_name ATTRIBUTE_LIST tk_close {﹩﹩ = new Element(); ﹩﹩.attributes = ﹩3}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-2], prod_1, 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                         
break;
case 36:

                                                        this.$ = null;
                                                        errors.push({ tipo: "Sintáctico", error: "Se esperaba \">\" despues de la cadena de atributos.", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });

                                                        prod_1 = grammar_stack.pop();
                                                        grammar_stack.push({'XML_OPEN -> tk_open tk_tag_name ATTRIBUTE_LIST {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_tag_name\t Lexema: ' + $$[$0-1], prod_1]});
                                                        
break;
case 37:
 this.$ = null;
                                                        errors.push({ tipo: "Sintáctico", error: "", origen: "XML", linea: _$[$0].first_line, columna: _$[$0].first_column+1 });
                                                        grammar_stack.push({'XML_OPEN -> tk_open {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;']});
                                                        
break;
case 38:
 this.$ = null;
                                                         errors.push({ tipo: "Sintáctico", error: "Se esperaba un identificador para la etiqueta", origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
                                                         grammar_stack.push({'XML_OPEN -> tk_open tk_close {errors.add(new Error()); ﹩﹩ = null;}':['Token: tk_open\t Lexema: ' + '&lt;', 'Token: tk_close\t Lexema: ' + '&gt;']});
                                                         
break;
case 39:
if($$[$0-1] != null && $$[$0] != null){ $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; } else{this.$ = null;}
                                                            prod_1 = grammar_stack.pop();
                                                            prod_2 = grammar_stack.pop();
                                                             grammar_stack.push({'CHILDREN -> CHILDREN XML {﹩1.push(﹩2); ﹩﹩ = $$[$0-1];}':[prod_2,  prod_1]});
                                                            
break;
case 40:
 if($$[$0]!=null ){this.$ = [$$[$0]];}else{this.$ = null;}
	                                                        prod_1 = grammar_stack.pop();
                                                            grammar_stack.push({'CHILDREN -> XML {﹩﹩ = [﹩1]}':[prod_1]});
	                                                        
break;
}
},
table: [{2:[1,5],3:1,4:2,5:3,6:[1,4],7:7,8:[1,6],19:8,23:$V0},{1:[3]},{2:$V1,5:10,6:[1,11],7:7,19:8,23:$V0},{2:$V1,6:[1,13],7:14,19:8,23:$V0},{1:[2,4]},{6:[1,15],12:$V2,21:$V3,24:$V4},o([2,11,12,14,16,17,18],$V5,{9:19}),o($V6,[2,7]),{2:$V1,7:23,19:8,20:20,21:[1,22],22:[1,21],23:$V0},o($V7,[2,37],{12:[1,25],17:[1,24]}),{2:$V1,6:[1,26],7:14,19:8,23:$V0},{1:[2,2]},{12:$V2,21:$V3,24:$V4},{1:[2,3]},o($V6,[2,6]),{1:[2,5]},{17:[1,27]},{12:[1,28]},o($V8,[2,34]),{2:[1,33],10:29,11:[1,31],12:[1,32],13:30,14:$V9,16:$Va,17:$Vb,18:$Vc},{2:$V1,7:39,19:8,21:[1,38],23:$V0},{21:[1,40],23:[1,41]},{12:[1,43],17:[1,42]},o($Vd,[2,40]),o([2,12,14,16,17,18,21,22,23,24],$V5,{9:44}),o($V7,[2,38]),{1:[2,1]},o($V8,[2,32],{12:[1,45]}),o($V8,[2,33]),o($V6,[2,8]),o($Ve,[2,12]),o($V6,[2,9]),o($V6,[2,10]),{12:[1,46]},o($Ve,[2,15],{15:[1,47]}),{15:[1,48]},o($Ve,[2,17]),o($Ve,[2,19],{15:[1,49]}),{12:[1,51],17:[1,50]},o($Vd,[2,39]),{12:[1,53],17:[1,52]},{17:[1,54]},o($V8,[2,24],{12:[1,55]}),o($V8,[2,25]),o($V7,[2,36],{13:30,12:[1,57],14:$V9,16:$Va,17:$Vb,18:$Vc,24:[1,56]}),o($V8,[2,31]),o($V6,[2,11]),o($Ve,[2,14]),o($Ve,[2,16]),o($Ve,[2,18]),o($V8,[2,29],{12:[1,58]}),o($V8,[2,30]),o($V8,[2,26],{12:[1,59]}),o($V8,[2,27]),o([12,14,16,17,18],$V5,{9:60}),o($V8,[2,23]),{12:[1,61]},o($V7,[2,35]),o($V8,[2,20]),o($V8,[2,21]),{12:[1,62],13:30,14:$V9,16:$Va,17:$Vb,18:$Vc},o($V8,[2,22]),o($V8,[2,28])],
defaultActions: {4:[2,4],11:[2,2],13:[2,3],15:[2,5],26:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

	var attribute = '';
	var errors = [];
	let re = /[^\n\t\r ]+/g
	let grammar_stack = [];



    function getGrammarReport(obj){
        let str = `<!DOCTYPE html>
                     <html lang="en" xmlns="http://www.w3.org/1999/html">
                     <head>
                         <meta charset="UTF-8">
                         <meta
                         content="width=device-width, initial-scale=1, shrink-to-fit=no"
                         name="viewport">
                         <!-- Bootstrap CSS -->
                         <link
                         crossorigin="anonymous"
                         href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                               integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                               rel="stylesheet">
                         <title>Reporte gramatical</title>
                         <style>
                             table, th, td {
                                 border: 1px solid black;
                             }
                             ul, .ul-tree-view {
                                 list-style-type: none;
                             }

                             #div-table{
                                 width: 1200px;
                                 margin: 100px;
                                 border: 3px solid #73AD21;
                             }

                             .ul-tree-view {
                                 margin: 0;
                                 padding: 0;
                             }

                             .caret {
                                 cursor: pointer;
                                 -webkit-user-select: none; /* Safari 3.1+ */
                                 -moz-user-select: none; /* Firefox 2+ */
                                 -ms-user-select: none; /* IE 10+ */
                                 user-select: none;
                             }

                             .caret::before {
                                 content: "\u25B6";
                                 color: black;
                                 display: inline-block;
                                 margin-right: 6px;
                             }

                             .caret-down::before {
                                 -ms-transform: rotate(90deg); /* IE 9 */
                                 -webkit-transform: rotate(90deg); /* Safari */'
                             transform: rotate(90deg);
                             }

                             .nested {
                                 display: none;
                             }

                             .active {
                                 display: block;
                             }

                             li span:hover {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             li span:hover + ul li  {
                                 font-weight: bold;
                                 color : white;
                                 background-color: #dc5b27;
                             }

                             .tree-view{
                                 display: inline-block;
                             }

                             li.string {
                                 list-style-type: square;
                             }
                             li.string:hover {
                                 color : white;
                                 background-color: #dc5b27;
                             }
                             .center {
                                margin: auto;
                                width: 50%;
                                border: 3px solid green;
                                padding-left: 15%;
                             }
                         </style>
                     </head>
                     <body>
                     <h1 class="center">Reporte Gramatical</h1>
                     <div class="tree-view">
                     <ul class="ul-tree-view" id="tree-root">`;


        str = str + buildGrammarReport(obj);


        str = str + `
                    </ul>
                    </ul>
                    </div>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                             <br>
                        <button onclick="fun1()">Expand Grammar Tree</button>
                     <div id="div-table">
                     <table style="width:100%">
                         <tr>
                         <th>Produccion</th>
                         <th>Cuerpo</th>
                         <th>Accion</th>
                         </tr>

                         <tr>
                         <th>INI-&gt;</th>
                         <td>XML_DECLARATION ROOT EOF</td>
                         <td>$$ = [$1, $2] </td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_DECLARATION  EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>ROOT EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>error EOF</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>



                         <tr>
                         <th>ROOT-&gt;</th>
                         <td>ROOT XML</td>
                         <td>$$ = $1.push($2);</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>XML</td>
                         <td>$$ = []; $$.push($1);</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>XML_DECLARATION-&gt;</th>
                         <td>tk_open_declaration ATTRIBUTE_LIST XML_CLOSE_DECLARATION</td>
                         <td>$$ = $2</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>





                         <tr>
                         <th>XML_CLOSE_DECLARATION-&gt;</th>
                         <td>tk_close_delcaraton</td>
                         <td>$$ = $1</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>


                         <tr>
                         <td></td>
                         <td>error tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>ATTRIBUTE_LIST-&gt;</th>
                         <td>ATTRIBUTE_LIST ATTRIBUTE </td>
                         <td>if($1 == null){$$=[]; $$.push($2)}else{$1.push($2)}</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>Empty</td>
                         <td>$$ = null</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>



                         <tr>
                         <th>ATTRIBUTE-&gt;</th>
                         <td>tk_attribute_name tk_string  </td>
                         <td>$$ = new Attribute($1, $2)</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_attribute_name</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_equal tk_string   </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_tag_name</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>cadena_err tk_string </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>cadena_err</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>

                         <tr>
                         <th>XML-&gt;</th>
                         <td>XML_OPEN CHILDREN tk_open_end_tag tk_tag_name tk_close   </td>
                         <td>$$ = $1; $1.children = $2</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag tk_tag_name tk_close  </td>
                         <td>$$ = $1; $$.content = $2</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST tk_bar tk_close </td>
                         <td>$$ = new Element(); $$.attributes = $3</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag tk_tag_name tk_close </td>
                         <td>$$ = $1; </td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_open_end_tag  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content tk_open_end_tag  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN tk_content  tk_open tk_tag_name ATTRIBUTE_LIST tk_close</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN CHILDREN tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>XML_OPEN CHILDREN tk_open_end_tag  tk_close  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_open_end_tag tk_tag_name tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_open_end_tag tk_tag_name  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error tk_bar tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>error  tk_close </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>


                         <tr>
                         <th>XML_OPEN-&gt;</th>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST tk_close </td>
                         <td>$$ = new Element(); $$.attributes = $3</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open tk_tag_name ATTRIBUTE_LIST  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open</td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td>tk_open   tk_close  </td>
                         <td>errors.add(new Error()); $$ = null;</td>
                         </tr>

                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>
                         <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                         </tr>


                         <tr>
                         <th>CHILDREN-&gt;</th>
                         <td>CHILDREN XML </td>
                         <td>$1.push($2); $$ = $1;</td>
                         </tr>
                         <tr>
                         <td></td>
                         <td>XML</td>
                         <td>$$ = [$1]</td>
                         </tr>

                     </table>

                     </div>

                     <script
                     src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js">
                     </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                             src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js">
                             </script>
                     <script
                     crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                             src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js">
                             </script>

                             <script>
                                 var toggler = document.getElementsByClassName("caret");
                                 var i;

                                 for (i = 0; i < toggler.length; i++) {
                                     toggler[i].addEventListener("click", function() {
                                         this.parentElement
                                         .querySelector(".nested")
                                         .classList.toggle("active");
                                         this.classList.toggle("caret-down");
                                     });
                                 }


                                        function fun1() {
                                            if ($("#tree-root").length > 0) {

                                                $("#tree-root").find("li").each
                                                (
                                                    function () {
                                                        var $span = $("<span></span>");
                                                        //$(this).toggleClass("expanded");
                                                        if ($(this).find("ul:first").length > 0) {
                                                            $span.removeAttr("class");
                                                            $span.attr("class", "expanded");
                                                            $(this).find("ul:first").css("display", "block");
                                                            $(this).append($span);
                                                        }

                                                    }
                                                )
                                            }

                                        }




                             </script>

                     </body>
                     </html>`;
                     return str;
    }
    // .replace("₤","$")
    function buildGrammarReport(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                str = str + `<li class= "string">
                ${value}
                </li>
                `;
            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildGrammarReport(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){

                str = `<li class="grammar-tree"><span class="caret">
                ${key}
                </span>
                <ul class="nested">
                `;
                str = str + buildGrammarReport(obj[key]);
                str = str + `
                </ul>
                </li>`;
            }
        }
        return str;
    }


    function getCST(obj){
        let str = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport">
            <!-- Bootstrap CSS -->
            <link crossorigin="anonymous" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                  integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" rel="stylesheet">
            <title>CST</title>
            <style>

                #divheight{
                    height: 400px;
                    width: 1050px;
                }

                .nav-tabs > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

                .nav-tabs2 > li .close {
                    margin: -2px 0 0 10px;
                    font-size: 18px;
                }

            </style>

            <style>
                body {
                    font-family: sans-serif;
                    font-size: 15px;
                }

                .tree ul {
                    position: relative;
                    padding: 1em 0;
                    white-space: nowrap;
                    margin: 0 auto;
                    text-align: center;
                }
                .tree ul::after {
                    content: "";
                    display: table;
                    clear: both;
                }

                .tree li {
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    list-style-type: none;
                    position: relative;
                    padding: 1em 0.5em 0 0.5em;
                }
                .tree li::before, .tree li::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 50%;
                    border-top: 1px solid #ccc;
                    width: 50%;
                    height: 1em;
                }
                .tree li::after {
                    right: auto;
                    left: 50%;
                    border-left: 1px solid #ccc;
                }
                /*
                ul:hover::after  {
                    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport)
                }*/

                .tree li:only-child::after, .tree li:only-child::before {
                    display: none;
                }
                .tree li:only-child {
                    padding-top: 0;
                }
                .tree li:first-child::before, .tree li:last-child::after {
                    border: 0 none;
                }
                .tree li:last-child::before {
                    border-right: 1px solid #ccc;
                    border-radius: 0 5px 0 0;
                }
                .tree li:first-child::after {
                    border-radius: 5px 0 0 0;
                }

                .tree ul ul::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    border-left: 1px solid #ccc;
                    width: 0;
                    height: 1em;
                }

                .tree li a {
                    border: 1px solid #ccc;
                    padding: 0.5em 0.75em;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    color: #333;
                    position: relative;
                    top: 1px;
                }

                .tree li a:hover,
                .tree li a:hover + ul li a {
                    background: #e9453f;
                    color: #fff;
                    border: 1px solid #e9453f;
                }

                .tree li a:hover + ul li::after,
                .tree li a:hover + ul li::before,
                .tree li a:hover + ul::before,
                .tree li a:hover + ul ul::before {
                    border-color: #e9453f;
                }



            </style>
        </head>
        <body>



        <div class="tree">
            <ul id="tree-list">

            <!--AQUI-->
        `;
        str = str + buildCSTTree(obj);
        str = str + `
        </ul>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js"></script>
        <script crossorigin="anonymous" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
        <script crossorigin="anonymous" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
        </body>
        </html>
        `;
        return str;
    }

    function buildCSTTree(obj){
        if(obj == null){return "";}
        let str = "";
        if(Array.isArray(obj)){ //IS ARRAY
            obj.forEach((value)=>{
            if(typeof value === 'string' ){
                let words = value.split('Lexema:');
                if(words.length == 2){
                    let lex = words[1];     //TODO check not go out of bounds
                    let token = words[0];
                    str = str + `<li><a href="">${token}</a><ul>
                    <li><a href="">${lex}
                    </a></li>
                    </ul></li>
                    `;
                }else{
                    str = str + `<li><a href="">${value}</a></li>
                    `;
                }


            }else if(Array.isArray(value)){console.log("ERROR 5: Arreglo de arreglos");}else{
                for(let key in value){
                    str = str + buildCSTTree(value);
                }
            }
            });
        }else if(typeof obj === 'string' ){ // IS STRING
            return "";
        }else{// IS OBJECT
            for(let key in obj){
                const words = key.split('->');
                //console.log(words[3]);
                str = `<li><a href="">${words[0]}</a>
                <ul>
                `;
                str = str + buildCSTTree(obj[key]) + `
                </ul>
                </li>`;
            }
        }
        return str;
    }



	const { Atributo } = __webpack_require__(/*! ../model/xml/Atributo */ "tSns");
	const { Element } = __webpack_require__(/*! ../model/xml/Element */ "Kypw");
	const { Encoding } = __webpack_require__(/*! ../model/xml/Encoding/Encoding */ "EfzR");
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Whitespace
break;
case 1:/* MultiLineComment*/
break;
case 2:return 8;
break;
case 3:return 11;
break;
case 4:return 14;
break;
case 5:return 17;
break;
case 6:return 21
break;
case 7:return 23;
break;
case 8: this.pushState('content');  return 12;
break;
case 9:return 24;
break;
case 10:return 16;
break;
case 11:return 15;
break;
case 12:return cadena_err;
break;
case 13:return id_err;
break;
case 14:/* MultiLineComment*/
break;
case 15:
                                    if(yy_.yytext.match(re)){return 22;}
                                 
break;
case 16:return 6
break;
case 17: this.popState(); return 12; 
break;
case 18: this.popState(); return 21 
break;
case 19: this.popState(); return 23; 
break;
case 20: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
case 21:return 6
break;
case 22: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!--([^-]|-[^-])*-->)/i,/^(?:<\?([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*))/i,/^(?:\?>)/i,/^(?:(([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*)\s*=))/i,/^(?:([_a-zA-Z]([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*))/i,/^(?:<\/)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:(("[^\"\n]*[\"\n])|('[^\'\n]*[\'\n])))/i,/^(?:([0-9]+(\.[0-9]+)?([a-zA-Z0-9_.-]|([\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+))*=?))/i,/^(?:{id_err})/i,/^(?:<!--([^-]|-[^-])*-->)/i,/^(?:(([^<>&\"]|&lt;|&gt;|&amp;|&apos;|&quot;)+))/i,/^(?:$)/i,/^(?:>)/i,/^(?:<\/)/i,/^(?:<)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"content":{"rules":[14,15,16,17,18,19,20],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,21,22],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = xml_up;
exports.Parser = xml_up.Parser;
exports.parse = function () { return xml_up.parse.apply(xml_up, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(/*! fs */ 3).readFileSync(__webpack_require__(/*! path */ 4).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "pW4W":
/*!********************************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Selecting/Axis/Axis.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../../../../model/xpath/Enum */ "MEUw");
const Expresion_1 = __importDefault(__webpack_require__(/*! ../../../Expresion/Expresion */ "gajf"));
const Predicate_1 = __webpack_require__(/*! ../Predicate */ "Iysv");
const Contexto_1 = __webpack_require__(/*! ../../../../Contexto */ "ivfU");
const Variable_1 = __webpack_require__(/*! ../../../../../model/xml/Ambito/Variable */ "C8dJ");
function SelectAxis(_instruccion, _ambito, _contexto, id) {
    let _404 = "No se encontraron elementos.";
    let expresion = Expresion_1.default(_instruccion, _ambito, _contexto, id);
    if (expresion === null || expresion.error)
        return expresion;
    let root = getAxis(expresion.axisname, expresion.nodetest, expresion.predicate, _contexto, _ambito, false, id);
    if (root === null || root.error || root.getLength() === 0)
        root.notFound = _404;
    return root;
}
function getAxis(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id) {
    if (_contexto.getLength() > 0)
        return firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id);
    else {
        _contexto.error = { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
        return _contexto;
    }
}
// Revisa el axisname y extrae los elementos
function firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id) {
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    switch (_axisname) {
        case Enum_1.Tipos.AXIS_ANCESTOR: // Selects all ancestors (parent, grandparent, etc.) of the current node
        case Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF: // Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF) {
                    if (element.father)
                        retorno.elementos.push(element);
                    else
                        retorno.elementos.push(element.childs[0]);
                }
                if (element.father) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_ATTRIBUTE: // Selects all attributes of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_isDoubleBar) {
                    retorno.atributos = _ambito.searchAnyAttributes("*", element, retorno.atributos);
                }
                else if (element.attributes)
                    element.attributes.forEach((attribute) => {
                        retorno.atributos.push(attribute);
                    });
            }
            retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
            break;
        case Enum_1.Tipos.AXIS_CHILD: // Selects all children of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_isDoubleBar) {
                    if (element.father)
                        retorno.elementos = _ambito.searchNodes("*", element, retorno.elementos);
                    else
                        retorno.elementos = _ambito.searchNodes("*", element.childs[0], retorno.elementos);
                }
                else if (element.childs)
                    element.childs.forEach((child) => {
                        retorno.elementos.push(child);
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_DESCENDANT: // Selects all descendants (children, grandchildren, etc.) of the current node
        case Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF: // Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF) {
                    if (element.father)
                        retorno.elementos.push(element);
                    // else elements.push(element.childs[0]);
                }
                if (element.father)
                    retorno.elementos = _ambito.searchNodes("*", element, retorno.elementos);
                else
                    retorno.elementos = _ambito.searchNodes("*", element.childs[0], retorno.elementos);
            }
            break;
        case Enum_1.Tipos.AXIS_FOLLOWING: // Selects everything in the document after the closing tag of the current node
        case Enum_1.Tipos.AXIS_PRECEDING: // Selects all nodes that appear before the current node in the document
        case Enum_1.Tipos.AXIS_FOLLOWING_SIBLING: // Selects all siblings after the current node:
        case Enum_1.Tipos.AXIS_PRECEDING_SIBLING: // Selects all siblings before the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                let dad = element.father;
                if (dad && (_axisname === Enum_1.Tipos.AXIS_PRECEDING || _axisname === Enum_1.Tipos.AXIS_PRECEDING_SIBLING)) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
                else if (_axisname === Enum_1.Tipos.AXIS_FOLLOWING || _axisname === Enum_1.Tipos.AXIS_FOLLOWING_SIBLING) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_NAMESPACE: // Selects all namespace nodes of the current node
            retorno.error = { error: "Error: la funcionalidad 'namespace' no está disponible.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
            break;
        case Enum_1.Tipos.AXIS_PARENT: // Selects the parent of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                let dad = element.father;
                if (dad)
                    _ambito.tablaSimbolos.forEach(elm => {
                        if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                            retorno.elementos.push(elm);
                        if (elm.childs)
                            elm.childs.forEach(child => {
                                retorno.elementos = _ambito.searchDad(child, dad.id, dad.line, dad.column, retorno.elementos);
                            });
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_SELF: // Selects the current node
            retorno = _contexto;
            break;
        default:
            retorno.error = { error: "Error: axisname no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
            break;
    }
    return secondFilter(retorno, _nodetest, _predicate, _ambito, _isDoubleBar);
}
// Revisa el nodetest y busca hacer match
function secondFilter(_contexto, _nodetest, _predicate, _ambito, _isDoubleBar, id) {
    let valor = _nodetest.valor;
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    switch (_nodetest.tipo) {
        case Enum_1.Tipos.ELEMENTOS:
        case Enum_1.Tipos.ASTERISCO:
        case Enum_1.Tipos.FUNCION_TEXT:
        case Enum_1.Tipos.FUNCION_NODE:
            if (_contexto.atributos.length > 0) {
                for (let i = 0; i < _contexto.atributos.length; i++) {
                    const attribute = _contexto.atributos[i];
                    if (attribute.id == valor || valor === "*") {
                        retorno.atributos.push(attribute);
                    }
                    else if (attribute.value == valor) {
                        retorno.atributos.push(attribute);
                    }
                }
                retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
            }
            else if (_contexto.texto.length > 0) {
                for (let i = 0; i < _contexto.texto.length; i++) {
                    const text = _contexto.texto[i];
                    if (text == valor || valor === "*") {
                        retorno.texto.push(text);
                    }
                }
                retorno.cadena = Enum_1.Tipos.TEXTOS;
            }
            else if (_contexto.nodos.length > 0) {
                for (let i = 0; i < _contexto.nodos.length; i++) {
                    const node = _contexto.nodos[i];
                    if (node.textos == valor || valor === "*") {
                        retorno.nodos.push(node);
                    }
                    else if (node.elementos.id_open == valor || node.elementos.value == valor) {
                        retorno.nodos.push(node);
                    }
                }
                retorno.cadena = Enum_1.Tipos.COMBINADO;
            }
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT && element.value) {
                    _contexto.texto.push(element.value);
                }
                else if (element.id_open == valor || valor == "*" || _nodetest.tipo === Enum_1.Tipos.FUNCION_NODE) {
                    retorno.elementos.push(element);
                }
                else if (element.childs) {
                    element.childs.forEach(child => {
                        if (child.id_open == valor)
                            retorno.elementos.push(child);
                    });
                }
                retorno.removeDuplicates();
            }
            break;
        default:
            retorno.error = { error: "Error: nodetest no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    // En caso de tener algún predicado
    if (_predicate) {
        let filter = new Predicate_1.Predicate(_predicate, _ambito, retorno);
        if (retorno.atributos.length > 0)
            retorno.atributos = filter.filterElements(retorno.atributos);
        else if (retorno.texto.length > 0)
            retorno.texto = filter.filterElements(retorno.texto);
        else
            retorno.elementos = filter.filterElements(retorno.elementos);
    }
    return retorno;
}
module.exports = { SA: SelectAxis, GetAxis: getAxis };


/***/ }),

/***/ "qbRd":
/*!*******************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Aritmetica.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function Aritmetica(_expresion, _ambito, _contexto) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo, _contexto);
    if (operators === null || operators.error)
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.OPERACION_SUMA:
            return suma(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_RESTA:
            return resta(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_DIVISION:
            return division(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_MODULO:
            return modulo(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(operators.op1);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _tipo, _contexto) {
    const Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    let op1 = Expresion(_opIzq, _ambito, _contexto);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto);
    if (op2 === null || op2.error)
        return op2;
    let tipo = _tipo;
    if (op1.tipo === Enum_1.Tipos.FUNCION_LAST && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_LAST) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Enum_1.Tipos.FUNCION_POSITION && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_POSITION) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
    }
    else if ((op1.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.STRING) && tipo === Enum_1.Tipos.OPERACION_SUMA) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
    }
    else
        return { error: "Solamente se pueden operar aritméticamente valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
    return { op1: op1, op2: op2, tipo: tipo };
}
function suma(_opIzq, _opDer) {
    return {
        valor: (_opIzq + _opDer),
        tipo: (typeof (_opIzq) === "number" && typeof (_opDer) === "number") ? (Enum_1.Tipos.NUMBER) : (Enum_1.Tipos.STRING)
    };
}
function resta(_opIzq, _opDer) {
    return {
        valor: (_opIzq - _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function multiplicacion(_opIzq, _opDer) {
    return {
        valor: (_opIzq * _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function division(_opIzq, _opDer) {
    if (_opDer == 0)
        return { error: "No es permitida la división entre 0." };
    return {
        valor: (_opIzq / _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function modulo(_opIzq, _opDer) {
    if (_opDer == 0)
        return { error: "No es permitido módulo entre 0." };
    return {
        valor: (_opIzq % _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function negacionUnaria(_opIzq) {
    return {
        valor: (0 - _opIzq),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
module.exports = Aritmetica;


/***/ }),

/***/ "r8U1":
/*!*******************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Relacional.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
const Contexto_1 = __webpack_require__(/*! ../../../Contexto */ "ivfU");
const Match_1 = __importDefault(__webpack_require__(/*! ./Match */ "jdP8"));
function Relacional(_expresion, _ambito, _contexto, id) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo, _contexto, id);
    if (operators === null || operators.error)
        return operators;
    if (Array.isArray(operators))
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return mayor(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return menor(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return igual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return diferente(operators.op1, operators.op2);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _tipo, _contexto, id) {
    const Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    let op1 = Expresion(_opIzq, _ambito, _contexto, id);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto, id);
    if (op2 === null || op2.error)
        return op2;
    let tipo = _tipo;
    if (op1.cadena || op2.cadena) {
        if (op1.cadena && (op2.tipo === Enum_1.Tipos.NUMBER || op2.tipo === Enum_1.Tipos.STRING)) {
            if (_ambito.contextFromVar && _ambito.contextFromVar.contexto) {
                _contexto = _ambito.contextFromVar.contexto;
                _ambito.contextFromVar = null;
            }
            let tmp = new Contexto_1.Contexto(_contexto);
            return Match_1.default(op2.valor, tipo, op1, tmp);
        }
        else
            return null;
    }
    // Numéricas
    if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL ||
        tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL) {
        if ((op1.tipo === Enum_1.Tipos.FUNCION_POSITION || op1.tipo === Enum_1.Tipos.FUNCION_LAST) && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = _contexto.getLength();
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            op2 = Number(op1.valor);
            op1 = _contexto.getLength();
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYOR)
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENOR)
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Enum_1.Tipos.ATRIBUTOS || op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
            let opIzq = { valor: 0, tipo: op1.tipo };
            let opDer = { valor: 0, tipo: op2.tipo };
            opIzq.tipo = Enum_1.Tipos.ATRIBUTOS;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.ATRIBUTOS) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.ATRIBUTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Desigualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = Number(op1.valor);
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.ELEMENTOS || op2.tipo === Enum_1.Tipos.ELEMENTOS) {
            if (op1.tipo === Enum_1.Tipos.ELEMENTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                let tmp = op1.valor;
                op1 = op2.valor;
                op2 = tmp;
            }
            else if (op1.tipo === Enum_1.Tipos.ELEMENTOS && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            return { op1: { valor: op1, id: true }, op2: op2, tipo: tipo };
        }
        else
            return { error: "Solamente se pueden comparar desigualdades entre valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
        return { op1: op1, op2: op2, tipo: tipo };
    }
    // Numéricas o texto
    if (tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        let opIzq = { valor: 0, tipo: op1.tipo };
        let opDer = { valor: 0, tipo: op2.tipo };
        if ((op1.tipo === Enum_1.Tipos.FUNCION_POSITION || op1.tipo === Enum_1.Tipos.FUNCION_LAST) && op2.tipo === Enum_1.Tipos.NUMBER) {
            opIzq.valor = _contexto.getLength();
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _contexto.getLength();
        }
        else if (op1.tipo === Enum_1.Tipos.ATRIBUTOS || op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
            opIzq.tipo = Enum_1.Tipos.ATRIBUTOS;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.ATRIBUTOS) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.ATRIBUTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.FUNCION_TEXT || op2.tipo === Enum_1.Tipos.FUNCION_TEXT) {
            opIzq.tipo = Enum_1.Tipos.FUNCION_TEXT;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.FUNCION_TEXT) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.FUNCION_TEXT && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.ELEMENTOS || op2.tipo === Enum_1.Tipos.ELEMENTOS) {
            if (op1.tipo === Enum_1.Tipos.ELEMENTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                let tmp = op1.valor;
                op1 = op2.valor;
                op2 = tmp;
            }
            else if (op1.tipo === Enum_1.Tipos.ELEMENTOS && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
        }
        else {
            return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
        }
        return { op1: op1, op2: op2, tipo: tipo };
    }
    return { error: "Relación no procesada.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
}
function mayor(_opIzq, _opDer) {
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: (_opDer + 1),
        tipo: Enum_1.Tipos.RELACIONAL_MAYOR
    };
}
function mayorigual(_opIzq, _opDer) {
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MAYORIGUAL
    };
}
function menor(_opIzq, _opDer) {
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: (_opDer - 1),
        tipo: Enum_1.Tipos.RELACIONAL_MENOR
    };
}
function menorigual(_opIzq, _opDer) {
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MENORIGUAL
    };
}
function igual(_opIzq, _opDer) {
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_IGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Enum_1.Tipos.NUMBER };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Enum_1.Tipos.NUMBER };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_TEXT)
        return { condicion: _opDer.valor, tipo: Enum_1.Tipos.FUNCION_TEXT };
    return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_IGUAL };
}
function diferente(_opIzq, _opDer) {
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_DIFERENTE };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Enum_1.Tipos.EXCLUDE };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Enum_1.Tipos.EXCLUDE };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, exclude: true, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_TEXT)
        return { condicion: _opDer.valor, exclude: true, tipo: Enum_1.Tipos.FUNCION_TEXT };
    return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_DIFERENTE };
}
module.exports = Relacional;


/***/ }),

/***/ "tJF2":
/*!****************************************!*\
  !*** ./src/js/controller/xquery/If.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(__webpack_require__(/*! ../xpath/Expresion/Expresion */ "gajf"));
const Contexto_1 = __webpack_require__(/*! ../Contexto */ "ivfU");
function IfConditional(_condicion, _instruccionesThen, _instruccionesElse, _ambito, _contexto, id) {
    let tmp = new Contexto_1.Contexto(_contexto);
    let condicion = Expresion_1.default(_condicion, _ambito, tmp, id);
    // console.log(_condicion)
    if (condicion && condicion[0].getLength() > 0) {
        let instrucciones = Expresion_1.default(_instruccionesThen, _ambito, condicion[0], id);
        return instrucciones;
    }
    else {
        let instrucciones = Expresion_1.default(_instruccionesElse, _ambito, _contexto, id);
        return instrucciones;
    }
}
module.exports = IfConditional;


/***/ }),

/***/ "tSns":
/*!**************************************!*\
  !*** ./src/js/model/xml/Atributo.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Atributo = void 0;
class Atributo {
    constructor(id, value, line, column) {
        this.id = id;
        this.value = value;
        this.line = line;
        this.column = column;
    }
    set Cst(value) {
        this.cst = value;
    }
    get Cst() {
        return this.cst;
    }
}
exports.Atributo = Atributo;


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map