(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/ldecast/JUNIO 2021/Compiladores 2/tytusx-G23/frontend/src/main.ts */"zUnb");


/***/ }),

/***/ 1:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
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
var Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
var Expresion_1 = __importDefault(__webpack_require__(/*! ../../Expresion/Expresion */ "gajf"));
function DobleEje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: Array() };
    var contexto;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    var expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto);
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.length === 0)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    retorno.retorno = root; //arreglo de elementos -> el contexto
    // Validar si tiene predicado, arroba antes, etc
    return retorno;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}
function getFromCurrent(_id, _contexto, _ambito) {
    var elements = Array();
    var attributes = Array();
    var nodes = Array();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    nodes = _ambito.nodesFunction(child, nodes);
                });
            }
            else if (element.value)
                nodes.push({ textos: element.value });
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        var a = { atributos: attributes, elementos: elements };
        if (_id.id === "*") {
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                a = _ambito.searchAnyAttributes(element, attributes, elements);
            }
        }
        else {
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                a = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
            }
        }
        return a;
    }
    else if (_id === "..") {
        if (_contexto.atributos) {
            var _loop_1 = function (i) {
                var attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(function (elm) {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            };
            for (var i = 0; i < _contexto.atributos.length; i++) {
                _loop_1(i);
            }
            return elements;
        }
        var _loop_2 = function (i) {
            var element = _contexto[i];
            var dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(function (elm) {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(function (child) {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        };
        for (var i = 0; i < _contexto.length; i++) {
            _loop_2(i);
        }
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        }
        return elements;
    }
}
function getFromRoot(_id, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        var nodes_1 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            // if (element.childs) {
            //     element.childs.forEach(child => {
            nodes_1 = _ambito.nodesFunction(element, nodes_1);
            // });
            // }
            // else if (element.value)
            //     nodes.push({ textos: element.value });
        });
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_1 };
    }
    // Selecciona todos los atributos a partir de la raíz
    else if (_id.tipo === "@") {
        var a_1 = { atributos: attributes, elementos: elements };
        _ambito.tablaSimbolos.forEach(function (element) {
            if (_id.id === "*")
                a_1 = _ambito.searchAnyAttributes(element, attributes, elements);
            else
                a_1 = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
        });
        return a_1;
    }
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id)
                elements.push(element);
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        });
        return elements;
    }
}
function getAllTexts(_element, _cadena) {
    if (_element.childs) {
        _element.childs.forEach(function (child) {
            _cadena = getAllTexts(child, _cadena);
        });
    }
    else if (_element.value)
        _cadena.push(_element.value);
    return _cadena;
}
module.exports = DobleEje;


/***/ }),

