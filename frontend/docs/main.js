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
function DobleEje(_instruccion, _ambito, _contexto) {
    let _404 = { notFound: "No se encontraron elementos." };
    if (Array.isArray(_contexto))
        _contexto = _contexto[0];
    let contexto = (_contexto.elementos) ? (_contexto) : null;
    let expresion;
    if (_instruccion.expresion.expresion)
        expresion = Expresion_1.default(_instruccion.expresion.expresion, _ambito, contexto);
    else
        expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto);
    if (expresion.error)
        return expresion;
    let predicate = _instruccion.expresion.predicate;
    let root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent({ id: expresion.valor, tipo: "@" }, contexto, _ambito, predicate);
        if (root.atributos.error)
            return root.atributos;
        if (root.atributos.length === 0)
            return _404;
        return root;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.error)
            return root.nodos;
        if (root.nodos.length === 0)
            return _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        if (root.texto.error)
            return root.texto;
        if (root.texto.length === 0)
            return _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.SELECT_AXIS) {
        root = Axis_1.default.GetAxis(expresion.axisname, expresion.nodetest, expresion.predicate, contexto, _ambito, true);
        if (root.error)
            return root;
        return root;
    }
    else {
        return { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.error || root.elementos.error || root.elementos.length === 0)
        return _404;
    return root;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito, _condicion) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else
        return { error: "Indstrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
}
function getFromCurrent(_id, _contexto, _ambito, _condicion) {
    let elements = Array();
    let attributes = Array();
    let nodes = Array();
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        let text = Array();
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            text = _ambito.searchAnyText(element, text);
            elements.push(element);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            text = filter.filterElements(text);
            elements = filter.contexto;
        }
        return { texto: text, elementos: elements, cadena: Enum_1.Tipos.TEXTOS };
    }
    // Selecciona todos los descencientes (elementos y/o texto)
    else if (_id === "node()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs) {
                element.childs.forEach((child) => {
                    nodes = _ambito.nodesFunction(child, nodes);
                });
            }
            else if (element.value)
                nodes.push({ textos: element.value });
            elements.push(element);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes = filter.filterElements(nodes);
            elements = filter.contexto;
        }
        return { cadena: Enum_1.Tipos.COMBINADO, nodos: nodes, elementos: _contexto.elementos };
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            attributes = _ambito.searchAnyAttributes(_id.id, element, attributes);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            attributes = filter.filterAttributes(attributes);
        }
        return { atributos: attributes, elementos: [], cadena: Enum_1.Tipos.ATRIBUTOS };
    }
    // Selecciona el padre
    else if (_id === "..") {
        if (_contexto.atributos) {
            for (let i = 0; i < _contexto.atributos.length; i++) {
                const attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(elm => {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            }
            if (_condicion) {
                let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
                elements = filter.filterElements(elements);
            }
            return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
        }
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            let dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(elm => {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(child => {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        }
        elements = [...new Set(elements)];
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
    // Selecciona todos los descendientes con el id o en el caso que sea //*
    else {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs)
                element.childs.forEach((child) => {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
}
module.exports = DobleEje;


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
const Enum_1 = __webpack_require__(/*! ../../model/xpath/Enum */ "MEUw");
function WhereClause(_instruccion, _ambito, _iterators) {
    const Bloque = __webpack_require__(/*! ../xpath/Instruccion/Bloque */ "8Ym7");
    let iterators = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { id: $x, iterators: /book/title (contexto) }
        let iters = iterator.iterators;
        if (Array.isArray(iters))
            iters = iters[0];
        // let _x = Bloque.getIterators(_instruccion, _ambito, iters, iterator.id); // _instruccion = [comparissons]
        let _x = Expresion_1.default(_instruccion, _ambito, iters, iterator.id);
        // console.log(_x, 8888888888888888)
        if (_x) {
            _x.forEach((element) => {
                iterators.push({ id: iterator.id, iterators: { elementos: [element], cadena: Enum_1.Tipos.ELEMENTOS } });
            });
        }
    }
    // console.log(iterators, 22222222222)
    if (iterators.length > 0)
        return iterators;
    return null;
}
module.exports = WhereClause;


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
const Enum_1 = __webpack_require__(/*! ../../../model/xpath/Enum */ "MEUw");
const DobleEje_1 = __importDefault(__webpack_require__(/*! ./Selecting/DobleEje */ "67Yu"));
const Eje_1 = __importDefault(__webpack_require__(/*! ./Selecting/Eje */ "CG7/"));
const Axis_1 = __importDefault(__webpack_require__(/*! ./Selecting/Axis/Axis */ "pW4W"));
const For_1 = __importDefault(__webpack_require__(/*! ../../xquery/For */ "9hMJ"));
let reset;
let output = [];
function Bloque(_instruccion, _ambito, _retorno, id) {
    output = [];
    reset = _retorno;
    let tmp;
    let i;
    // console.log(_instruccion, 272727272727)
    for (i = 0; i < _instruccion.length; i++) {
        const instr = _instruccion[i];
        if (instr.tipo === Enum_1.Tipos.FOR_LOOP) {
            tmp = For_1.default(instr, _ambito, _retorno);
            // console.log(tmp, 3333);
            return tmp;
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_ROOT || instr.tipo === Enum_1.Tipos.EXPRESION) {
            tmp = Eje_1.default(instr.expresion, _ambito, _retorno, id);
            // console.log(tmp,8888888888)
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_CURRENT) {
            tmp = DobleEje_1.default(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_AXIS) {
            tmp = Axis_1.default.SA(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.EXPRESION) {
            console.log(instr, "Entró a Bloque");
            // const Expresion = require('../Expresion/Expresion')
            // let a = Expresion(instr, _ambito, _retorno, id);
            // console.log(a)
            continue;
        }
        else {
            return { error: "Error: Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: instr.linea, columna: instr.columna };
        }
        if (tmp === null)
            return null;
        if (tmp.notFound && i + 1 < _instruccion.length) {
            _retorno = reset;
            break;
        }
        if (tmp.error)
            return tmp;
        _retorno = tmp;
    }
    if (i > 0)
        output.push(_retorno);
    let cadena = writeOutput();
    let codigo3d = ""; // Agregar función que devuelva código tres direcciones
    return { cadena: cadena, codigo3d: codigo3d };
}
function getIterators(_instruccion, _ambito, _retorno, _id) {
    let _bloque = Bloque(_instruccion, _ambito, _retorno, _id);
    // console.log(_bloque,22222222222)
    if (_bloque)
        return output;
    else
        return null;
}
function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = (path.texto) ? (path.texto) : (path.elementos);
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
module.exports = { Bloque: Bloque, getIterators: getIterators };


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
const Return_1 = __importDefault(__webpack_require__(/*! ./Return */ "JNzZ"));
const Where_1 = __importDefault(__webpack_require__(/*! ./Where */ "7f3N"));
function ForLoop(_instruccion, _ambito, _contexto) {
    // console.log(_instruccion, 'instrucciones For')
    let contexto = (_contexto.elementos) ? (_contexto.elementos) : null;
    let declaracion = _instruccion.cuerpo;
    // console.log(declaracion, 444)
    let iterators = [];
    declaracion.forEach((_declaracion) => {
        let it = Expresion_1.default(_declaracion, _ambito, _contexto);
        iterators = iterators.concat(it);
    });
    for (let i = 0; i < _instruccion.instrucciones.length; i++) {
        const instr = _instruccion.instrucciones[i];
        // if (!Array.isArray(instr.expresion)) {
        //     instr.expresion = [instr.expresion];
        // }
        if (instr.tipo === Enum_1.Tipos.WHERE_CONDITION) {
            let filter = Where_1.default(instr.condiciones, _ambito, iterators); //, contexto
            if (filter)
                iterators = filter;
            else
                iterators = [];
        }
        if (instr.tipo === Enum_1.Tipos.RETURN_STATEMENT) {
            // console.log(iterators[0].iterators,33333);
            return Return_1.default(instr.expresion, _ambito, iterators); //, contexto);
        }
    }
    if (_instruccion.where) {
        // Filtrar los elementos de cada variable
    }
    if (_instruccion.orderby) {
        // Ordenar los elementos según los parámetros
    }
    if (_instruccion.return) {
        // let retorno = Expresion()
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
function Eje(_instruccion, _ambito, _contexto, id) {
    let _404 = { notFound: "No se encontraron elementos." };
    // console.log(_instruccion,444449)
    if (Array.isArray(_contexto))
        _contexto = _contexto[0];
    let contexto = (_contexto.elementos) ? (_contexto) : null;
    let expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto, id);
    if (expresion === null)
        return null;
    if (expresion.error)
        return expresion;
    let predicate = _instruccion.predicate;
    // console.log(contexto,444449, expresion)
    let root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        // console.log(expresion.valor, 5555555, contexto)
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        // console.log(root, 5555555)
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot({ id: expresion.valor, tipo: "@" }, contexto, _ambito, predicate);
        if (root.atributos.error)
            return root.atributos;
        if (root.atributos.length === 0)
            return _404;
        return root;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.error)
            return root.nodos;
        if (root.nodos.length === 0)
            return _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.texto.error)
            return root.texto;
        if (root.texto.length === 0)
            return _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.SELECT_AXIS) {
        root = Axis_1.default.GetAxis(expresion.axisname, expresion.nodetest, expresion.predicate, contexto, _ambito, false);
        return root;
    }
    else {
        return { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.error || root.elementos.error || root.elementos.length === 0)
        return _404;
    return root;
}
function getSymbolFromRoot(_nodename, _contexto, _ambito, _condicion) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else
        return { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
}
// Desde el ámbito actual
function getFromCurrent(_id, _contexto, _ambito, _condicion) {
    let elements = Array();
    let attributes = Array();
    // Selecciona el texto contenido únicamente en el nodo
    if (_id === "text()") {
        let text = Array();
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.value) {
                text.push(element.value);
                elements.push(element);
            }
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            text = filter.filterElements(text);
            elements = filter.contexto;
        }
        return { texto: text, elementos: elements, cadena: Enum_1.Tipos.TEXTOS };
    }
    // Selecciona todos los hijos (elementos o texto)
    else if (_id === "node()") {
        let nodes = Array();
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs)
                element.childs.forEach((child) => {
                    nodes.push({ elementos: child });
                });
            else if (element.value)
                nodes.push({ textos: element.value });
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes = filter.filterElements(nodes);
            elements = filter.contexto;
        }
        return { cadena: Enum_1.Tipos.COMBINADO, nodos: nodes, elementos: _contexto.elementos };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs) {
                element.childs.forEach((child) => {
                    elements.push(child);
                });
            }
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.attributes)
                element.attributes.forEach((attribute) => {
                    if ((_id.id == attribute.id) || (_id.id === "*")) { // En caso de que sea un id ó @*
                        attributes.push(attribute);
                    }
                });
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            attributes = filter.filterAttributes(attributes);
        }
        return { atributos: attributes, elementos: [], cadena: Enum_1.Tipos.ATRIBUTOS };
    }
    // Selecciona el padre
    else if (_id === "..") { // Manejar el regreso de atributos a su padre como la etiqueta misma !
        if (_contexto.atributos) {
            for (let i = 0; i < _contexto.atributos.length; i++) {
                const attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(elm => {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            }
            if (_condicion) {
                let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
                elements = filter.filterElements(elements);
            }
            return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
        }
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            let dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(elm => {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(child => {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        }
        elements = [...new Set(elements)];
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        if (_contexto.atributos) {
            return { elementos: [], atributos: _contexto.atributos, cadena: Enum_1.Tipos.ATRIBUTOS };
        }
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            elements.push(element);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
    // Búsqueda en los hijos por id
    else {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs) {
                element.childs.forEach((child) => {
                    elements = _ambito.searchSingleNode(_id, child, elements);
                });
            }
        }
        if (_condicion) {
            // console.log(_condicion,3999)
            let filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return { elementos: elements, cadena: Enum_1.Tipos.ELEMENTOS };
    }
}
module.exports = Eje;


/***/ }),

/***/ "Dbnh":
/*!*************************************************************************!*\
  !*** ./src/js/controller/xpath/Instruccion/Selecting/Axis/Funciones.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../../../model/xpath/Enum */ "MEUw");
// Revisa el nodetest y busca hacer match
function f1(_element, _elements, _text, isDoubleBar) {
    if (_element.value) {
        _text.push(_element.value);
        _elements.push(_element);
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f1(child, _elements, _text, isDoubleBar);
        });
    }
    return { elementos: _elements, texto: _text };
}
function f2(_element, _elements, _attributes, valor, isDoubleBar) {
    for (let j = 0; j < _element.attributes.length; j++) {
        const attribute = _element.attributes[j];
        if (attribute.id == valor || valor === "*") {
            _elements.push(_element);
            _attributes.push(attribute);
            break; // Sale del ciclo de atributos para pasar al siguiente elemento
        }
        if (attribute.value == valor) {
            _elements.push(_element);
            _attributes.push(attribute);
            break;
        }
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f2(child, _elements, _attributes, valor, isDoubleBar);
        });
    }
    return { elementos: _elements, atributos: _attributes };
}
function f3(_element, _elements, _text, valor, tipo, isDoubleBar) {
    if (_element.id_open == valor || valor == "*") {
        if (tipo === Enum_1.Tipos.FUNCION_TEXT)
            _text.push(_element.value);
        _elements.push(_element);
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f3(child, _elements, _text, valor, tipo, isDoubleBar);
        });
    }
    return { elementos: _elements, texto: _text };
}
function f4(_element, _elements, _text, valor, tipo, isDoubleBar) {
    if (_element.value == valor || valor == "*") {
        if (tipo === Enum_1.Tipos.FUNCION_TEXT)
            _text.push(_element.value);
        _elements.push(_element);
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f4(child, _elements, _text, valor, tipo, isDoubleBar);
        });
    }
    return { elementos: _elements, texto: _text };
}
module.exports = { f1: f1, f2: f2, f3: f3, f4: f4 };


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
    set setContext(v) {
        this.contexto = v;
    }
    filterElements(_resultado) {
        let expresion;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i]; // En caso de tener varios predicados seguidos
            // console.log(e, "Predicado")
            let condicion = e;
            if (Array.isArray(e.condicion))
                condicion = e.condicion[0];
            expresion = Expresion_1.default(condicion, this.ambito, this.contexto);
            // console.log(expresion, "Expresion predicado")
            if (expresion.error)
                return expresion;
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _resultado.length)
                    _resultado = [];
                else
                    _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
                let tmp = [];
                this.contexto = [];
                _resultado.forEach(element => {
                    if (element.attributes)
                        for (let i = 0; i < element.attributes.length; i++) {
                            const attribute = element.attributes[i];
                            if (expresion.atributo) { // Es una comparación
                                if (expresion.desigualdad) { // (<,<=,>,>=)
                                    if (expresion.atributo == attribute.id && this.operarDesigualdad(expresion.desigualdad, expresion.condicion, attribute.value)) {
                                        tmp.push(element);
                                        this.contexto.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.exclude) { // (!=)
                                    if (expresion.atributo == attribute.id && expresion.condicion != attribute.value) {
                                        tmp.push(element);
                                        this.contexto.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.atributo == attribute.id && expresion.condicion == attribute.value) { // (==)
                                    tmp.push(element);
                                    this.contexto.push(element);
                                    break;
                                }
                            }
                            else if (expresion.valor == attribute.id || expresion.valor == "*") { // No compara valor, sólo apila
                                tmp.push(element);
                                this.contexto.push(element);
                                break;
                            }
                        }
                });
                _resultado = tmp;
                return _resultado;
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                this.contexto = [];
                for (let i = 0; i < _resultado.length; i++) {
                    const element = _resultado[i];
                    let text = element.value;
                    if (text) {
                        if (expresion.exclude) {
                            if (text != expresion.condicion) // text() != 'x'
                                this.contexto.push(element);
                        }
                        else if (text == expresion.condicion) // text() == 'x'
                            this.contexto.push(element);
                    }
                }
                return this.contexto;
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
                for (let i = 0; i < this.contexto.length; i++) {
                    const element = this.contexto[i];
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
        }
        this.contexto = _resultado;
        return this.contexto;
    }
    filterAttributes(_resultado) {
        let expresion;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i]; // En caso de tener varios predicados seguidos
            // console.log(e, "Predicado")
            let condicion = e;
            if (Array.isArray(e.condicion))
                condicion = e.condicion[0];
            expresion = Expresion_1.default(condicion, this.ambito, this.contexto);
            // console.log(expresion, "Expresion predicado")
            if (expresion.error)
                return expresion;
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _resultado.length)
                    _resultado = [];
                else
                    _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
                let tmp = [];
                this.contexto = [];
                _resultado.forEach(attribute => {
                    if (expresion.atributo) { // Es una comparación
                        if (expresion.desigualdad) { // (<,<=,>,>=)
                            if (expresion.atributo == attribute.id && this.operarDesigualdad(expresion.desigualdad, expresion.condicion, attribute.value)) {
                                tmp.push(attribute);
                            }
                        }
                        else if (expresion.exclude) { // (!=)
                            if (expresion.atributo == attribute.id && expresion.condicion != attribute.value) {
                                tmp.push(attribute);
                            }
                        }
                        else if (expresion.atributo == attribute.id && expresion.condicion == attribute.value) { // (==)
                            tmp.push(attribute);
                        }
                    }
                    else if (expresion.valor == attribute.id || expresion.valor == "*") { // No compara valor, sólo apila
                        tmp.push(attribute);
                    }
                });
                _resultado = tmp;
                return _resultado;
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                let tmp = [];
                for (let i = 0; i < _resultado.length; i++) {
                    const attribute = _resultado[i];
                    let text = attribute.value;
                    if (expresion.exclude) {
                        if (text != expresion.condicion) // text() != 'x'
                            tmp.push(attribute);
                    }
                    else if (text == expresion.condicion) // text() == 'x'
                        tmp.push(attribute);
                }
                return tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                let index = _resultado.length - 1;
                _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MENOR) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= _resultado.length)
                    index = _resultado.length - 1;
                let tmp = [];
                for (let i = index; i <= _resultado.length && i >= 0; i--) {
                    const attribute = _resultado[i];
                    tmp.push(attribute);
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
                    const attribute = _resultado[i];
                    tmp.push(attribute);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.ELEMENTOS && expresion.e1 && expresion.e2) {
                const e1 = expresion.e1;
                const e2 = expresion.e2;
                let condition = false;
                let tmp = [];
                for (let i = 0; i < _resultado.length; i++) {
                    const attribute = _resultado[i]; // Hace match con un atributo
                    condition = this.verificarDesigualdad(expresion.desigualdad, attribute.id, e1, attribute.value, e2);
                    if (condition) {
                        tmp.push(attribute);
                    }
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
                        const attribute = _resultado[i];
                        if (i != index)
                            tmp.push(attribute);
                    }
                    _resultado = tmp;
                }
            }
        }
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
    let expresion = [];
    // console.log(_iterators.length, 4444)
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { id: $x, iterators: /book/title (contexto) }
        let iters = iterator.iterators;
        if (Array.isArray(iters))
            iters = iters[0];
        // console.log(_expresion, 44444444, iters)
        let _x = Expresion_1.default(_expresion, _ambito, iters, iterator.id); // _expresion = [XPATH]
        // console.log(_x, 8888888888888888)
        if (_x)
            expresion = expresion.concat(_x);
    }
    // console.log(_expresion,409999,expresion)
    let _str = [BuildElement_1.default(expresion)];
    if (_expresion.tipo === Enum_1.Tipos.HTML) {
        _str.unshift({ valor: '<' + _expresion.id_open + '>' });
        _str.push({ valor: '</' + _expresion.id_close + '>' });
    }
    return { cadena: writeReturn(_str), parametros: expresion };
}
function writeReturn(_expresion) {
    // console.log(_expresion, 3444);
    let cadena = "";
    let max = getMaxLength(_expresion);
    // console.log(max);
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < _expresion.length; j++) {
            var exp = _expresion[j];
            if (exp.valor)
                cadena += exp.valor;
            else if (exp.length > 0) {
                let shift = exp.shift();
                if (shift.valor)
                    continue;
                else if (shift.item)
                    cadena += shift.item;
                else
                    cadena += shift;
                exp = exp.push(shift);
            }
        }
        cadena += '\n';
    }
    console.log(cadena);
    return cadena;
}
function getMaxLength(context) {
    let index = 1;
    context.forEach(element => {
        if (element.length > index)
            index = element.length;
        if (element.elementos)
            index = element.elementos.length;
        if (element.iterators)
            index = element.iterators.length;
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
    Tipos["VARIABLE"] = "VARIABLE";
    Tipos["DECLARACION"] = "DECLARACION";
    Tipos["INTERVALO"] = "INTERVALO";
    Tipos["VALORES"] = "VALORES";
    Tipos["CONTENIDO"] = "CONTENIDO";
    Tipos["INYECCION"] = "INYECCION";
    Tipos["HTML"] = "HTML";
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
    addVariable(_variable) {
        this.tablaVariables.push(_variable);
    }
    getVariable(_id) {
        for (let i = 0; i < this.tablaVariables.length; i++) {
            const variable = this.tablaVariables[i];
            if (variable.id.id === _id) {
                return variable;
            }
        }
        return null;
    }
    nodesFunction(_element, _nodes) {
        _nodes.push({ elementos: _element });
        if (_element.childs) {
            _element.childs.forEach(child => {
                _nodes = this.nodesFunction(child, _nodes);
            });
        }
        if (_element.value) {
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
                }
            });
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
function ExpresionQuery(_expresion, _ambito, _contexto, id) {
    let tipo = _expresion.tipo;
    if (tipo === Enum_1.Tipos.DECLARACION) {
        let iterators = [];
        let id = Expresion_1.default(_expresion.variable, _ambito, _contexto);
        let it = Expresion_1.default(_expresion.iterators, _ambito, _contexto);
        if (!id.error && !it.error)
            iterators.push({ id: id.valor, iterators: it });
        return iterators;
    }
    if (tipo === Enum_1.Tipos.VARIABLE) {
        // console.log(_expresion, 33444, _contexto)
        if (id && hasElements(_contexto)) {
            if (id === _expresion.variable)
                return _contexto;
            else
                return null;
        }
        return { valor: _expresion.variable };
    }
    // if (Array.isArray(_expresion)) {
    //     const Bloque = require("../../xpath/Instruccion/Bloque");
    //     const elements = Bloque.getIterators(_expresion, _ambito, _contexto);
    //     return elements; //<- Retorna un arreglo de elementos
    // }
    if (tipo === Enum_1.Tipos.HTML) {
        let content = [];
        for (let i = 0; i < _expresion.value.length; i++) {
            const value = Expresion_1.default(_expresion.value[i], _ambito, _contexto, id);
            if (value)
                content = content.concat(value);
            // else
            //     content.pop();
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
        if (_contexto[0].item)
            return _contexto;
        const Bloque = __webpack_require__(/*! ../../xpath/Instruccion/Bloque */ "8Ym7");
        let elements = [];
        // elements.push(e_0);
        let _x = Bloque.getIterators(_expresion.path, _ambito, _contexto[0], id);
        if (_x && _x.length > 0) {
            _contexto = _x;
            elements = elements.concat(_x);
        }
        return elements;
    }
    if (tipo === Enum_1.Tipos.INTERVALO) {
        let iterators = [];
        let val_1 = Expresion_1.default(_expresion.valor1, _ambito, _contexto);
        if (val_1.error)
            return val_1;
        let val_2 = Expresion_1.default(_expresion.valor2, _ambito, _contexto);
        if (val_2.error)
            return val_2;
        for (let i = parseInt(val_1.valor); i <= parseInt(val_2.valor); i++) {
            iterators.push({ item: i });
        }
        return iterators;
    }
    if (tipo === Enum_1.Tipos.VALORES) {
        let iterators = [];
        _expresion.valores.forEach((valor) => {
            const expresion = Expresion_1.default(valor, _ambito, _contexto);
            if (!expresion.error)
                iterators.push({ item: parseInt(expresion.valor) });
        });
        return iterators;
    }
    else {
        const Bloque = __webpack_require__(/*! ../../xpath/Instruccion/Bloque */ "8Ym7");
        // console.log(_expresion,4444);
        let _bloque = Bloque.getIterators(_expresion, _ambito, _contexto, id);
        if (_bloque === null || _bloque.error)
            return _bloque;
        else
            _contexto = _bloque;
        return _contexto;
    }
}
function hasElements(_array) {
    for (let i = 0; i < _array.length; i++) {
        const element = _array[i];
        if (element.cadena)
            if (element.cadena.length > 0)
                return true;
        if (element.item)
            return true;
    }
    return false;
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
    if (operators.error)
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
    let op1 = Expresion(_opIzq, _ambito, _contexto);
    if (op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto);
    if (op2.error)
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
    let tmp = [];
    for (let i = 0; i < _contexto.length; i++) {
        const element = _contexto[i];
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
        condition = verificarDesigualdad(desigualdad, element.id_open, e1, element.value, e2); // Hace match con el elemento
        if (condition)
            tmp.push(element);
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
            expresion: _valor,
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
        if (path.item) {
            return input;
        }
        if (path.notFound) {
            return ['No se encontraron elementos.'];
        }
        // if (path.valor) {
        //     iterators.unshift(path);
        // }
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = (path.texto) ? (path.texto) : (path.elementos);
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
        return iterators;
    return ['No se encontraron elementos.'];
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
    // if (!_expresion) return null;
    let tipo = (Array.isArray(_expresion)) ? Enum_1.Tipos.NONE : _expresion.tipo;
    // console.log(tipo,89898989)
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
        if (id) {
            // console.log(_expresion.expresion, id, 445);
            if (id === _expresion.expresion)
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
            else
                return null;
        }
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
    else {
        const ExpresionQuery = __webpack_require__(/*! ../../xquery/Expresion/Expresion */ "Rfe7");
        return ExpresionQuery(_expresion, _ambito, _contexto, id);
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
const Bloque_1 = __importDefault(__webpack_require__(/*! ../controller/xpath/Instruccion/Bloque */ "8Ym7"));
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
        // console.log(xQuery_ast.ast, "ast");
        if (xQuery_ast.errors.length > 0 || xQuery_ast.ast === null || xQuery_ast === true) {
            if (xQuery_ast.errors.length > 0)
                errors = xQuery_ast.errors;
            if (xQuery_ast.ast === null || xQuery_ast === true) {
                errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea de la consulta digitada.", origen: "XQuery", linea: "1", columna: "1" });
                return { output: "La consulta contiene errores para analizar.\nIntente de nuevo.", arreglo_errores: errors };
            }
        }
        let root = new Element_1.Element("[object XMLDocument]", [], "", cadena.ambito.tablaSimbolos, "0", "0", "[object XMLDocument]");
        let output = { cadena: "", elementos: [root], atributos: null };
        let xQuery_parse = xQuery_ast.ast; // AST que genera Jison
        // console.log(xQuery_parse,55555555)
        let bloque = Bloque_1.default.Bloque(xQuery_parse, cadena.ambito, output); // Procesa las instrucciones
        if (bloque.error) {
            errors.push(bloque);
            return { arreglo_errores: errors, output: bloque.error };
        }
        output = {
            arreglo_simbolos: simbolos,
            arreglo_errores: errors,
            output: bloque.cadena,
            encoding: encoding,
            codigo3d: bloque.codigo3d
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

/***/ "jdP8":
/*!**************************************************************!*\
  !*** ./src/js/controller/xpath/Expresion/Operators/Match.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Enum_1 = __webpack_require__(/*! ../../../../model/xpath/Enum */ "MEUw");
function filterElements(valor, desigualdad, _ambito, _contexto) {
    let condition = false;
    let tmp = [];
    for (let i = 0; i < _contexto.length; i++) {
        const element = _contexto[i];
        // console.log(element, 555555)
        /* if (element.attributes) { // Hace match con un atributo
            for (let j = 0; j < element.attributes.length; j++) {
                const attribute = element.attributes[j];
                condition = verificarDesigualdad(desigualdad, attribute.value, valor);
                if (condition) {
                    tmp.push(element);
                    break; // Sale del ciclo de atributos para pasar al siguiente elemento
                }
            }
        }
        if (element.childs) { // Hace match con algún hijo
            for (let j = 0; j < element.childs.length; j++) {
                const child = element.childs[j];
                condition = verificarDesigualdad(desigualdad, child.value, valor);
                if (condition) {
                    tmp.push(element);
                    break;
                }
            }
        } */
        condition = verificarDesigualdad(desigualdad, element.value, valor); // Hace match con el elemento
        if (condition) {
            let dad = element.father;
            if (dad)
                tmp = tmp.concat(_ambito.searchDad(_ambito.tablaSimbolos[0], dad.id, dad.line, dad.column, []));
        }
    }
    // console.log(tmp, 133333333333333)
    return tmp;
}
function verificarDesigualdad(_tipo, v1, e1) {
    switch (_tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return (v1 > e1);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return (v1 >= e1);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return (v1 < e1);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return (v1 <= e1);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return (v1 == e1);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return (v1 != e1);
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,7],$V1=[1,10],$V2=[1,15],$V3=[1,16],$V4=[1,44],$V5=[1,24],$V6=[1,12],$V7=[1,11],$V8=[1,27],$V9=[1,28],$Va=[1,29],$Vb=[1,30],$Vc=[1,45],$Vd=[1,46],$Ve=[1,20],$Vf=[1,21],$Vg=[1,22],$Vh=[1,23],$Vi=[1,31],$Vj=[1,32],$Vk=[1,33],$Vl=[1,34],$Vm=[1,35],$Vn=[1,36],$Vo=[1,37],$Vp=[1,38],$Vq=[1,39],$Vr=[1,40],$Vs=[1,41],$Vt=[1,42],$Vu=[1,43],$Vv=[5,51],$Vw=[5,8,11,12,19],$Vx=[5,8,11,12,19,24,26,27,29,32,33,37,38,40,42,44,47,49,51,53,54,60,61,62,63,64,65,66,67,68,69,72,73,74,75,76,77,78,79,80,81,84,85,86,87,88,89,90,91,92,93,94,95,96],$Vy=[2,56],$Vz=[1,63],$VA=[5,8,11,12,19,24,26,27,29,32,33,37,38,40,42,44,47,49,51,53,54,59,60,61,62,63,64,65,66,67,68,69,72,73,74,75,76,77,78,79,80,81,84,85,86,87,88,89,90,91,92,93,94,95,96],$VB=[1,82],$VC=[1,83],$VD=[1,84],$VE=[24,26,27,29],$VF=[1,85],$VG=[1,86],$VH=[1,91],$VI=[1,90],$VJ=[5,8,11,12,19,24,27,29],$VK=[1,107],$VL=[1,114],$VM=[1,116],$VN=[1,124],$VO=[1,119],$VP=[1,113],$VQ=[1,115],$VR=[1,117],$VS=[1,118],$VT=[1,120],$VU=[1,121],$VV=[1,122],$VW=[1,123],$VX=[1,125],$VY=[5,8,11,12,19,24,26,27,29,37,38,40,42,49,54,60,61,62,63,64,65,66,67,68,69],$VZ=[5,8,11,12,19,24,26,27,29],$V_=[42,44],$V$=[26,38],$V01=[5,8,11,12,19,24,26,27,29,37,38,40,42,49,60,61,62,67,68,69],$V11=[5,8,11,12,19,24,26,27,29,37,38,40,42,49,60,61,62,63,64,67,68,69],$V21=[1,163],$V31=[1,164],$V41=[33,40,42,44,46];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"XPATH_U":4,"EOF":5,"XQUERY":6,"INSTR_QUERY":7,"IF_ELSE_IF":8,"FOR_LOOP":9,"LET_CLAUSE":10,"FUNCIONES":11,"tk_for":12,"DECLARACION":13,"INSTRUCCIONES_FOR":14,"INSTR_FOR_P":15,"WHERE_CONDITION":16,"ORDER_BY":17,"RETURN_STATEMENT":18,"tk_let":19,"VARIABLE":20,"tk_2puntos_igual":21,"DECLARACIONPP":22,"DECLARACIONP":23,"tk_where":24,"E":25,"tk_coma":26,"tk_order":27,"tk_by":28,"tk_return":29,"HTML":30,"XPATH":31,"tk_dolar":32,"tk_id":33,"tk_in":34,"tk_at":35,"tk_ParA":36,"tk_to":37,"tk_ParC":38,"VALORES_COMA":39,"tk_menor":40,"ATTRIBUTE_LIST":41,"tk_mayor":42,"CONTENT_LL":43,"tk_bar":44,"CONTENT_TAG":45,"tk_labre":46,"tk_lcierra":47,"tk_data":48,"tk_equal":49,"STRING":50,"tk_line":51,"QUERY":52,"tk_2bar":53,"tk_asterisco":54,"CORCHETP":55,"EXP_PR":56,"AXIS":57,"CORCHET":58,"tk_corA":59,"tk_corC":60,"tk_menorigual":61,"tk_mayorigual":62,"tk_mas":63,"tk_menos":64,"tk_div":65,"tk_mod":66,"tk_or":67,"tk_and":68,"tk_diferent":69,"FUNC":70,"PRIMITIVO":71,"num":72,"tk_punto":73,"tk_2puntos":74,"tk_arroba":75,"tk_string_d":76,"tk_string_s":77,"tk_text":78,"tk_last":79,"tk_position":80,"tk_node":81,"AXISNAME":82,"tk_4puntos":83,"tk_ancestor":84,"tk_ancestor2":85,"tk_attribute":86,"tk_child":87,"tk_descendant":88,"tk_descendant2":89,"tk_following":90,"tk_following2":91,"tk_namespace":92,"tk_parent":93,"tk_preceding":94,"tk_preceding2":95,"tk_self":96,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"IF_ELSE_IF",11:"FUNCIONES",12:"tk_for",19:"tk_let",21:"tk_2puntos_igual",24:"tk_where",26:"tk_coma",27:"tk_order",28:"tk_by",29:"tk_return",32:"tk_dolar",33:"tk_id",34:"tk_in",35:"tk_at",36:"tk_ParA",37:"tk_to",38:"tk_ParC",40:"tk_menor",42:"tk_mayor",44:"tk_bar",46:"tk_labre",47:"tk_lcierra",48:"tk_data",49:"tk_equal",51:"tk_line",53:"tk_2bar",54:"tk_asterisco",59:"tk_corA",60:"tk_corC",61:"tk_menorigual",62:"tk_mayorigual",63:"tk_mas",64:"tk_menos",65:"tk_div",66:"tk_mod",67:"tk_or",68:"tk_and",69:"tk_diferent",72:"num",73:"tk_punto",74:"tk_2puntos",75:"tk_arroba",76:"tk_string_d",77:"tk_string_s",78:"tk_text",79:"tk_last",80:"tk_position",81:"tk_node",83:"tk_4puntos",84:"tk_ancestor",85:"tk_ancestor2",86:"tk_attribute",87:"tk_child",88:"tk_descendant",89:"tk_descendant2",90:"tk_following",91:"tk_following2",92:"tk_namespace",93:"tk_parent",94:"tk_preceding",95:"tk_preceding2",96:"tk_self"},
productions_: [0,[3,2],[3,2],[6,2],[6,1],[7,1],[7,1],[7,1],[7,1],[9,3],[14,2],[14,1],[15,1],[15,1],[15,1],[10,4],[10,2],[16,2],[17,3],[17,3],[18,2],[18,2],[20,2],[13,3],[13,1],[23,3],[23,5],[22,5],[22,3],[22,1],[39,3],[39,1],[30,9],[30,8],[30,5],[43,2],[43,1],[45,1],[45,3],[45,6],[41,3],[41,3],[41,0],[4,3],[4,1],[31,2],[31,1],[52,2],[52,2],[52,3],[52,3],[52,1],[52,1],[58,4],[58,3],[55,1],[55,0],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,1],[56,2],[56,2],[71,1],[71,1],[71,1],[71,1],[71,1],[71,1],[71,2],[71,2],[50,1],[50,1],[70,3],[70,3],[70,3],[70,3],[57,3],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1],[82,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
   prod_1 = grammar_stack.pop();
					prod_2 = grammar_stack.pop();
			 		grammar_stack.push({'ini -> XPATH_U EOF': [prod_2, prod_1]});
					// grammar_report =  getGrammarReport(grammar_stack); // cst = getCST(grammar_stack); // let arbol_ast = getASTTree($$[$0-1]);
					ast = { ast: $$[$0-1], errors: errors, cst: "cst", grammar_report: "grammar_report",  arbolAST : "arbol_ast" }; return ast;
                
break;
case 2:
 ast = { ast: $$[$0-1], errors: errors, cst: "cst", grammar_report: "grammar_report",  arbolAST : "arbol_ast" }; return ast; 
break;
case 3: case 10: case 35:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1]; 
break;
case 4: case 11: case 19: case 31: case 36:
 this.$=[$$[$0]]; 
break;
case 6: case 29: case 40: case 41: case 51: case 52: case 72:
 this.$=$$[$0]; 
break;
case 9:
 this.$ = queryBuilder.nuevoFor($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 12: case 14: case 77:
 this.$ = $$[$0]; 
break;
case 13:
 this.$ = queryBuilder.nuevoOrderBy($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 15:
 this.$ = queryBuilder.nuevoLet($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 17:
 this.$ = queryBuilder.nuevoWhere($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 18: case 23: case 30:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2]; 
break;
case 20: case 21:
 this.$ = queryBuilder.nuevoReturn($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 22:
 this.$=queryBuilder.nuevaVariable("$"+$$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 24:
 this.$=[$$[$0]] 
break;
case 25:
 this.$ = queryBuilder.nuevaDeclaracion($$[$0-2], null, $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 26:
 this.$ = queryBuilder.nuevaDeclaracion($$[$0-4], $$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 27:
 this.$ = queryBuilder.nuevoIntervalo($$[$0-3], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 28:
 this.$ = queryBuilder.nuevosValores($$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 32:
 this.$ = queryBuilder.nuevoHTML($$[$0-7], $$[$0-6], $$[$0-4], $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 33:
 this.$ = queryBuilder.nuevoHTML($$[$0-6], $$[$0-5], null, $$[$0-1], this._$.first_line, this._$.first_column+1); 
break;
case 34:
 this.$ = queryBuilder.nuevoHTML($$[$0-3], $$[$0-2], null, null, this._$.first_line, this._$.first_column+1); 
break;
case 37:
 this.$ = queryBuilder.nuevoContenido($$[$0], this._$.first_line, this._$.first_column+1); 
break;
case 38:
 this.$ = queryBuilder.nuevaInyeccion($$[$0-1], false, this._$.first_line, this._$.first_column+1); 
break;
case 39:
 this.$ = queryBuilder.nuevaInyeccion($$[$0-2], true, this._$.first_line, this._$.first_column+1); 
break;
case 42:
 this.$=null; 
break;
case 43:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2];
								 prod_1 = grammar_stack.pop();
								 prod_2 = grammar_stack.pop();
			 					 grammar_stack.push({'XPATH_U -> XPATH_U tk_line XPATH {S1.push(S3); SS = S1;}': [prod_2, 'token: tk_line\t Lexema: ' + $$[$0-2], prod_1]}); 
break;
case 44:
 this.$=[$$[$0]];
				  prod_1 = grammar_stack.pop();
			 	  grammar_stack.push({'XPATH_U -> XPATH {SS = [S1]}': [prod_1]}); 
break;
case 45:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1];
					  prod_1 = grammar_stack.pop();
					  prod_2 = grammar_stack.pop();
			 		  grammar_stack.push({'XPATH -> XPATH QUERY {S1.push(S2); SS = S1;}': [prod_2, prod_1]}); 
break;
case 46:
 this.$=[$$[$0]];
			   prod_1 = grammar_stack.pop();
			   grammar_stack.push({'XPATH -> QUERY {SS = [S1]}': [prod_1]}); 
break;
case 47:
 this.$=builder.newDoubleAxis($$[$0], this._$.first_line, this._$.first_column+1);
					   prod_1 = grammar_stack.pop();
			 		   grammar_stack.push({'QUERY -> tk_2bar QUERY SS=builder.newDoubleAxis(Param);': ['token: tk_2bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 48:
 this.$=builder.newAxis($$[$0], this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
			 		 grammar_stack.push({'QUERY -> tk_bar QUERY {SS=builder.newAxis(Param);}': ['token: tk_bar\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 49:

			var linea = this._$.first_line;
			var columna = this._$.first_column+1;
			this.$=builder.newAxis(builder.newExpression(builder.newValue($$[$0-1], Tipos.ASTERISCO, linea, columna), $$[$0], linea, columna), linea, columna);
		
break;
case 50:

			var linea = this._$.first_line;
			var columna = this._$.first_column+1;
			this.$=builder.newDoubleAxis(builder.newExpression(builder.newValue($$[$0-1], Tipos.ASTERISCO, linea, columna), $$[$0], linea, columna), linea, columna);
		
break;
case 53:
 $$[$0-3].push(builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)); this.$=$$[$0-3];
									 prod_1 = grammar_stack.pop();
									 prod_2 = grammar_stack.pop();
						 			 grammar_stack.push({'CORCHET -> CORCHET tk_ParA E tk_ParC {S1.push(builder.NewPredicate(Param))}': [prod_2, 'token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 54:
 this.$=[builder.newPredicate($$[$0-1], this._$.first_line, this._$.first_column+1)];
						 prod_1 = grammar_stack.pop();
						 grammar_stack.push({'CORCHET -> tk_corA E tk_corC {SS=builder.newPredicate(Param)}': ['token: tk_corA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_corC\t Lexema: ' + $$[$0]]}); 
break;
case 55:
 this.$=$$[$0];
					prod_1 = grammar_stack.pop();
					grammar_stack.push({'CORCHETP -> CORCHET {SS=S1;}': [prod_1]}); 
break;
case 56:
 this.$=null;
			grammar_stack.push({'CORCHETP -> Empty {SS=null}': ['EMPTY'] }); 
break;
case 57:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENORIGUAL, this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
				 		prod_2 = grammar_stack.pop();
					    grammar_stack.push({'E -> E tk_menorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 58:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MENOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_menor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 59:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYORIGUAL, this._$.first_line, this._$.first_column+1);
						  prod_1 = grammar_stack.pop();
				 		  prod_2 = grammar_stack.pop();
						  grammar_stack.push({'E -> E tk_mayorigual E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayorigual\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 60:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_MAYOR, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				 	 grammar_stack.push({'E -> E tk_mayor E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mayor\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 61:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_SUMA, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mas E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mas\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 62:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1);
					 prod_1 = grammar_stack.pop();
				 	 prod_2 = grammar_stack.pop();
				  	 grammar_stack.push({'E -> E tk_menos E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 63:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MULTIPLICACION, this._$.first_line, this._$.first_column+1);
						 prod_1 = grammar_stack.pop();
				 		 prod_2 = grammar_stack.pop();
				  		 grammar_stack.push({'E -> E tk_asterisco E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_asterisco\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 64:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_DIVISION, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_div E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_div\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 65:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.OPERACION_MODULO, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_mod E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_mod\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 66:
 this.$=builder.newOperation(builder.newValue(0, Tipos.NUMBER, this.$.first_line, this.$.first_column+1), $$[$0], Tipos.OPERACION_RESTA, this.$.first_line, this.$.first_column+1); 
								prod_1 = grammar_stack.pop();
						  		grammar_stack.push({'E -: tk_menos E': ['token: tk_menos\t Lexema: ' + $$[$0-1], prod_1]});
break;
case 67:
 this.$=$$[$0-1];
						  prod_1 = grammar_stack.pop();
						  grammar_stack.push({'E -> tk_ParA E tk_ParC {SS=S2}': ['token: tk_ParA\t Lexema: ' + $$[$0-2], prod_1, 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 68:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_OR, this._$.first_line, this._$.first_column+1);
				  prod_1 = grammar_stack.pop();
				  prod_2 = grammar_stack.pop();
				  grammar_stack.push({'E -> E tk_or E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_or\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 69:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.LOGICA_AND, this._$.first_line, this._$.first_column+1);
				   prod_1 = grammar_stack.pop();
				   prod_2 = grammar_stack.pop();
				   grammar_stack.push({'E -> E tk_and E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_and\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 70:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_IGUAL, this._$.first_line, this._$.first_column+1); 
					 prod_1 = grammar_stack.pop();
					 prod_2 = grammar_stack.pop();
					 grammar_stack.push({'E -> E tk_equal E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_equal\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 71:
 this.$=builder.newOperation($$[$0-2], $$[$0], Tipos.RELACIONAL_DIFERENTE, this._$.first_line, this._$.first_column+1); 
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'E -> E tk_diferent E {SS=builder.newOperation(Param)}': [prod_2, 'token: tk_diferent\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 73:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1);
						prod_1 = grammar_stack.pop();
						prod_2 = grammar_stack.pop();
						grammar_stack.push({'EXP_PR -> FUNC CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 74:
 this.$=builder.newExpression($$[$0-1], $$[$0], this._$.first_line, this._$.first_column+1); 
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'EXP_PR -> PRIMITIVO CORCHETP {SS=builder.newExpression(Param)}': [prod_2, prod_1]}); 
break;
case 75:
 this.$=builder.newNodename($$[$0], this._$.first_line, this._$.first_column+1);
				   grammar_stack.push({'PRIMITIVO -> tk_id {SS=builder.newNodename(Param)}':['token: tk_text\t Lexema: ' + $$[$0]]}); 
break;
case 76:
 this.$=builder.newAxis(builder.newCurrent($$[$0].variable, this._$.first_line, this._$.first_column+1), this._$.first_line, this._$.first_column+1); 
break;
case 78:
 this.$=builder.newValue(Number($$[$0]), Tipos.NUMBER, this._$.first_line, this._$.first_column+1);
				grammar_stack.push({'PRIMITIVO -> num {SS=builder.newValue(Param)}':['token: num\t Lexema: ' + $$[$0]]}); 
break;
case 79:
 this.$=builder.newCurrent($$[$0], this._$.first_line, this._$.first_column+1); 
					 grammar_stack.push({'PRIMITIVO -> tk_punto {SS=builder.newCurrent(Param)}':['token: tk_punto\t Lexema: ' + $$[$0]]}); 
break;
case 80:
 this.$=builder.newParent($$[$0], this._$.first_line, this._$.first_column+1);
					   grammar_stack.push({'PRIMITIVO -> tk_2puntos {SS=builder.newParent(Param)}':['token: tk_2puntos\t Lexema: ' + $$[$0]]}); 
break;
case 81:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1);
							grammar_stack.push({'PRIMITIVO -> tk_arroba tk_id {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_id\t Lexema: ' + $$[$0]]}); 
break;
case 82:
 this.$=builder.newAttribute($$[$0], this._$.first_line, this._$.first_column+1); 
							 grammar_stack.push({'PRIMITIVO -> tk_arroba tk_asterisco {SS=builder.newAttribute(Param)}':['token: tk_arroba\t Lexema: ' + $$[$0-1], 'token: tk_asterisco\t Lexema: ' + $$[$0]]});
break;
case 83:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1);
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_d {SS=builder.newValue(Param)}':['token: tk_attribute_d\t Lexema: ' + $$[$0]]}); 
break;
case 84:
 this.$=builder.newValue($$[$0], Tipos.STRING, this._$.first_line, this._$.first_column+1); 
						   grammar_stack.push({'PRIMITIVO -> tk_attribute_s {SS=builder.newValue(Param)}':['token: tk_attribute_s\t Lexema: ' + $$[$0]]}); 
break;
case 85:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_TEXT, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_text tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_text\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 86:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_LAST, this._$.first_line, this._$.first_column+1);
								grammar_stack.push({'FUNC -> tk_last tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_last\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]}); 
break;
case 87:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_POSITION, this._$.first_line, this._$.first_column+1); 
									grammar_stack.push({'FUNC -> tk_position tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_position\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 88:
 this.$=builder.newValue($$[$0-2], Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); 
								grammar_stack.push({'FUNC -> tk_node tk_ParA tk_ParC {SS=builder.newValue(Param)}':['token: tk_node\t Lexema: ' + $$[$0-2], 'token: tk_ParA\t Lexema: ' + $$[$0-1], 'token: tk_ParC\t Lexema: ' + $$[$0]]});
break;
case 89:
 this.$=builder.newAxisObject($$[$0-2], $$[$0], this._$.first_line, this._$.first_column+1);
								prod_1 = grammar_stack.pop();
								prod_2 = grammar_stack.pop();
								grammar_stack.push({'AXIS -> AXISNAME tk_4puntos QUERY {SS=builder.newAxisObject(Param)}':[prod_2, 'token: tk_4puntos\t Lexema: ' + $$[$0-1], prod_1]}); 
break;
case 90:
 this.$ = Tipos.AXIS_ANCESTOR;
						grammar_stack.push({'AXISNAME -> tk_ancestor {SS = Tipos.AxisTipo}':['token: tk_ancestor\t Lexema: ' + $$[$0]]}); 
break;
case 91:
 this.$ = Tipos.AXIS_ANCESTOR_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_ancestor2 {SS = Tipos.AxisTipo}':['token: tk_ancestor2\t Lexema: ' + $$[$0]]}); 
break;
case 92:
 this.$ = Tipos.AXIS_ATTRIBUTE;
						grammar_stack.push({'AXISNAME -> tk_attribute {SS = Tipos.AxisTipo}':['token: tk_attribute\t Lexema: ' + $$[$0]]}); 
break;
case 93:
 this.$ = Tipos.AXIS_CHILD;
						grammar_stack.push({'AXISNAME -> tk_child {SS = Tipos.AxisTipo}':['token: tk_child\t Lexema: ' + $$[$0]]}); 
break;
case 94:
 this.$ = Tipos.AXIS_DESCENDANT;
						grammar_stack.push({'AXISNAME -> tk_descendant {SS = Tipos.AxisTipo}':['token: tk_descendant\t Lexema: ' + $$[$0]]}); 
break;
case 95:
 this.$ = Tipos.AXIS_DESCENDANT_OR_SELF;
						grammar_stack.push({'AXISNAME -> tk_descendant2 {SS = Tipos.AxisTipo}':['token: tk_descendant2\t Lexema: ' + $$[$0]]}); 
break;
case 96:
 this.$ = Tipos.AXIS_FOLLOWING;
						grammar_stack.push({'AXISNAME -> tk_following {SS = Tipos.AxisTipo}':['token: tk_following\t Lexema: ' + $$[$0]]}); 
break;
case 97:
 this.$ = Tipos.AXIS_FOLLOWING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_following2 {SS = Tipos.AxisTipo}':['token: tk_follownig2\t Lexema: ' + $$[$0]]}); 
break;
case 98:
 this.$ = Tipos.AXIS_NAMESPACE;
						grammar_stack.push({'AXISNAME -> tk_namespace {SS = Tipos.AxisTipo}':['token: tk_namespace\t Lexema: ' + $$[$0]]}); 
break;
case 99:
 this.$ = Tipos.AXIS_PARENT;
						grammar_stack.push({'AXISNAME -> tk_parent {SS = Tipos.AxisTipo}':['token: tk_parent\t Lexema: ' + $$[$0]]}); 
break;
case 100:
 this.$ = Tipos.AXIS_PRECEDING;
						grammar_stack.push({'AXISNAME -> tk_preceding {SS = Tipos.AxisTipo}':['token: tk_preceding\t Lexema: ' + $$[$0]]}); 
break;
case 101:
 this.$ = Tipos.AXIS_PRECEDING_SIBLING;
						grammar_stack.push({'AXISNAME -> tk_preceding2 {SS = Tipos.AxisTipo}':['token: tk_preceding2\t Lexema: ' + $$[$0]]}); 
break;
case 102:
 this.$ = Tipos.AXIS_SELF;
						grammar_stack.push({'AXISNAME -> tk_self {SS = Tipos.AxisTipo}':['token: tk_self\t Lexema: ' + $$[$0]]}); 
break;
}
},
table: [{3:1,4:2,6:3,7:5,8:$V0,9:8,10:9,11:$V1,12:$V2,19:$V3,20:25,31:4,32:$V4,33:$V5,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{1:[3]},{5:[1,47],51:[1,48]},{5:[1,49],7:50,8:$V0,9:8,10:9,11:$V1,12:$V2,19:$V3},o($Vv,[2,44],{56:13,57:14,70:17,71:18,82:19,20:25,50:26,52:51,32:$V4,33:$V5,44:$V6,53:$V7,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu}),o($Vw,[2,4]),o($Vx,[2,46]),o($Vw,[2,5]),o($Vw,[2,6]),o($Vw,[2,7]),o($Vw,[2,8]),{20:25,32:$V4,33:$V5,44:$V6,50:26,52:52,53:$V7,54:[1,53],56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,32:$V4,33:$V5,44:$V6,50:26,52:54,53:$V7,54:[1,55],56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($Vx,[2,51]),o($Vx,[2,52]),{13:56,20:58,23:57,32:$V4},{20:59,23:60,32:$V4},o($Vx,$Vy,{55:61,58:62,59:$Vz}),o($Vx,$Vy,{58:62,55:64,59:$Vz}),{83:[1,65]},{36:[1,66]},{36:[1,67]},{36:[1,68]},{36:[1,69]},o($VA,[2,75]),o($VA,[2,76]),o($VA,[2,77]),o($VA,[2,78]),o($VA,[2,79]),o($VA,[2,80]),{33:[1,70],54:[1,71]},{83:[2,90]},{83:[2,91]},{83:[2,92]},{83:[2,93]},{83:[2,94]},{83:[2,95]},{83:[2,96]},{83:[2,97]},{83:[2,98]},{83:[2,99]},{83:[2,100]},{83:[2,101]},{83:[2,102]},{33:[1,72]},o($VA,[2,83]),o($VA,[2,84]),{1:[2,1]},{20:25,31:73,32:$V4,33:$V5,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{1:[2,2]},o($Vw,[2,3]),o($Vx,[2,45]),o($Vx,[2,47]),o($Vx,$Vy,{58:62,55:74,59:$Vz}),o($Vx,[2,48]),o($Vx,$Vy,{58:62,55:75,59:$Vz}),{14:76,15:78,16:79,17:80,18:81,24:$VB,26:[1,77],27:$VC,29:$VD},o($VE,[2,24]),{34:$VF,35:$VG},{21:[1,87],34:$VF,35:$VG},o($Vw,[2,16]),o($Vx,[2,73]),o($Vx,[2,55],{59:[1,88]}),{20:25,25:89,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($Vx,[2,74]),{20:25,32:$V4,33:$V5,44:$V6,50:26,52:93,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{38:[1,94]},{38:[1,95]},{38:[1,96]},{38:[1,97]},o($VA,[2,81]),o($VA,[2,82]),o([5,8,11,12,19,21,24,26,27,29,32,33,34,35,37,38,40,42,44,47,49,51,53,54,59,60,61,62,63,64,65,66,67,68,69,72,73,74,75,76,77,78,79,80,81,84,85,86,87,88,89,90,91,92,93,94,95,96],[2,22]),o($Vv,[2,43],{56:13,57:14,70:17,71:18,82:19,20:25,50:26,52:51,32:$V4,33:$V5,44:$V6,53:$V7,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu}),o($Vx,[2,50]),o($Vx,[2,49]),o($Vw,[2,9],{16:79,17:80,18:81,15:98,24:$VB,27:$VC,29:$VD}),{20:58,23:99,32:$V4},o($VJ,[2,11]),o($VJ,[2,12]),o($VJ,[2,13],{26:[1,100]}),o($VJ,[2,14]),{20:25,25:101,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{28:[1,102]},{20:25,30:103,31:104,32:$V4,33:$V5,40:[1,105],44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,22:106,31:108,32:$V4,33:$V5,36:$VK,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:109,32:$V4},{20:25,22:110,31:108,32:$V4,33:$V5,36:$VK,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:111,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{40:$VL,42:$VM,49:$VN,54:$VO,60:[1,112],61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX},{20:25,25:126,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:127,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VY,[2,72],{56:13,57:14,70:17,71:18,82:19,20:25,50:26,52:51,32:$V4,33:$V5,44:$V6,53:$V7,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu}),o($Vx,[2,89]),o($VA,[2,85]),o($VA,[2,86]),o($VA,[2,87]),o($VA,[2,88]),o($VJ,[2,10]),o($VE,[2,23]),{20:25,25:128,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VJ,[2,17],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX}),{20:25,25:129,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VJ,[2,20]),o($VJ,[2,21],{56:13,57:14,70:17,71:18,82:19,20:25,50:26,52:51,32:$V4,33:$V5,44:$V6,53:$V7,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu}),{33:[1,130]},o($VZ,[2,25]),{20:25,25:131,31:92,32:$V4,33:$V5,36:$VH,39:132,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VZ,[2,29],{56:13,57:14,70:17,71:18,82:19,20:25,50:26,52:51,32:$V4,33:$V5,44:$V6,53:$V7,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu}),{34:[1,133]},o($Vw,[2,15]),{40:$VL,42:$VM,49:$VN,54:$VO,60:[1,134],61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX},o($VA,[2,54]),{20:25,25:135,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:136,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:137,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:138,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:139,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:140,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:141,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:142,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:143,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:144,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:145,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:146,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{20:25,25:147,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VY,[2,66]),{38:[1,148],40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX},o($VZ,[2,18],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX}),o($VZ,[2,19],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX}),o($V_,[2,42],{41:149,33:[1,150]}),o($V$,[2,31],{37:[1,151],40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX}),{26:[1,153],38:[1,152]},{20:25,22:154,31:108,32:$V4,33:$V5,36:$VK,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VA,[2,53]),o($V01,[2,57],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($V01,[2,58],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($V01,[2,59],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($V01,[2,60],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($V11,[2,61],{54:$VO,65:$VT,66:$VU}),o($V11,[2,62],{54:$VO,65:$VT,66:$VU}),o($VY,[2,63]),o($VY,[2,64]),o($VY,[2,65]),o([5,8,11,12,19,24,26,27,29,37,38,60,67],[2,68],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,68:$VW,69:$VX}),o([5,8,11,12,19,24,26,27,29,37,38,60,67,68],[2,69],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,69:$VX}),o($V01,[2,70],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($V01,[2,71],{54:$VO,63:$VR,64:$VS,65:$VT,66:$VU}),o($VY,[2,67]),{42:[1,155],44:[1,156]},{49:[1,157]},{20:25,25:158,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VZ,[2,28]),{20:25,25:159,31:92,32:$V4,33:$V5,36:$VH,44:$V6,50:26,52:6,53:$V7,56:13,57:14,64:$VI,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VZ,[2,26]),{33:$V21,40:[1,161],43:160,45:162,46:$V31},{42:[1,165]},{33:$V21,43:167,45:162,46:$V31,50:166,76:$Vc,77:$Vd},{38:[1,168],40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX},o($V$,[2,30],{40:$VL,42:$VM,49:$VN,54:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU,67:$VV,68:$VW,69:$VX}),{33:$V21,40:[1,169],45:170,46:$V31},{44:[1,171]},o($V41,[2,36]),o($V41,[2,37]),{20:25,31:172,32:$V4,33:$V5,44:$V6,48:[1,173],50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VJ,[2,34]),o($V_,[2,40]),o($V_,[2,41],{45:170,33:$V21,46:$V31}),o($VZ,[2,27]),{44:[1,174]},o($V41,[2,35]),{33:[1,175]},{20:25,32:$V4,33:$V5,44:$V6,47:[1,176],50:26,52:51,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{36:[1,177]},{33:[1,178]},{42:[1,179]},o($V41,[2,38]),{20:25,31:180,32:$V4,33:$V5,44:$V6,50:26,52:6,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},{42:[1,181]},o($VJ,[2,33]),{20:25,32:$V4,33:$V5,38:[1,182],44:$V6,50:26,52:51,53:$V7,56:13,57:14,70:17,71:18,72:$V8,73:$V9,74:$Va,75:$Vb,76:$Vc,77:$Vd,78:$Ve,79:$Vf,80:$Vg,81:$Vh,82:19,84:$Vi,85:$Vj,86:$Vk,87:$Vl,88:$Vm,89:$Vn,90:$Vo,91:$Vp,92:$Vq,93:$Vr,94:$Vs,95:$Vt,96:$Vu},o($VJ,[2,32]),{47:[1,183]},o($V41,[2,39])],
defaultActions: {31:[2,90],32:[2,91],33:[2,92],34:[2,93],35:[2,94],36:[2,95],37:[2,96],38:[2,97],39:[2,98],40:[2,99],41:[2,100],42:[2,101],43:[2,102],47:[2,1],49:[2,2]},
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
	function insert_current(_variable, _linea, _columna) {
		return builder.newAxis(builder.newExpression(builder.newCurrent(_variable, _linea, _columna), null, _linea, _columna), _linea, _columna)
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
case 3:return 72
break;
case 4:return 61
break;
case 5:return 62
break;
case 6:return 40
break;
case 7:return 42
break;
case 8:return 53
break;
case 9:return 44
break;
case 10:return 21
break;
case 11:return 49
break;
case 12:return 74
break;
case 13:return 73
break;
case 14:return 83
break;
case 15:return 75
break;
case 16:return 32
break;
case 17:return 59
break;
case 18:return 60
break;
case 19:return 36
break;
case 20:return 38
break;
case 21:return 46
break;
case 22:return 47
break;
case 23:return 54
break;
case 24:return 65
break;
case 25:return 85
break;
case 26:return 84
break;
case 27:return 86
break;
case 28:return 87
break;
case 29:return 89
break;
case 30:return 88
break;
case 31:return 91
break;
case 32:return 90
break;
case 33:return 92
break;
case 34:return 93
break;
case 35:return 95
break;
case 36:return 94
break;
case 37:return 96
break;
case 38:return 81
break;
case 39:return 79
break;
case 40:return 78
break;
case 41:return 80
break;
case 42:return 51
break;
case 43:return 63
break;
case 44:return 64
break;
case 45:return 69
break;
case 46:return 67
break;
case 47:return 68
break;
case 48:return 66
break;
case 49:return 'tk_doc'
break;
case 50:return 12
break;
case 51:return 35
break;
case 52:return 34
break;
case 53:return 19
break;
case 54:return 24
break;
case 55:return 27
break;
case 56:return 28
break;
case 57:return 29
break;
case 58:return 37
break;
case 59:return 26
break;
case 60:return 48
break;
case 61: attribute = ''; this.begin("string_doubleq"); 
break;
case 62: attribute += yy_.yytext; 
break;
case 63: attribute += "\""; 
break;
case 64: attribute += "\n"; 
break;
case 65: attribute += " ";  
break;
case 66: attribute += "\t"; 
break;
case 67: attribute += "\\"; 
break;
case 68: attribute += "\'"; 
break;
case 69: attribute += "\r"; 
break;
case 70: yy_.yytext = attribute; this.popState(); return 76; 
break;
case 71: attribute = ''; this.begin("string_singleq"); 
break;
case 72: attribute += yy_.yytext; 
break;
case 73: attribute += "\""; 
break;
case 74: attribute += "\n"; 
break;
case 75: attribute += " ";  
break;
case 76: attribute += "\t"; 
break;
case 77: attribute += "\\"; 
break;
case 78: attribute += "\'"; 
break;
case 79: attribute += "\r"; 
break;
case 80: yy_.yytext = attribute; this.popState(); return 77; 
break;
case 81:return 33
break;
case 82:return 5
break;
case 83: errors.push({ tipo: "Léxico", error: yy_.yytext, origen: "XQuery", linea: yy_.yylloc.first_line, columna: yy_.yylloc.first_column+1 }); return 'INVALID'; 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:\(:[\s\S\n]*?:\))/i,/^(?:<!--[\s\S\n]*?-->)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\/\/)/i,/^(?:\/)/i,/^(?::=)/i,/^(?:=)/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:::)/i,/^(?:@)/i,/^(?:\$)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\()/i,/^(?:\))/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\*)/i,/^(?:div\b)/i,/^(?:ancestor-or-self\b)/i,/^(?:ancestor\b)/i,/^(?:attribute\b)/i,/^(?:child\b)/i,/^(?:descendant-or-self\b)/i,/^(?:descendant\b)/i,/^(?:following-sibling\b)/i,/^(?:following\b)/i,/^(?:namespace\b)/i,/^(?:parent\b)/i,/^(?:preceding-sibling\b)/i,/^(?:preceding\b)/i,/^(?:self\b)/i,/^(?:node\b)/i,/^(?:last\b)/i,/^(?:text\b)/i,/^(?:position\b)/i,/^(?:\|)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:!=)/i,/^(?:or\b)/i,/^(?:and\b)/i,/^(?:mod\b)/i,/^(?:doc\b)/i,/^(?:for\b)/i,/^(?:at\b)/i,/^(?:in\b)/i,/^(?:let\b)/i,/^(?:where\b)/i,/^(?:order\b)/i,/^(?:by\b)/i,/^(?:return\b)/i,/^(?:to\b)/i,/^(?:,)/i,/^(?:data\b)/i,/^(?:["])/i,/^(?:[^"\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:["])/i,/^(?:['])/i,/^(?:[^'\\]+)/i,/^(?:\\")/i,/^(?:\\n)/i,/^(?:\s)/i,/^(?:\\t)/i,/^(?:\\\\)/i,/^(?:\\\\')/i,/^(?:\\r)/i,/^(?:['])/i,/^(?:[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"content":{"rules":[],"inclusive":false},"string_singleq":{"rules":[72,73,74,75,76,77,78,79,80],"inclusive":false},"string_doubleq":{"rules":[62,63,64,65,66,67,68,69,70],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,71,81,82,83],"inclusive":true}}
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
$$[$0-1].push($$[$0]);
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
const Funciones_1 = __importDefault(__webpack_require__(/*! ./Funciones */ "Dbnh"));
const Predicate_1 = __webpack_require__(/*! ../Predicate */ "Iysv");
function SelectAxis(_instruccion, _ambito, _contexto) {
    let _404 = { notFound: "No se encontraron elementos." };
    let contexto = (_contexto.elementos) ? (_contexto) : null;
    let expresion = Expresion_1.default(_instruccion, _ambito, contexto);
    if (expresion.error)
        return expresion;
    let root = getAxis(expresion.axisname, expresion.nodetest, expresion.predicate, contexto, _ambito, false);
    if (root === null || root.error || root.elementos.error || (root.elementos.length === 0 && root.atributos.length === 0))
        return _404;
    return root;
}
function getAxis(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar) {
    if (_contexto)
        return firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar);
    else
        return { error: "Indstrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
}
// Revisa el axisname y extrae los elementos
function firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar) {
    let elements = Array();
    let attributes = Array();
    let cadena = Enum_1.Tipos.ELEMENTOS;
    switch (_axisname) {
        case Enum_1.Tipos.AXIS_ANCESTOR: // Selects all ancestors (parent, grandparent, etc.) of the current node
        case Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF: // Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF) {
                    if (element.father)
                        elements.push(element);
                    else
                        elements.push(element.childs[0]);
                }
                let dad = element.father;
                if (dad) {
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_ATTRIBUTE: // Selects all attributes of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_isDoubleBar) {
                    attributes = _ambito.searchAnyAttributes("*", element, attributes);
                }
                else if (element.attributes)
                    element.attributes.forEach((attribute) => {
                        attributes.push(attribute);
                    });
            }
            cadena = Enum_1.Tipos.ATRIBUTOS;
            break;
        case Enum_1.Tipos.AXIS_CHILD: // Selects all children of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                // if (_isDoubleBar) {
                //     elements = _ambito.searchNodes("*", element, elements);
                // }
                if (element.childs)
                    element.childs.forEach((child) => {
                        elements.push(child);
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_DESCENDANT: // Selects all descendants (children, grandchildren, etc.) of the current node
        case Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF: // Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF) {
                    if (element.father)
                        elements.push(element);
                    // else elements.push(element.childs[0]);
                }
                if (element.father)
                    elements = _ambito.searchNodes("*", element, elements);
                else
                    elements = _ambito.searchNodes("*", element.childs[0], elements);
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
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
                else if (_axisname === Enum_1.Tipos.AXIS_FOLLOWING || _axisname === Enum_1.Tipos.AXIS_FOLLOWING_SIBLING) {
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_NAMESPACE: // Selects all namespace nodes of the current node
            return { error: "Error: la funcionalidad 'namespace' no está disponible.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
        case Enum_1.Tipos.AXIS_PARENT: // Selects the parent of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                let dad = element.father;
                if (dad)
                    _ambito.tablaSimbolos.forEach(elm => {
                        if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                            elements.push(elm);
                        if (elm.childs)
                            elm.childs.forEach(child => {
                                elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                            });
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_SELF: // Selects the current node
            if (_contexto.atributos)
                attributes = _contexto.atributos;
            else
                elements = _contexto.elementos;
            break;
        default:
            return { error: "Error: axisname no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    // return { elementos: elements, atributos: attributes, cadena: cadena };
    return secondFilter(elements, attributes, _nodetest, _predicate, cadena, _ambito, _isDoubleBar);
}
// Revisa el nodetest y busca hacer match
function secondFilter(_elements, _atributos, _nodetest, _predicate, _cadena, _ambito, _isDoubleBar) {
    let elements = Array();
    let attributes = Array();
    let text = Array();
    let valor = _nodetest.valor;
    switch (_nodetest.tipo) {
        case Enum_1.Tipos.ELEMENTOS:
        case Enum_1.Tipos.ASTERISCO:
        case Enum_1.Tipos.FUNCION_TEXT:
            if (_atributos.length > 0) {
                for (let i = 0; i < _atributos.length; i++) {
                    const attribute = _atributos[i];
                    if (attribute.id == valor || valor === "*") {
                        attributes.push(attribute);
                    }
                    if (attribute.value == valor) {
                        attributes.push(attribute);
                    }
                }
            }
            for (let i = 0; i < _elements.length; i++) {
                const element = _elements[i];
                if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT && element.value) {
                    let x = Funciones_1.default.f1(element, elements, text, _isDoubleBar);
                    elements.concat(x.elementos);
                    text.concat(x.texto);
                    _cadena = Enum_1.Tipos.TEXTOS;
                    continue;
                }
                else if (_atributos.length > 0 && element.attributes) {
                    let x = Funciones_1.default.f2(element, elements, attributes, valor, _isDoubleBar);
                    elements.concat(x.elementos);
                    attributes = attributes.concat(x.atributos);
                    _cadena = Enum_1.Tipos.ATRIBUTOS;
                    continue;
                }
                let x = Funciones_1.default.f3(element, elements, text, valor, _nodetest.tipo, _isDoubleBar);
                if (x.elementos.length > 0 || x.texto.length > 0) {
                    elements.concat(x.elementos);
                    text.concat(x.texto);
                    continue; // break;
                }
                x = Funciones_1.default.f4(element, elements, text, valor, _nodetest.tipo, _isDoubleBar);
                if (x.elementos.length > 0 || x.texto.length > 0) {
                    elements.concat(x.elementos);
                    text.concat(x.texto);
                    break; //continue;
                }
            }
            break;
        default:
            return { error: "Error: nodetest no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    // En caso de tener algún predicado
    if (_predicate) {
        let filter = new Predicate_1.Predicate(_predicate, _ambito, elements);
        if (attributes.length > 0) {
            attributes = filter.filterAttributes(attributes);
            return { elementos: [], atributos: attributes, cadena: _cadena };
        }
        elements = filter.filterElements(elements);
    }
    return { elementos: elements, atributos: attributes, texto: text, cadena: _cadena };
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
    if (operators.error)
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
    if (op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto);
    if (op2.error)
        return op2;
    let tipo = _tipo;
    if (op1.tipo === Enum_1.Tipos.FUNCION_LAST && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.length;
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_LAST) {
        op1 = Number(op1.valor);
        op2 = _contexto.length;
    }
    else if (op1.tipo === Enum_1.Tipos.FUNCION_POSITION && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.length;
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_POSITION) {
        op1 = Number(op1.valor);
        op2 = _contexto.length;
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
    }
    else
        return { error: "Solamente se pueden operar aritméticamente valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
    return { op1: op1, op2: op2, tipo: tipo };
}
function suma(_opIzq, _opDer) {
    return {
        valor: (_opIzq + _opDer),
        tipo: Enum_1.Tipos.NUMBER,
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
    return {
        valor: (_opIzq / _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function modulo(_opIzq, _opDer) {
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
    // console.log(_opIzq,818181818118)
    let op1 = Expresion(_opIzq, _ambito, _contexto, id);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion((Array.isArray(_opDer)) ? (_opDer[0]) : (_opDer), _ambito, _contexto, id);
    if (op1 === null || op2.error)
        return op2;
    let tipo = _tipo;
    // Numéricas
    // console.log(op1, op2, tipo, 1010101010)
    if (Array.isArray(op1) || Array.isArray(op2)) {
        if (Array.isArray(op1) && (op2.tipo === Enum_1.Tipos.NUMBER || op2.tipo === Enum_1.Tipos.STRING)) {
            _contexto = Match_1.default(op2.valor, tipo, _ambito, op1[0].elementos);
            // console.log(_contexto, 6777777777);
            return _contexto;
        }
    }
    if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL ||
        tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL) {
        if ((op1.tipo === Enum_1.Tipos.FUNCION_POSITION || op1.tipo === Enum_1.Tipos.FUNCION_LAST) && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = _contexto.length;
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            op2 = Number(op1.valor);
            op1 = _contexto.length;
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
            opIzq.valor = _contexto.length;
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _contexto.length;
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