/***/ "8Ym7":
/*!*******************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Bloque.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = __webpack_require__(/*! ../../../model/xpath/Enum */ "MEUw");
var DobleEje_1 = __importDefault(__webpack_require__(/*! ./Selecting/DobleEje */ "67Yu"));
var Eje_1 = __importDefault(__webpack_require__(/*! ./Selecting/Eje */ "CG7/"));
function Bloque(_instruccion, _ambito) {
    var retorno = { cadena: "", retorno: null };
    var attr = Array();
    var tmp;
    for (var i = 0; i < _instruccion.length; i++) {
        var instr = _instruccion[i];
        console.log(instr, 7777777);
        switch (instr.tipo) {
            case Enum_1.Tipos.SELECT_FROM_ROOT:
                tmp = Eje_1.default(instr, _ambito, retorno);
                if (tmp.err)
                    return tmp;
                // if (tmp.retorno.atributos) {
                //     retorno.retorno = tmp.retorno.elementos;
                //     retorno.cadena = tmp.cadena;
                //     attr = tmp.retorno.atributos;
                // }
                // else {
                retorno = tmp;
                // }
                break;
            case Enum_1.Tipos.SELECT_FROM_CURRENT:
                tmp = DobleEje_1.default(instr, _ambito, retorno);
                console.log(tmp, 323223);
                if (tmp.err)
                    return tmp;
                // if (tmp.retorno.atributos) {
                //     retorno.retorno = tmp.retorno.elementos;
                //     retorno.cadena = tmp.cadena;
                //     attr = tmp.retorno.atributos;
                // }
                // else {
                retorno = tmp;
                // }
                break;
            default:
                return { err: "Instrucción no procesada.\n", linea: instr.linea, columna: instr.columna };
        }
    }
    console.log(retorno, 888888888);
    if (retorno.retorno) {
        var cadena_1 = "";
        if (retorno.cadena === Enum_1.Tipos.TEXTOS) {
            var root = retorno.retorno;
            root.forEach(function (txt) {
                cadena_1 += concatText(txt);
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.ELEMENTOS) {
            var root = retorno.retorno;
            root.forEach(function (element) {
                cadena_1 += concatChilds(element, "");
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.ATRIBUTOS) {
            // let root: Array<Atributo> = attr; // <-- muestra sólo el atributo
            // root.forEach(attribute => {
            //     cadena += concatAttributes(attribute);
            // });
            var root = retorno.retorno.elementos; // <-- muestra toda la etiqueta
            root.forEach(function (element) {
                cadena_1 += extractAttributes(element, "");
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.COMBINADO) {
            console.log(retorno, 3523523);
            var root = retorno.retorno.nodos;
            root.forEach(function (elemento) {
                if (elemento.elementos) {
                    cadena_1 += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena_1 += concatText(elemento.textos);
                }
            });
        }
        retorno.cadena = cadena_1.substring(1);
    }
    return retorno;
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(function (attribute) {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(function (child) {
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
    return "\n" + _attribute.id + "=\"" + _attribute.value + "\"";
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(function (attribute) {
            cadena += "\n" + attribute.id + "=\"" + attribute.value + "\"";
        });
    }
    return cadena;
}
function concatText(_text) {
    return "\n" + _text;
}
module.exports = Bloque;


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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,5],$V2=[1,18],$V3=[1,14],$V4=[1,15],$V5=[1,16],$V6=[1,17],$V7=[1,19],$V8=[1,20],$V9=[1,21],$Va=[1,22],$Vb=[1,11],$Vc=[1,12],$Vd=[1,13],$Ve=[1,23],$Vf=[1,24],$Vg=[5,9,10,27,34,35,36,37,38,39,40,41,42,43,44,47,48],$Vh=[5,9,10,15,17,18,19,20,21,22,23,24,25,26,27,28,29,31,34,35,36,37,38,39,40,41,42,43,44,47,48],$Vi=[5,9,10,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,31,34,35,36,37,38,39,40,41,42,43,44,47,48],$Vj=[2,12],$Vk=[1,42],$Vl=[1,45],$Vm=[1,49],$Vn=[1,50],$Vo=[1,51],$Vp=[1,52],$Vq=[1,53],$Vr=[1,54],$Vs=[1,55],$Vt=[1,56],$Vu=[1,57],$Vv=[1,58],$Vw=[1,59],$Vx=[1,60],$Vy=[1,61],$Vz=[15,17,18,19,20,21,22,23,24,25,26,27,28,29,31],$VA=[5,9,10,15,27,34,35,36,37,38,39,40,41,42,43,44,47,48],$VB=[15,17,18,19,20,21,22,23,24,31],$VC=[15,17,18,19,20,21,22,23,24,25,26,31];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"XPATH":4,"EOF":5,"XPATH_U":6,"tk_line":7,"QUERY":8,"tk_2bar":9,"tk_bar":10,"EXP_PR":11,"AXIS":12,"PREDICATE":13,"tk_corA":14,"tk_corC":15,"EXP":16,"tk_equal":17,"tk_diferent":18,"tk_menorigual":19,"tk_menor":20,"tk_mayorigual":21,"tk_mayor":22,"tk_or":23,"tk_and":24,"tk_mas":25,"tk_menos":26,"tk_por":27,"tk_div":28,"tk_mod":29,"tk_ParA":30,"tk_ParC":31,"FUNCIONES_RESERVADAS":32,"PRIMITIVO":33,"tk_id":34,"string_doubleq":35,"string_singleq":36,"num":37,"tk_punto":38,"tk_2puntos":39,"tk_arroba":40,"tk_node":41,"tk_last":42,"tk_position":43,"tk_text":44,"AXISNAME":45,"tk_4puntos":46,"tk_ancestor":47,"tk_child":48,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"tk_line",9:"tk_2bar",10:"tk_bar",14:"tk_corA",15:"tk_corC",17:"tk_equal",18:"tk_diferent",19:"tk_menorigual",20:"tk_menor",21:"tk_mayorigual",22:"tk_mayor",23:"tk_or",24:"tk_and",25:"tk_mas",26:"tk_menos",27:"tk_por",28:"tk_div",29:"tk_mod",30:"tk_ParA",31:"tk_ParC",34:"tk_id",35:"string_doubleq",36:"string_singleq",37:"num",38:"tk_punto",39:"tk_2puntos",40:"tk_arroba",41:"tk_node",42:"tk_last",43:"tk_position",44:"tk_text",46:"tk_4puntos",47:"tk_ancestor",48:"tk_child"},
productions_: [0,[3,2],[6,3],[6,1],[4,2],[4,1],[8,2],[8,2],[8,1],[8,1],[13,3],[13,3],[13,0],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,1],[11,1],[11,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,2],[33,2],[33,3],[32,3],[32,3],[32,3],[12,4],[45,1],[45,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 console.log($$[$0-1]); ast = { ast: $$[$0-1], errors: errors };
					errors = [];
					return ast;
				
break;
case 2:
 this.$=[$$[$0-2], $$[$0]]; 
break;
case 3: case 8: case 27: case 29:
 this.$=$$[$0]; 
break;
case 4:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1]; 
break;
case 5:
 this.$=[$$[$0]]; 
break;
case 6:
 this.$=builder.newDoubleAxis($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 7:
 this.$=builder.newAxis($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 9: case 10: case 11: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 28: case 40: case 41: case 42: case 43: case 44: case 45:
  
break;
case 30:
 this.$=builder.newNodename($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 31: case 32:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1); 
break;
case 33:
 this.$=builder.newValue($$[$0], Tipos.NUMBER, this._$.first_line, this._$.first_column+1); 
break;
case 34:
 this.$=builder.newValue($$[$0], Tipos.ASTERISCO, this._$.first_line, this._$.first_column+1); 
break;
case 35:
 this.$=builder.newCurrent($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 36:
 this.$=builder.newParent($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 37: case 38:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 39:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); 
break;
}
},
table: [{3:1,4:2,8:3,9:$V0,10:$V1,11:6,12:7,27:$V2,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd,45:10,47:$Ve,48:$Vf},{1:[3]},{5:[1,25],8:26,9:$V0,10:$V1,11:6,12:7,27:$V2,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd,45:10,47:$Ve,48:$Vf},o($Vg,[2,5]),{8:27,9:$V0,10:$V1,11:6,12:7,27:$V2,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd,45:10,47:$Ve,48:$Vf},{8:28,9:$V0,10:$V1,11:6,12:7,27:$V2,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd,45:10,47:$Ve,48:$Vf},o($Vg,[2,8]),o($Vg,[2,9]),o($Vh,[2,28]),o($Vh,[2,29]),{46:[1,29]},{30:[1,30]},{30:[1,31]},{30:[1,32]},o($Vi,[2,30]),o($Vi,[2,31]),o($Vi,[2,32]),o($Vi,[2,33]),o($Vi,[2,34]),o($Vi,[2,35]),o($Vi,[2,36]),{27:[1,34],34:[1,33]},{30:[1,35]},{46:[2,44]},{46:[2,45]},{1:[2,1]},o($Vg,[2,4]),o($Vg,[2,6]),o($Vg,[2,7]),{27:$V2,33:36,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va},{31:[1,37]},{31:[1,38]},{31:[1,39]},o($Vi,[2,37]),o($Vi,[2,38]),{31:[1,40]},o($Vg,$Vj,{13:41,14:$Vk}),o($Vh,[2,40]),o($Vh,[2,41]),o($Vh,[2,42]),o($Vi,[2,39]),o($Vg,[2,43]),{11:46,13:43,14:$Vk,15:$Vj,16:44,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{15:[1,47]},{15:[1,48],17:$Vm,18:$Vn,19:$Vo,20:$Vp,21:$Vq,22:$Vr,23:$Vs,24:$Vt,25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy},{11:46,16:62,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},o($Vz,[2,27]),o($VA,[2,10]),o($VA,[2,11]),{11:46,16:63,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:64,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:65,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:66,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:67,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:68,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:69,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:70,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:71,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:72,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:73,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:74,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{11:46,16:75,27:$V2,30:$Vl,32:8,33:9,34:$V3,35:$V4,36:$V5,37:$V6,38:$V7,39:$V8,40:$V9,41:$Va,42:$Vb,43:$Vc,44:$Vd},{17:$Vm,18:$Vn,19:$Vo,20:$Vp,21:$Vq,22:$Vr,23:$Vs,24:$Vt,25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy,31:[1,76]},o($VB,[2,13],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VB,[2,14],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VB,[2,15],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VB,[2,16],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VB,[2,17],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VB,[2,18],{25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o([15,23,31],[2,19],{17:$Vm,18:$Vn,19:$Vo,20:$Vp,21:$Vq,22:$Vr,24:$Vt,25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o([15,23,24,31],[2,20],{17:$Vm,18:$Vn,19:$Vo,20:$Vp,21:$Vq,22:$Vr,25:$Vu,26:$Vv,27:$Vw,28:$Vx,29:$Vy}),o($VC,[2,21],{27:$Vw,28:$Vx,29:$Vy}),o($VC,[2,22],{27:$Vw,28:$Vx,29:$Vy}),o($Vz,[2,23]),o($Vz,[2,24]),o($Vz,[2,25]),o($Vz,[2,26])],
defaultActions: {23:[2,44],24:[2,45],25:[2,1]},
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

	const { Objeto } = __webpack_require__(/*! ../model/xpath/Objeto */ "YKiq");
	const { Tipos } = __webpack_require__(/*! ../model/xpath/Enum */ "MEUw");
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
case 1:// MultiLineComment
break;
case 2:// Declaration XML
break;
case 3:return 37
break;
case 4:return 19
break;
case 5:return 21
break;
case 6:return 20
break;
case 7:return 22
break;
case 8:return 9
break;
case 9:return 10
break;
case 10:return 17
break;
case 11:return 39
break;
case 12:return 38
break;
case 13:return 46
break;
case 14:return 40
break;
case 15:return 14
break;
case 16:return 15
break;
case 17:return 30
break;
case 18:return 31
break;
case 19:return 27
break;
case 20:return 'tk_ancestor2'
break;
case 21:return 47
break;
case 22:return 'tk_attribute'
break;
case 23:return 48
break;
case 24:return 'tk_descendant2'
break;
case 25:return 'tk_descendant'
break;
case 26:return 'tk_following2'
break;
case 27:return 'tk_following'
break;
case 28:return 'tk_namespace' //no se si namespace se refiere al propio nombre de un nodo o si es una palabra reservada. asi que lo agrego por si acaso
break;
case 29:return 'tk_parent'
break;
case 30:return 'tk_preceding2'
break;
case 31:return 'tk_preceding'
break;
case 32:return 'tk_self'
break;
case 33:return 41
break;
case 34:return 42
break;
case 35:return 44
break;
case 36:return 43
break;
case 37:return 7
break;
case 38:return 25
break;
case 39:return 26
break;
case 40:return 28
break;
case 41:return 18
break;
case 42:return 23
break;
case 43:return 24
break;
case 44:return 29
break;
case 45:return 34
break;
case 46: attribute = ''; this.begin("string_doubleq"); 
break;
case 47: attribute += yy_.yytext; 
break;
case 48: attribute += "\""; 
break;
case 49: attribute += "\n"; 
break;
case 50: attribute += " ";  
break;
case 51: attribute += "\t"; 
break;
case 52: attribute += "\\"; 
break;
case 53: attribute += "\'"; 
break;
case 54: attribute += "\r"; 
break;
case 55: yy_.yytext = attribute; this.popState(); return 'tk_attribute_d'; 
break;
case 56: attribute = ''; this.begin("string_singleq"); 
break;
case 57: attribute += yy_.yytext; 
break;
case 58: attribute += "\""; 
break;
case 59: attribute += "\n"; 
break;
case 60: attribute += " ";  
break;
case 61: attribute += "\t"; 
break;
case 62: attribute += "\\"; 
break;
case 63: attribute += "\'"; 
break;
case 64: attribute += "\r"; 
break;
case 65: yy_.yytext = attribute; this.popState(); return 'tk_attribute_s'; 
break;
case 66:return 5
break;
case 67:return 'anything'
break;
case 68: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XPath", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:<\?xml[\s\S\n]*?\?>)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/\/)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:::)/i,/^(?:@)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\()/i,/^(?:\))/i,/^(?:\*)/i,/^(?:ancestor-or-self\b)/i,/^(?:ancestor\b)/i,/^(?:attribute\b)/i,/^(?:child\b)/i,/^(?:descendant-or-self\b)/i,/^(?:descendant\b)/i,/^(?:following-sibling\b)/i,/^(?:following\b)/i,/^(?:namespace\b)/i,/^(?:parent\b)/i,/^(?:preceding-sibling\b)/i,/^(?:preceding\b)/i,/^(?:self\b)/i,/^(?:node\b)/i,/^(?:last\b)/i,/^(?:text\b)/i,/^(?:position\b)/i,/^(?:\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:div\b)/i,/^(?:!=)/i,/^(?:or\b)/i,/^(?:and\b)/i,/^(?:mod\b)/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:$)/i,/^(?:[^><\/]+)/i,/^(?:.)/i],
conditions: {"string_singleq":{"rules":[57,58,59,60,61,62,63,64,65],"inclusive":false},"string_doubleq":{"rules":[47,48,49,50,51,52,53,54,55],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,56,66,67,68],"inclusive":true}}
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
    var source = __webpack_require__(/*! fs */ 1).readFileSync(__webpack_require__(/*! path */ 2).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

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
var Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
var Expresion_1 = __importDefault(__webpack_require__(/*! ../../Expresion/Expresion */ "gajf"));
function Eje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: null };
    var contexto;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    var expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto);
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.length === 0 || root === null)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    retorno.retorno = root; //arreglo de elementos -> el contexto
    return retorno;
}
function getSymbolFromRoot(_nodename, _contexto, _ambito) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}
function getFromCurrent(_id, _contexto, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        var nodes_1 = Array();
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs)
                element.childs.forEach(function (child) {
                    nodes_1.push({ elementos: child });
                });
            else if (element.value)
                nodes_1.push({ textos: element.value });
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_1 };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    elements.push(child);
                });
            }
        }
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        var flag_1 = false;
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.attributes)
                element.attributes.forEach(function (attribute) {
                    if ((_id.id === attribute.id) || (_id.id === "*")) { // En caso de que sea un id ó @*
                        attributes.push(attribute);
                        flag_1 = true;
                    }
                });
            if (flag_1) {
                elements.push(element);
                flag_1 = false;
            }
        }
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el padre
    else if (_id === "..") {
        if (_contexto.atributos) {
            var _loop_1 = function (i) {
                var attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(function (elm) {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            };
            for (var i = 0; i < _contexto.atributos.length; i++) {
                _loop_1(i);
            }
            return elements;
        }
        var _loop_2 = function (i) {
            var element = _contexto[i];
            var dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(function (elm) {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(function (child) {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        };
        for (var i = 0; i < _contexto.length; i++) {
            _loop_2(i);
        }
        return elements;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            elements.push(element);
        }
        return elements;
    }
    // Búsqueda en los hijos por id
    else {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    elements = _ambito.searchSingleNode(_id, child, elements);
                });
            }
        }
        return elements;
    }
}
function getFromRoot(_id, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        var nodes_2 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.childs)
                // element.childs.forEach(child => {
                nodes_2.push({ elementos: element });
            // });
            else if (element.value)
                nodes_2.push({ textos: element.value });
        });
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_2 };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        var flag_2 = false;
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.attributes)
                element.attributes.forEach(function (attribute) {
                    if ((_id.id === attribute.id) || (_id.id === "*")) {
                        flag_2 = true;
                        attributes.push(attribute);
                    }
                });
            if (flag_2) {
                elements.push(element);
                flag_2 = false;
            }
        });
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Búsqueda por id
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id)
                elements.push(element);
        });
        return elements;
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
var Enum_1 = __webpack_require__(/*! ./Enum */ "VvCz");
var Encoding = /** @class */ (function () {
    function Encoding(encoding) {
        this.codes = Enum_1.Codes;
        this.encoding = encoding;
        this.getCode();
    }
    Encoding.prototype.getCode = function () {
        var decl = String(this.encoding).replace(/\s/g, '').toLowerCase();
        var subs = decl.substr(decl.indexOf("encoding=") + 9);
        var code;
        if (subs[0] === "\"") {
            code = subs.substr(1, subs.indexOf("\"", 1) - 1);
        }
        else if (subs[0] === "\'") {
            code = subs.substr(1, subs.indexOf("\'", 1) - 1);
        }
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
        }
    };
    return Encoding;
}());
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
var Hijos_1 = __importDefault(__webpack_require__(/*! ./Hijos */ "iGkZ"));
var Global = /** @class */ (function () {
    function Global(expresiones, ambito) {
        this.expresiones = expresiones;
        this.ambito = ambito;
        Hijos_1.default.exec(expresiones, this.ambito);
    }
    return Global;
}());
exports.Global = Global;


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
var Element = /** @class */ (function () {
    function Element(id_open, attributes, value, childs, line, column, id_close) {
        this.id_open = id_open;
        this.id_close = id_close;
        this.attributes = attributes;
        this.value = value;
        this.childs = childs;
        this.line = line;
        this.column = column;
    }
    Element.prototype.verificateNames = function () {
        if ((this.id_close !== null) && (this.id_open !== this.id_close))
            return "La etiqueta de apertura no coincide con la de cierre.";
        if (this.id_open.replace(/\s/g, '').toLowerCase() === "xml")
            return "No se puede nombrar una etiqueta con las letras XML";
        return "";
    };
    /*
    * Devuelve el HTML para el AST del XML
    * */
    Element.prototype.getXMLTree = function () {
        var str = "";
        str = "<li><a href=''>" + this.id_open + "</a>";
        if (this.attributes == null && this.childs == null && this.value == null) {
            str = str + "</li>";
            return str;
        }
        str = str + "<ul>";
        if (this.attributes != null) {
            str = str + "<li><a href=''>Atributos</a><ul>";
            this.attributes.forEach(function (value) {
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
            this.childs.forEach(function (value) {
                str = str + value.getXMLTree();
            });
            str = str + "</ul></li>\n";
        }
        str = str + "</ul></li>\n";
        return str;
    };
    /*
    * Devuelve el HTML para el CST Ascendente del XML
    * */
    Element.prototype.buildAscendingCst = function () {
        var cst;
        if (this.value != null) {
            cst = "<li><a href=\"\">XML</a><ul>";
            cst = cst + this.getXmlOpenForCST();
            cst = cst + ("\n            <li><a href=\"\">tk_content</a><ul>\n            <li><a href=\"\">" + this.value + "</a></li>\n            </ul></li>\n\n            <li><a href=\"\">tk_open_end_tag</a><ul>\n            <li><a href=\"\">&lt/</a></li>\n            </ul></li>      \n\n            <li><a href=\"\">tk_tag_name</a><ul>\n            <li><a href=\"\">" + this.id_close + "</a></li>\n            </ul></li>  \n\n            <li><a href=\"\">tk_close</a><ul>\n            <li><a href=\"\">&gt</a></li>\n            </ul></li>\n            </ul></li>");
            return cst;
        }
        else if (this.childs != null) {
            var str_1 = "";
            this.childs.forEach(function (value) {
                str_1 = "<li><a href=\"\">CHILDREN</a><ul>\n                    " + str_1 + "\n                    " + value.buildAscendingCst() + "\n                </ul></li>\n                ";
            });
            cst = "<li><a href=\"\">XML</a><ul>" + this.getXmlOpenForCST() + str_1 + ("\n            <li><a href=\"\">tk_open_end_tag</a><ul>\n            <li><a href=\"\">&lt/</a></li>\n            </ul></li>      \n            \n             <li><a href=\"\">tk_tag_name</a><ul>\n            <li><a href=\"\">" + this.id_close + "</a></li>\n            </ul></li>\n            \n            <li><a href=\"\">tk_close</a><ul>\n            <li><a href=\"\">&gt</a></li>\n            </ul></li>\n            \n            </ul></li>");
            return cst;
        }
        else if (this.id_close != null) { //Empty tag
            cst = "<li><a href=\"\">XML</a><ul>";
            cst = cst + this.getXmlOpenForCST();
            cst = cst + ("\n\n            <li><a href=\"\">tk_open_end_tag</a><ul>\n            <li><a href=\"\">&lt/</a></li>\n            </ul></li>      \n\n            <li><a href=\"\">tk_tag_name</a><ul>\n            <li><a href=\"\">" + this.id_close + "</a></li>\n            </ul></li>  \n\n            <li><a href=\"\">tk_close</a><ul>\n            <li><a href=\"\">&gt</a></li>\n            </ul></li>\n            </ul></li>");
            return cst;
        }
        cst = "<li><a href=\"\">XML</a><ul>\n                \n            <li><a href=\"\">tk_open_end_tag</a><ul>\n            <li><a href=\"\">&lt</a></li>\n            </ul></li> \n            \n            <li><a href=\"\">tk_tag_name</a><ul>\n            <li><a href=\"\">" + this.id_open + "</a></li>\n            </ul></li>  \n            \n            " + this.getAttributesCST() + "\n            \n            <li><a href=\"\">tk_bar</a><ul>\n            <li><a href=\"\">/</a></li>\n            </ul></li>\n\n            <li><a href=\"\">tk_close</a><ul>\n            <li><a href=\"\">&gt</a></li>\n            </ul></li>\n            \n            </ul></li>";
        return cst;
    };
    Element.prototype.getXmlOpenForCST = function () {
        var temp = "";
        temp = "<li><a href=\"\">XML_OPEN</a>\n        <ul>\n        \n        <li><a href=\"\">tk_open</a>\n        <ul>\n        <li><a href=\"\">&lt</a></li>\n        </ul>\n        </li>\n        \n        <li><a href=\"\">tk_tag_name</a>\n        <ul>\n        <li><a href=\"\">" + this.id_open + "</a></li>\n        </ul>\n        </li>\n\n        ";
        temp = temp + this.getAttributesCST();
        temp = temp + "\n            <li><a href=\"\">tk_open</a>\n            <ul>\n            <li><a href=\"\">&gt</a></li>\n            </ul>\n            </li>\n            </ul></li>";
        return temp;
    };
    Element.prototype.getAttributesCST = function () {
        if (this.attributes != null) {
            var str_2 = "";
            str_2 = "<li>\n            <a href=\"\">ATTRIBUTE_LIST</a>\n            <ul>\n            <li> \n            <a href=\"\">Empty</a>\n            </li>\n            </ul>\n            </li>\n            ";
            this.attributes.forEach(function (value) {
                str_2 = "<li>\n                <a href=\"\">ATTRIBUTE_LIST</a>\n                <ul>\n                " + str_2 + "\n                " + value.Cst + "\n                </ul>\n                </li>\n                ";
            });
            return str_2;
        }
        return "";
    };
    Object.defineProperty(Element.prototype, "Att_Arr", {
        /*PROPERTIES*/
        set: function (value) {
            this.attributes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "Children", {
        set: function (value) {
            var _this = this;
            if (value == null) {
                return;
            }
            this.childs = value;
            this.childs.forEach(function (value) {
                if (value == null) {
                    return;
                }
                value.Father = _this;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "Close", {
        set: function (value) {
            this.id_close = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "Value", {
        set: function (value) {
            this.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "Father", {
        set: function (value) {
            this.father = value;
        },
        enumerable: false,
        configurable: true
    });
    /*DO NOT INCLUDE*/
    Element.prototype.printTest = function (tab_num) {
        var str = "";
        str = this.getDashes(tab_num) + "Nodo: " + this.id_open + "\t";
        if (this.attributes != null) {
            str = str + "\tAtributos:\t";
            this.attributes.forEach(function (value) {
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
            this.childs.forEach(function (value) {
                value.printTest(tab_num + 1);
            });
        }
    };
    Element.prototype.getDashes = function (num) {
        var a = "";
        for (var i = 0; i < num * 2; i++) {
            a += "-";
        }
        return a;
    };
    return Element;
}());
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
    Tipos["TEXTOS"] = "TEXTOS";
    Tipos["COMBINADO"] = "COMBINADO";
    // Selección
    Tipos["SELECT_FROM_ROOT"] = "SELECT_FROM_ROOT";
    Tipos["SELECT_FROM_CURRENT"] = "SELECT_FROM_CURRENT";
    Tipos["SELECT_CURRENT"] = "SELECT_CURRENT";
    Tipos["SELECT_PARENT"] = "SELECT_PARENT";
    Tipos["SELECT_ATTRIBUTES"] = "SELECT_ATTRIBUTES";
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
    Tipos["FUNCION_LASTE"] = "FUNCION_LASTE";
    Tipos["FUNCION_POSITION"] = "FUNCION_POSITION";
    Tipos["FUNCION_TEXT"] = "FUNCION_TEXT";
    Tipos["FUNCION_NODE"] = "FUNCION_NODE";
    // Combinacional
    Tipos["UNION"] = "UNION";
    // Expresiones
    Tipos["ELEMENTOS"] = "ELEMENTOS";
    Tipos["ATRIBUTOS"] = "ATRIBUTOS";
    // Default
    Tipos["NONE"] = "NONE";
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
var Ambito = /** @class */ (function () {
    function Ambito(_anterior, _tipo) {
        this.anterior = _anterior;
        this.tipo = _tipo;
        this.tablaSimbolos = [];
    }
    Ambito.prototype.isGlobal = function () {
        return this.tipo === "global";
    };
    Ambito.prototype.addSimbolo = function (_simbolo) {
        this.tablaSimbolos.push(_simbolo);
    };
    Ambito.prototype.nodesFunction = function (_element, _nodes) {
        var _this = this;
        _nodes.push({ elementos: _element });
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _nodes = _this.nodesFunction(child, _nodes);
            });
        }
        if (_element.value) {
            _nodes.push({ textos: _element.value });
        }
        return _nodes;
    };
    Ambito.prototype.searchDad = function (_element, _nodename, _line, _column, _elements) {
        var _this = this;
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _elements = _this.searchDad(child, _nodename, _line, _column, _elements);
            });
        }
        if (_nodename === _element.id_open && _element.line == _line && _element.column == _column) {
            _elements.push(_element);
        }
        return _elements;
    };
    Ambito.prototype.searchDadFromAttribute = function (_element, _attribute, _elements) {
        var _this = this;
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _elements = _this.searchDadFromAttribute(child, _attribute, _elements);
            });
        }
        if (_element.attributes) {
            _element.attributes.forEach(function (attr) {
                if (attr.id === _attribute.id && attr.line == _attribute.line && attr.column == _attribute.column) {
                    _elements.push(_element);
                }
            });
        }
        return _elements;
    };
    Ambito.prototype.searchAnyAttributes = function (_element, _array, _elements) {
        var _this = this;
        if (_element.attributes) {
            _element.attributes.forEach(function (attribute) {
                _array.push(attribute);
            });
            _elements.push(_element);
        }
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _array = _this.searchAnyAttributes(child, _array, _elements).atributos;
            });
        }
        return { atributos: _array, elementos: _elements };
    };
    Ambito.prototype.searchAttributesFromCurrent = function (_element, _id, _array, _elements) {
        var _this = this;
        var flag = false;
        if (_element.attributes) {
            _element.attributes.forEach(function (attribute) {
                if (attribute.id === _id) {
                    _array.push(attribute);
                    flag = true;
                }
            });
            if (flag) {
                _elements.push(_element);
                flag = false;
            }
        }
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _array = _this.searchAttributesFromCurrent(child, _id, _array, _elements).atributos;
            });
        }
        return { atributos: _array, elementos: _elements };
    };
    Ambito.prototype.searchSingleNode = function (_nodename, _element, _array) {
        if (_nodename === _element.id_open) {
            _array.push(_element);
        }
        return _array;
    };
    Ambito.prototype.searchNodes = function (_nodename, _element, _array) {
        var _this = this;
        if ((_nodename === _element.id_open) || (_nodename === "*")) {
            _array.push(_element);
        }
        if (_element.childs) {
            _element.childs.forEach(function (child) {
                _array = _this.searchNodes(_nodename, child, _array);
            });
        }
        return _array;
    };
    Ambito.prototype.getGlobal = function () {
        var e;
        for (e = this; e != null; e = e.anterior) {
            if (e.anterior === null)
                return e;
        }
        return null;
    };
    // Métodos para obtener la tabla de símbolos
    Ambito.prototype.getArraySymbols = function () {
        var _this = this;
        var simbolos = [];
        try {
            this.tablaSimbolos.forEach(function (element) {
                if (element.attributes || element.childs) {
                    var dad = _this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(dad);
                    if (element.attributes) {
                        element.attributes.forEach(function (attribute) {
                            simbolos.push(_this.createSymbolAttribute(attribute, element.id_open));
                        });
                    }
                    if (element.childs) {
                        simbolos.concat(_this.toRunTree(simbolos, element.childs, dad.id));
                    }
                }
                else {
                    var symb = _this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(symb);
                }
            });
            return simbolos;
        }
        catch (error) {
            console.log(error);
            return simbolos;
        }
    };
    Ambito.prototype.toRunTree = function (_symbols, _array, _father) {
        var _this = this;
        _array.forEach(function (element) {
            if (element.attributes || element.childs) {
                var dad = _this.createSymbolElement(element, _father);
                _symbols.push(dad);
                if (element.attributes) {
                    element.attributes.forEach(function (attribute) {
                        _symbols.push(_this.createSymbolAttribute(attribute, _father + "->" + element.id_open));
                    });
                }
                if (element.childs) {
                    var concat = _father + ("->" + dad.id);
                    _symbols.concat(_this.toRunTree(_symbols, element.childs, concat));
                }
            }
            else {
                var symb = _this.createSymbolElement(element, _father);
                _symbols.push(symb);
            }
        });
        return _symbols;
    };
    Ambito.prototype.createSymbolElement = function (_element, _entorno) {
        var type = (_element.id_close === null ? 'Tag simple' : 'Tag doble');
        var symb = {
            id: _element.id_open,
            value: _element.value,
            tipo: type,
            entorno: _entorno,
            linea: _element.line,
            columna: _element.column
        };
        return symb;
    };
    Ambito.prototype.createSymbolAttribute = function (_attribute, _entorno) {
        var symb = {
            id: _attribute.id,
            value: _attribute.value,
            tipo: "Atributo",
            entorno: _entorno,
            linea: _attribute.line,
            columna: _attribute.column
        };
        return symb;
    };
    return Ambito;
}());
exports.Ambito = Ambito;


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
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! file-saver */ "Iab2");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.service */ "F5nt");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @materia-ui/ngx-monaco-editor */ "0LvA");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");






function AppComponent_tr_99_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "th", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const i_r4 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](i_r4 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.tipo);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.entorno);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.linea);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r3.columna);
} }
function AppComponent_tr_121_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "th", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const i_r6 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](i_r6 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r5.tipo);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r5.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r5.origen);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r5.linea);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r5.columna);
} }
class AppComponent {
    constructor(appService) {
        this.appService = appService;
        this.EditorOptions = {
            theme: "vs-dark",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 16,
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
            fontSize: 16,
            minimap: {
                enabled: true
            },
            language: 'xml'
        };
        this.entrada = '';
        this.consulta = '';
        this.salida = '';
        this.fname = '';
        this.simbolos = [];
        this.errores = [];
    }
    newTab() {
        window.open("/tytusx-G23", "_blank");
    }
    closeTab() {
        window.close();
    }
    onSubmit() {
        let grammar_value = document.getElementById('grammar_selector').value;
        if (this.entrada != "" && this.consulta != "") {
            const x = {
                xml: this.entrada,
                query: this.consulta,
                grammar: Number(grammar_value) // gramática 1=ascendente, 2=descendente
            };
            // llamo a la función compile que devuelve un objeto de retorno
            let data = __webpack_require__(/*! ../js/routes/compile */ "i+6F").compile(x);
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
        if (this.entrada != "") {
            const x = { "input": this.entrada };
            this.appService.getAST(x).subscribe(data => {
                Object(file_saver__WEBPACK_IMPORTED_MODULE_0__["saveAs"])(data, "AST");
                this.salida = "AST has been generated!";
                console.log('AST received!');
            }, error => {
                console.log('There was an error :(', error);
                this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el AST.";
            });
        }
        else
            alert("Entrada vacía. No se puede generar el AST.");
    }
    getCST() {
        this.simbolos = [];
        this.errores = [];
        if (this.entrada != "") {
            const x = { "input": this.entrada };
            this.appService.getCST(x).subscribe(data => {
                Object(file_saver__WEBPACK_IMPORTED_MODULE_0__["saveAs"])(data, "CST");
                this.salida = "CST has been generated!";
                console.log('CST received!');
            }, error => {
                console.log('There was an error :(', error);
                this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el CST.";
            });
        }
        else
            alert("Entrada vacía. No se puede generar el CST.");
    }
    getDAG() {
        this.simbolos = [];
        this.errores = [];
        if (this.entrada != "") {
            const x = { "input": this.entrada };
            this.appService.getDAG(x).subscribe(data => {
                Object(file_saver__WEBPACK_IMPORTED_MODULE_0__["saveAs"])(data, "DAG");
                this.salida = "DAG has been generated!";
                console.log('DAG received!');
            }, error => {
                console.log('There was an error :(', error);
                this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el DAG.";
            });
        }
        else
            alert("Entrada vacía. No se puede generar el DAG.");
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
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_app_service__WEBPACK_IMPORTED_MODULE_2__["AppService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 126, vars: 10, consts: [[1, "container-fluid", "title", "pt-2", "pb-1"], ["role", "toolbar", 1, "btn-toolbar"], [1, "mb-2", "btn-group"], [1, "dropdown"], ["type", "button", "id", "dropdownMenu", "data-toggle", "dropdown", "aria-haspopup", "flase", "aria-expanded", "false", 1, "btn", "btn-dark", "rounded-0"], [1, "dropdown-menu", "rounded-0", "bg-dark"], ["type", "button", 1, "dropdown-item", "text-white", "item", 3, "click"], ["id", "fileInput1", "type", "file", "accept", ".xml", 2, "display", "none", 3, "ngModel", "change", "ngModelChange"], ["id", "fileInput2", "type", "file", 2, "display", "none", 3, "ngModel", "change", "ngModelChange"], ["type", "button", 1, "btn", "btn-dark", "rounded-0", 3, "click"], ["type", "button", "id", "dropdownMenu", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "btn", "btn-dark", "rounded-0", "dropdown-toggle"], ["role", "group", 1, "btn-group", "sel_g"], ["id", "grammar_selector", 1, "form-select", "btn", "btn-dark", "rounded-0"], ["disabled", ""], ["selected", "", "value", "1"], ["value", "2"], [1, "container-fluid", "px-5", "pt-2"], ["novalidate", "", 1, "mb-4", 3, "ngSubmit"], ["iForm", "ngForm"], [1, "row", "mb-5", "file-editors"], [1, "col-lg-6", "col-sm-12"], [1, "my-0", "text-white", "subtitulo"], ["id", "entrada", "name", "entrada", 1, "codebox", 3, "options", "ngModel", "ngModelChange"], ["id", "consulta", "name", "consulta", 1, "codebox", 3, "options", "ngModel", "ngModelChange"], [1, "row", "text-center"], [1, "col-12"], ["type", "submit", 1, "btn", "btn-outline-light", "btn-lg"], [1, "fas", "fa-play-circle"], [1, "row", "mb-5", "file-console"], ["id", "salida", "name", "salida", 1, "console", 3, "options", "ngModel", "ngModelChange"], [1, "row", "my-5"], [1, "my-1", "text-white", "subtitulo"], [1, "table", "table-striped", "table-dark"], ["scope", "col"], ["scope", "col", 1, "text-center"], [4, "ngFor", "ngForOf"], [1, "mt-2", "mb-1", "text-white", "subtitulo"], [1, "text-center", "text-lg-start"], [1, "text-center", "p-3", 2, "background-color", "rgba(0, 0, 0, 0.2)"], [1, "foot", "my-0"], ["scope", "row"], [1, "text-center"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "TytusX");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " Abrir ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_9_listener() { return ctx.openDialog(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function AppComponent_Template_input_change_11_listener($event) { return ctx.readFile($event, 1); })("ngModelChange", function AppComponent_Template_input_ngModelChange_11_listener($event) { return ctx.fname = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_12_listener() { return ctx.openDialog(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function AppComponent_Template_input_change_14_listener($event) { return ctx.readFile($event, 2); })("ngModelChange", function AppComponent_Template_input_ngModelChange_14_listener($event) { return ctx.fname = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Guardar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_19_listener() { return ctx.saveFile(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_21_listener() { return ctx.saveFile(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_23_listener() { return ctx.newTab(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Nueva pesta\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_25_listener() { return ctx.closeTab(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Cerrar pesta\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, " Limpiar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_31_listener() { return ctx.cleanEditor(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_33_listener() { return ctx.cleanEditor(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "XPath");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, " Reportes ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_39_listener() { return ctx.getAST(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, "AST");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_41_listener() { return ctx.getCST(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](42, "CST");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_43_listener() { return ctx.getDAG(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](44, "DAG");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](48, "Seleccione gram\u00E1tica");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](50, "Ascendente");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](52, "Descendente");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](53, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "form", 17, 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function AppComponent_Template_form_ngSubmit_54_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](56, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](58, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](59, "Entrada XML");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "ngx-monaco-editor", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_60_listener($event) { return ctx.entrada = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](61, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](63, "Editor de consultas");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "ngx-monaco-editor", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_64_listener($event) { return ctx.consulta = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](68, "i", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](69, " COMPILAR");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](70, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](72, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](73, "Consola de salida");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](74, "ngx-monaco-editor", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_ngx_monaco_editor_ngModelChange_74_listener($event) { return ctx.salida = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](75, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](76, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](77, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](79, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](80, "Tabla de s\u00EDmbolos");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](81, "table", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](82, "thead");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](83, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](84, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](85, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](86, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](87, "Id");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](88, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](89, "Tipo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](90, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](91, "Contenido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](92, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](93, "\u00C1mbito");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](94, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](95, "Fila");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](96, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](97, "Columna");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](98, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](99, AppComponent_tr_99_Template, 15, 7, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](100, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](101, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](102, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](103, "p", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](104, "Tabla de errores");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](105, "table", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](106, "thead");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](107, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](108, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](109, "#");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](110, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](111, "Tipo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](112, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](113, "Error");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](114, "th", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](115, "Origen");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](116, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](117, "Fila");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](118, "th", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](119, "Columna");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](120, "tbody");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](121, AppComponent_tr_121_Template, 13, 6, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](122, "footer", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](123, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](124, "p", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](125, " \u00A9 2021 Grupo 23 - Organizaci\u00F3n de Lenguajes y Compiladores 2 - TytusX ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.fname);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.fname);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](46);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("options", ctx.EditorOptions)("ngModel", ctx.entrada);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("options", ctx.EditorOptions)("ngModel", ctx.consulta);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("options", ctx.ConsoleOptions)("ngModel", ctx.salida);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.simbolos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.errores);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵangular_packages_forms_forms_z"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgForm"], _materia_ui_ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_4__["MonacoEditorComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"]], styles: ["*[_ngcontent-%COMP%]:not(i) {\n    font-family: 'Varela Round', sans-serif;\n}\n\n.title[_ngcontent-%COMP%] {\n    background-color: #c1502e;\n    font-family: 'Varela Round', sans-serif;\n}\n\n.tbar[_ngcontent-%COMP%] {\n    height: 38px;\n}\n\n.file-editors[_ngcontent-%COMP%] {\n    height: 415px;\n}\n\n.file-console[_ngcontent-%COMP%] {\n    height: 375px;\n}\n\n.subtitulo[_ngcontent-%COMP%] {\n    font-size: large;\n}\n\n.foot[_ngcontent-%COMP%] {\n    color: lightgrey;\n}\n\nhr[_ngcontent-%COMP%] {\n    border-width: 0.13em;\n    border-color: gray;\n}\n\n.fc[_ngcontent-%COMP%]:first-letter {\n    text-transform: capitalize\n}\n\n.item[_ngcontent-%COMP%]:hover {\n    background-color: #292b2c;\n}\n\n.dropdown-menu[_ngcontent-%COMP%] {\n    padding: 0% !important;\n}\n\n.sel_g[_ngcontent-%COMP%] {\n    position: absolute;\n    right: 0%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksdUNBQXVDO0FBQzNDOztBQUVBO0lBQ0kseUJBQXlCO0lBQ3pCLHVDQUF1QztBQUMzQzs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksYUFBYTtBQUNqQjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLG9CQUFvQjtJQUNwQixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSTtBQUNKOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7QUFDYiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIio6bm90KGkpIHtcbiAgICBmb250LWZhbWlseTogJ1ZhcmVsYSBSb3VuZCcsIHNhbnMtc2VyaWY7XG59XG5cbi50aXRsZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2MxNTAyZTtcbiAgICBmb250LWZhbWlseTogJ1ZhcmVsYSBSb3VuZCcsIHNhbnMtc2VyaWY7XG59XG5cbi50YmFyIHtcbiAgICBoZWlnaHQ6IDM4cHg7XG59XG5cbi5maWxlLWVkaXRvcnMge1xuICAgIGhlaWdodDogNDE1cHg7XG59XG5cbi5maWxlLWNvbnNvbGUge1xuICAgIGhlaWdodDogMzc1cHg7XG59XG5cbi5zdWJ0aXR1bG8ge1xuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XG59XG5cbi5mb290IHtcbiAgICBjb2xvcjogbGlnaHRncmV5O1xufVxuXG5ociB7XG4gICAgYm9yZGVyLXdpZHRoOiAwLjEzZW07XG4gICAgYm9yZGVyLWNvbG9yOiBncmF5O1xufVxuXG4uZmM6Zmlyc3QtbGV0dGVyIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZVxufVxuXG4uaXRlbTpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzI5MmIyYztcbn1cblxuLmRyb3Bkb3duLW1lbnUge1xuICAgIHBhZGRpbmc6IDAlICFpbXBvcnRhbnQ7XG59XG5cbi5zZWxfZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwJTtcbn0iXX0= */"] });


/***/ }),

/***/ "TxV8":
/*!***************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Logica.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function Logica(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.LOGICA_AND:
            return and(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.LOGICA_OR:
            return or(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}
function and(_opIzq, _opDer, _ambito) {
}
function or(_opIzq, _opDer, _ambito) {
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
    Codes[Codes["UTF8"] = 0] = "UTF8";
    Codes[Codes["ASCII"] = 1] = "ASCII";
    Codes[Codes["ISO8859_1"] = 2] = "ISO8859_1";
    Codes[Codes["INVALID"] = 3] = "INVALID";
})(Codes = exports.Codes || (exports.Codes = {}));


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
var Enum_1 = __webpack_require__(/*! ./Enum */ "MEUw");
var Objeto = /** @class */ (function () {
    function Objeto() {
    }
    Objeto.prototype.newValue = function (_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newArithmetic = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "+":
                tipo = Enum_1.Tipos.OPERACION_SUMA;
                break;
            case "-":
                tipo = Enum_1.Tipos.OPERACION_RESTA;
                break;
            case "*":
                tipo = Enum_1.Tipos.OPERACION_MULTIPLICACION;
                break;
            case "/":
                tipo = Enum_1.Tipos.OPERACION_DIVISION;
                break;
            case "%":
                tipo = Enum_1.Tipos.OPERACION_MODULO;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newRelation = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "==":
                tipo = Enum_1.Tipos.RELACIONAL_IGUAL;
                break;
            case "!=":
                tipo = Enum_1.Tipos.RELACIONAL_DIFERENTE;
                break;
            case "<":
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
                break;
            case "<=":
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
                break;
            case ">":
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
                break;
            case ">=":
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newLogic = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "||":
                tipo = Enum_1.Tipos.LOGICA_OR;
                break;
            case "&&":
                tipo = Enum_1.Tipos.LOGICA_AND;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newNodename = function (_nodename, _linea, _columna) {
        return {
            nodename: _nodename,
            tipo: Enum_1.Tipos.NODENAME,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newAxis = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_ROOT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newDoubleAxis = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_CURRENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newCurrent = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_CURRENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newParent = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_PARENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newAttribute = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_ATTRIBUTES,
            linea: _linea,
            columna: _columna
        };
    };
    return Objeto;
}());
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,7],$V1=[1,6],$V2=[1,11],$V3=[11,13],$V4=[1,16],$V5=[2,6,8],$V6=[1,25],$V7=[1,27],$V8=[1,28],$V9=[1,29],$Va=[1,26],$Vb=[2,8],$Vc=[8,9,13,18,19,21],$Vd=[9,11,13];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"tk_declaration_xml":4,"ROOT":5,"EOF":6,"XML":7,"tk_open":8,"tk_id":9,"ATTR":10,"tk_close":11,"CHILD":12,"tk_bar":13,"CONTENT":14,"ATTR_P":15,"tk_equal":16,"TK_ATTR":17,"tk_attribute_d":18,"tk_attribute_s":19,"PROP":20,"anything":21,"$accept":0,"$end":1},
terminals_: {2:"error",4:"tk_declaration_xml",6:"EOF",8:"tk_open",9:"tk_id",11:"tk_close",13:"tk_bar",16:"tk_equal",18:"tk_attribute_d",19:"tk_attribute_s",21:"anything"},
productions_: [0,[3,3],[3,2],[5,2],[5,1],[7,9],[7,9],[7,5],[7,8],[7,2],[7,2],[10,1],[10,0],[15,4],[15,3],[17,1],[17,1],[12,2],[12,1],[14,2],[14,1],[20,1],[20,1],[20,1],[20,1],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

		encoding = new Encoding($$[$0-2]);
		if (encoding.encoding === encoding.codes.INVALID ) {
			errors.push({ tipo: "Léxico", error: "La codificación del XML no es válida.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); return { ast: null, errors: errors };
		}
		ast = { ast: $$[$0-1], encoding: encoding,  errors: errors };
		errors = [];
		return ast;
	
break;
case 2:
 errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); return { ast: null, errors: errors }; 
break;
case 3:
 if ($$[$0-1]!==null) { $$[$0].push($$[$0-1]); this.$=$$[$0]; } else { this.$=null; } 
break;
case 4: case 18:
 if ($$[$0]!==null) { this.$=[$$[$0]]; } else { this.$=[]; } 
break;
case 5:

			tag = new Element($$[$0-7], $$[$0-6], null, $$[$0-4], this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				tag.childs.forEach(child => {
					child.father = $$[$0-7];
            	});
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 6:

			tag = new Element($$[$0-7], $$[$0-6], $$[$0-4].val, null, this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 7:

			tag = new Element($$[$0-3], $$[$0-2], null, null, this._$.first_line, this._$.first_column+1, null);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-3].first_line, columna: _$[$0-3].first_column+1 });
				this.$ = null;
			}
		
break;
case 8:

			tag = new Element($$[$0-6], $$[$0-5], null, null, this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 9: case 10:
 errors.push({ tipo: "Sintáctico", error: "La etiqueta no fue declarada correctamente.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); this.$ = null; 
break;
case 11: case 15: case 16:
 this.$=$$[$0]; 
break;
case 12:
 this.$=null; 
break;
case 13:

		attr = new Atributo($$[$0-3], $$[$0-1], this._$.first_line, this._$.first_column+1);
		$$[$0].push(attr);
		this.$=$$[$0];
	
break;
case 14:

		attr = new Atributo($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
		this.$=[attr];
	
break;
case 17:
 if ($$[$0]!==null) { $$[$0-1].push($$[$0]); } this.$=$$[$0-1]; 
break;
case 19:

		if ($$[$0-1].tipo !== $$[$0].tipo) {
			$$[$0].val=$$[$0-1].val+$$[$0].val;
		}
		else {
			$$[$0].val=$$[$0-1].val+' '+$$[$0].val;
		}
		this.$={tipo:$$[$0-1].tipo, val:$$[$0].val};
	
break;
case 20:

		this.$={tipo:$$[$0].tipo, val:$$[$0].val};
	
break;
case 21:
 this.$={tipo:1, val:$$[$0]}; 
break;
case 22:
 this.$={tipo:2, val:$$[$0]}; 
break;
case 23:
 this.$={tipo:3, val:$$[$0]}; 
break;
case 24:
 this.$={tipo:4, val:$$[$0]}; 
break;
case 25:
 this.$={tipo:5, val:$$[$0]}; 
break;
}
},
table: [{2:[1,3],3:1,4:[1,2]},{1:[3]},{2:$V0,5:4,7:5,8:$V1},{6:[1,8]},{6:[1,9]},{2:$V0,5:10,6:[2,4],7:5,8:$V1},{9:$V2},{8:[1,13],11:[1,12]},{1:[2,2]},{1:[2,1]},{6:[2,3]},o($V3,[2,12],{10:14,15:15,9:$V4}),o($V5,[2,9]),o($V5,[2,10]),{11:[1,17],13:[1,18]},o($V3,[2,11]),{16:[1,19]},{2:$V0,7:23,8:[1,22],9:$V6,12:20,13:$V7,14:21,18:$V8,19:$V9,20:24,21:$Va},{11:[1,30]},{17:31,18:[1,32],19:[1,33]},{2:$V0,7:35,8:[1,34]},{8:[1,36]},{9:$V2,13:[1,37]},o($Vb,[2,18]),{8:[2,20],9:$V6,13:$V7,14:38,18:$V8,19:$V9,20:24,21:$Va},o($Vc,[2,21]),o($Vc,[2,22]),o($Vc,[2,23]),o($Vc,[2,24]),o($Vc,[2,25]),o($V5,[2,7]),o($V3,[2,14],{15:39,9:$V4}),o($Vd,[2,15]),o($Vd,[2,16]),{9:$V2,13:[1,40]},o($Vb,[2,17]),{13:[1,41]},{9:[1,42]},{8:[2,19]},o($V3,[2,13]),{9:[1,43]},{9:[1,44]},{11:[1,45]},{11:[1,46]},{11:[1,47]},o($V5,$Vb),o($V5,[2,5]),o($V5,[2,6])],
defaultActions: {8:[2,2],9:[2,1],10:[2,3],38:[2,19]},
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
case 1:// MultiLineComment
break;
case 2:return 4
break;
case 3:return 8
break;
case 4:return 11
break;
case 5:return 13
break;
case 6:return 16
break;
case 7:return 9
break;
case 8: attribute = ''; this.begin("string_doubleq"); 
break;
case 9: attribute += yy_.yytext; 
break;
case 10: attribute += "\""; 
break;
case 11: attribute += "\n"; 
break;
case 12: attribute += " ";  
break;
case 13: attribute += "\t"; 
break;
case 14: attribute += "\\"; 
break;
case 15: attribute += "\'"; 
break;
case 16: attribute += "\r"; 
break;
case 17: yy_.yytext = attribute; this.popState(); return 18; 
break;
case 18: attribute = ''; this.begin("string_singleq"); 
break;
case 19: attribute += yy_.yytext; 
break;
case 20: attribute += "\""; 
break;
case 21: attribute += "\n"; 
break;
case 22: attribute += " ";  
break;
case 23: attribute += "\t"; 
break;
case 24: attribute += "\\"; 
break;
case 25: attribute += "\'"; 
break;
case 26: attribute += "\r"; 
break;
case 27: yy_.yytext = attribute; this.popState(); return 19; 
break;
case 28:return 6
break;
case 29:return 21
break;
case 30: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:<\?xml[\s\S\n]*?\?>)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:$)/i,/^(?:[^><]+)/i,/^(?:.)/i],
conditions: {"string_singleq":{"rules":[19,20,21,22,23,24,25,26,27],"inclusive":false},"string_doubleq":{"rules":[9,10,11,12,13,14,15,16,17],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,18,28,29,30],"inclusive":true}}
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
    var source = __webpack_require__(/*! fs */ 1).readFileSync(__webpack_require__(/*! path */ 2).normalize(args[1]), "utf8");
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

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = __webpack_require__(/*! ../../../model/xpath/Enum */ "MEUw");
// import Aritmetica from "./Operators/Aritmetica";
var Relacional_1 = __importDefault(__webpack_require__(/*! ./Operators/Relacional */ "r8U1"));
var Logica_1 = __importDefault(__webpack_require__(/*! ./Operators/Logica */ "TxV8"));
function Expresion(_expresion, _ambito, _contexto) {
    var tipo = _expresion.tipo;
    if (tipo === Enum_1.Tipos.NODENAME) {
        // let expresion = _ambito.getSimboloFromRoot(_expresion.nodename, _contexto);
        return { valor: _expresion.nodename, tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_CURRENT) {
        return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_ATTRIBUTES) {
        var valor = { id: _expresion.expresion, tipo: "@" };
        return { valor: valor, tipo: Enum_1.Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.ASTERISCO) {
        return { valor: "*", tipo: Enum_1.Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Enum_1.Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.STRING || tipo === Enum_1.Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Enum_1.Tipos.OPERACION_SUMA || tipo === Enum_1.Tipos.OPERACION_RESTA || tipo === Enum_1.Tipos.OPERACION_MULTIPLICACION
        || tipo === Enum_1.Tipos.OPERACION_DIVISION || tipo === Enum_1.Tipos.OPERACION_MODULO || tipo === Enum_1.Tipos.OPERACION_NEGACION_UNARIA) {
        var Aritmetica = __webpack_require__(/*! ./Operators/Aritmetica */ "qbRd");
        return Aritmetica(_expresion, _ambito);
    }
    else if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        return Relacional_1.default(_expresion, _ambito);
    }
    else if (tipo === Enum_1.Tipos.LOGICA_AND || tipo === Enum_1.Tipos.LOGICA_OR) {
        return Logica_1.default(_expresion, _ambito);
    }
    else {
        console.log(_expresion, "SSSSSSSS");
        return { err: "Error: Expresi\u00F3n no procesada.\n", linea: _expresion.linea, columna: _expresion.columna };
    }
}
module.exports = Expresion;


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
var Bloque_1 = __importDefault(__webpack_require__(/*! ../controller/xpath/Instruccion/Bloque */ "8Ym7"));
var Ambito_1 = __webpack_require__(/*! ../model/xml/Ambito/Ambito */ "QFP7");
var Global_1 = __webpack_require__(/*! ../model/xml/Ambito/Global */ "IRxg");
function compile(req) {
    try {
        // Datos de la petición desde Angular
        var xml = req.xml;
        var xPath = req.query;
        var grammar_selected = req.grammar;
        // Gramáticas a usarse según la selección: 1=ascendente, 2=descendente
        var parser_xml = void 0, parser_xPath = void 0;
        switch (grammar_selected) {
            case 1:
                parser_xml = __webpack_require__(/*! ../analyzers/xml_up */ "nxic");
                parser_xPath = __webpack_require__(/*! ../analyzers/xpath_up */ "9ArA");
                break;
            case 2:
                parser_xml = __webpack_require__(/*! ../analyzers/xml_down */ "cW0F");
                parser_xPath = "require('../analyzers/xpath_down);";
                break;
        }
        // Análisis de XML
        var xml_ast = parser_xml.parse(xml);
        if (xml_ast === true || xml_ast.errors.length > 0 || xml_ast.ast === null) {
            var output_1 = {
                arreglo_simbolos: [],
                arreglo_errores: (xml_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "El documento XML contiene errores para analizar.\nIntente de nuevo."
            };
            return output_1;
        }
        var xml_parse = xml_ast.ast;
        var global_1 = new Ambito_1.Ambito(null, "global");
        var cadena = new Global_1.Global(xml_parse, global_1);
        var simbolos = cadena.ambito.getArraySymbols();
        // Análisis de XPath
        var xPath_ast = parser_xPath.parse(xPath);
        console.log(xPath_ast, 99);
        if (xPath_ast === true || xPath_ast.errors.length > 0 || xPath_ast.ast === null) {
            var output_2 = {
                arreglo_simbolos: [],
                arreglo_errores: (xPath_ast === true ? [{ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta.", origen: "XPath", linea: 1, columna: 1 }] : xml_ast.errors),
                output: "La consulta contiene errores para analizar.\nIntente de nuevo."
            };
            return output_2;
        }
        var xPath_parse = xPath_ast.ast;
        // console.log(xPath_parse, 88)
        var bloque = Bloque_1.default(xPath_parse, cadena.ambito);
        console.log(bloque, 88);
        console.log("Salida:", xPath_parse);
        var output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: bloque.err ? [bloque.err] : [],
            output: bloque.cadena ? bloque.cadena : bloque.err
        };
        return output;
    }
    catch (error) {
        console.log(error);
        var output = {
            arreglo_simbolos: [],
            arreglo_errores: [{ tipo: "Desconocido", error: "Error en tiempo de ejecución.", origen: "", linea: "", columna: "" }],
            output: String(error)
        };
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

var Ambito_1 = __webpack_require__(/*! ./Ambito */ "QFP7");
function exec(_expresiones, _ambito) {
    _expresiones.forEach(function (element) {
        if (element.childs) {
            var nuevoAmbito = new Ambito_1.Ambito(_ambito, "hijo");
            exec(element.childs, nuevoAmbito);
        }
        _ambito.addSimbolo(element);
    });
}
module.exports = { exec: exec };


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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,7],$V1=[1,6],$V2=[2,6,8],$V3=[1,11],$V4=[11,13],$V5=[1,26],$V6=[1,28],$V7=[1,29],$V8=[1,30],$V9=[1,27],$Va=[1,34],$Vb=[1,35],$Vc=[2,8],$Vd=[8,9,13,18,19,21],$Ve=[9,11,13];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"tk_declaration_xml":4,"ROOT":5,"EOF":6,"XML":7,"tk_open":8,"tk_id":9,"ATTR":10,"tk_close":11,"CHILD":12,"tk_bar":13,"CONTENT":14,"ATTR_P":15,"tk_equal":16,"TK_ATTR":17,"tk_attribute_d":18,"tk_attribute_s":19,"PROP":20,"anything":21,"$accept":0,"$end":1},
terminals_: {2:"error",4:"tk_declaration_xml",6:"EOF",8:"tk_open",9:"tk_id",11:"tk_close",13:"tk_bar",16:"tk_equal",18:"tk_attribute_d",19:"tk_attribute_s",21:"anything"},
productions_: [0,[3,3],[3,2],[5,2],[5,1],[7,9],[7,9],[7,5],[7,8],[7,2],[7,2],[10,1],[10,0],[15,4],[15,3],[17,1],[17,1],[12,2],[12,1],[14,2],[14,1],[20,1],[20,1],[20,1],[20,1],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

		encoding = new Encoding($$[$0-2]);
		if (encoding.encoding === encoding.codes.INVALID ) {
			errors.push({ tipo: "Léxico", error: "La codificación del XML no es válida.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); return { ast: null, errors: errors };
		}
		ast = { ast: $$[$0-1], encoding: encoding,  errors: errors };
		errors = [];
		return ast;
	
break;
case 2:
 errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); return { ast: null, errors: errors }; 
break;
case 3:
 if ($$[$0]!==null) { $$[$0-1].push($$[$0]); this.$=$$[$0-1]; } else { this.$=null; } 
break;
case 4: case 18:
 if ($$[$0]!==null) { this.$=[$$[$0]]; } else { this.$=[]; } 
break;
case 5:

			tag = new Element($$[$0-7], $$[$0-6], null, $$[$0-4], this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				tag.childs.forEach(child => {
					child.father = {id: $$[$0-7], line: tag.line, column: tag.column};
            	});
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 6:

			tag = new Element($$[$0-7], $$[$0-6], $$[$0-4].val, null, this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 7:

			tag = new Element($$[$0-3], $$[$0-2], null, null, this._$.first_line, this._$.first_column+1, null);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-3].first_line, columna: _$[$0-3].first_column+1 });
				this.$ = null;
			}
		
break;
case 8:

			tag = new Element($$[$0-6], $$[$0-5], null, null, this._$.first_line, this._$.first_column+1, $$[$0-1]);
            hasConflict = tag.verificateNames();
			if (hasConflict === "") {
				this.$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: hasConflict, origen: "XML", linea: _$[$0-1].first_line, columna: _$[$0-1].first_column+1 });
				this.$ = null;
			}
		
break;
case 9: case 10:
 errors.push({ tipo: "Sintáctico", error: "La etiqueta no fue declarada correctamente.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); this.$ = null; 
break;
case 11: case 15: case 16:
 this.$=$$[$0]; 
break;
case 12:
 this.$=null; 
break;
case 13:

		attr = new Atributo($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
		$$[$0-3].push(attr);
		this.$=$$[$0-3];
	
break;
case 14:

		attr = new Atributo($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
		this.$=[attr];
	
break;
case 17:
 if ($$[$0]!==null) { $$[$0-1].push($$[$0]); } this.$=$$[$0-1]; 
break;
case 19:

		if ($$[$0].tipo !== $$[$0-1].tipo) {
			$$[$0-1].val+=$$[$0].val;
		}
		else {
			$$[$0-1].val+=' '+$$[$0].val;
		}
		this.$={tipo:$$[$0].tipo, val:$$[$0-1].val};
	
break;
case 20:

		this.$={tipo:$$[$0].tipo, val:$$[$0].val};
	
break;
case 21:
 this.$={tipo:1, val:$$[$0]}; 
break;
case 22:
 this.$={tipo:2, val:$$[$0]}; 
break;
case 23:
 this.$={tipo:3, val:$$[$0]}; 
break;
case 24:
 this.$={tipo:4, val:$$[$0]}; 
break;
case 25:
 this.$={tipo:5, val:$$[$0]}; 
break;
}
},
table: [{2:[1,3],3:1,4:[1,2]},{1:[3]},{2:$V0,5:4,7:5,8:$V1},{6:[1,8]},{2:$V0,6:[1,9],7:10,8:$V1},o($V2,[2,4]),{9:$V3},{8:[1,13],11:[1,12]},{1:[2,2]},{1:[2,1]},o($V2,[2,3]),o($V4,[2,12],{10:14,15:15,9:[1,16]}),o($V2,[2,9]),o($V2,[2,10]),{11:[1,17],13:[1,18]},o($V4,[2,11],{9:[1,19]}),{16:[1,20]},{2:$V0,7:24,8:[1,23],9:$V5,12:21,13:$V6,14:22,18:$V7,19:$V8,20:25,21:$V9},{11:[1,31]},{16:[1,32]},{17:33,18:$Va,19:$Vb},{2:$V0,7:37,8:[1,36]},{8:[1,38],9:$V5,13:$V6,18:$V7,19:$V8,20:39,21:$V9},{9:$V3,13:[1,40]},o($Vc,[2,18]),o($Vd,[2,20]),o($Vd,[2,21]),o($Vd,[2,22]),o($Vd,[2,23]),o($Vd,[2,24]),o($Vd,[2,25]),o($V2,[2,7]),{17:41,18:$Va,19:$Vb},o($Ve,[2,14]),o($Ve,[2,15]),o($Ve,[2,16]),{9:$V3,13:[1,42]},o($Vc,[2,17]),{13:[1,43]},o($Vd,[2,19]),{9:[1,44]},o($Ve,[2,13]),{9:[1,45]},{9:[1,46]},{11:[1,47]},{11:[1,48]},{11:[1,49]},o($V2,$Vc),o($V2,[2,5]),o($V2,[2,6])],
defaultActions: {8:[2,2],9:[2,1]},
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
case 1:// MultiLineComment
break;
case 2:return 4
break;
case 3:return 8
break;
case 4:return 11
break;
case 5:return 13
break;
case 6:return 16
break;
case 7:return 9
break;
case 8: attribute = ''; this.begin("string_doubleq"); 
break;
case 9: attribute += yy_.yytext; 
break;
case 10: attribute += "\""; 
break;
case 11: attribute += "\n"; 
break;
case 12: attribute += " ";  
break;
case 13: attribute += "\t"; 
break;
case 14: attribute += "\\"; 
break;
case 15: attribute += "\'"; 
break;
case 16: attribute += "\r"; 
break;
case 17: yy_.yytext = attribute; this.popState(); return 18; 
break;
case 18: attribute = ''; this.begin("string_singleq"); 
break;
case 19: attribute += yy_.yytext; 
break;
case 20: attribute += "\""; 
break;
case 21: attribute += "\n"; 
break;
case 22: attribute += " ";  
break;
case 23: attribute += "\t"; 
break;
case 24: attribute += "\\"; 
break;
case 25: attribute += "\'"; 
break;
case 26: attribute += "\r"; 
break;
case 27: yy_.yytext = attribute; this.popState(); return 19; 
break;
case 28:return 6
break;
case 29:return 21
break;
case 30: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XML", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:<\?xml[\s\S\n]*?\?>)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:$)/i,/^(?:[^><]+)/i,/^(?:.)/i],
conditions: {"string_singleq":{"rules":[19,20,21,22,23,24,25,26,27],"inclusive":false},"string_doubleq":{"rules":[9,10,11,12,13,14,15,16,17],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,18,28,29,30],"inclusive":true}}
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
    var source = __webpack_require__(/*! fs */ 1).readFileSync(__webpack_require__(/*! path */ 2).normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "YuTi")(module)))

/***/ }),

/***/ "qbRd":
/*!*******************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Aritmetica.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function Aritmetica(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.OPERACION_SUMA:
            return suma(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_RESTA:
            return resta(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_DIVISION:
            return division(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_MODULO:
            return modulo(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(_expresion.opIzq, _ambito);
        default:
            break;
    }
}
function suma(_opIzq, _opDer, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (op1.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.STRING) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
        tipo = Enum_1.Tipos.STRING;
    }
    else if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden sumar valores numéricos o concatenar cadenas.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 + op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function resta(_opIzq, _opDer, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden restar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 - op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function multiplicacion(_opIzq, _opDer, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden multiplicar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 * op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function division(_opIzq, _opDer, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden dividir valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 / op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function modulo(_opIzq, _opDer, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede realizar módulo con valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 % op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function negacionUnaria(_opIzq, _ambito) {
    var Expresion = __webpack_require__(/*! ../Expresion */ "gajf");
    var op1 = Expresion(_opIzq, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede negar un valor numérico.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = 0 - op1;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
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

var Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function Relacional(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return mayor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return menor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return igual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return diferente(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}
function mayor(_opIzq, _opDer, _ambito) {
}
function mayorigual(_opIzq, _opDer, _ambito) {
}
function menor(_opIzq, _opDer, _ambito) {
}
function menorigual(_opIzq, _opDer, _ambito) {
}
function igual(_opIzq, _opDer, _ambito) {
}
function diferente(_opIzq, _opDer, _ambito) {
}
module.exports = Relacional;


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
var Atributo = /** @class */ (function () {
    function Atributo(id, value, line, column) {
        this.id = id;
        this.value = value;
        this.line = line;
        this.column = column;
    }
    Object.defineProperty(Atributo.prototype, "Cst", {
        get: function () {
            return this.cst;
        },
        set: function (value) {
            this.cst = value;
        },
        enumerable: false,
        configurable: true
    });
    return Atributo;
}());
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