"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XQueryTranslator = void 0;
var Environment_1 = require("./Environment");
var Element_1 = require("../model/xml/Element");
var XQueryTranslator = /** @class */ (function () {
    function XQueryTranslator(ast, root) {
        this.ast = ast;
        this.root = root;
        this.str = "";
        this.debug = false;
        this.show_obj = false;
        this.environment = new Environment_1.Environment();
        this.header = "";
        this.code = "";
        this.tagNumber = -1;
        this.varNumber = -1;
        this.funNumber = -1;
        this.HP = Element_1.Element.heap_index;
        this.SP = Element_1.Element.stack_index;
        console.log(this.HP);
        console.log(this.SP);
    }
    XQueryTranslator.prototype.translate = function () {
        for (var i = 0; i < this.ast.length; i++) {
            switch (this.ast[i]['tipo']) {
                case 'FOR_LOOP':
                    this.FOR_LOOP(this.ast[i], this.environment);
                    break;
                case 'ORDER_BY_CLAUSE':
                    this.ORDER_BY_CLAUSE(this.ast[i]);
                    break;
                case 'RETURN_STATEMENT':
                    this.RETURN_STATEMENT(this.ast[i]);
                    break;
                default:
                    console.log("Error 1");
            }
        }
    };
    XQueryTranslator.prototype.FOR_LOOP = function (obj, env) {
        if (this.debug) {
            console.log("FOR_LOOP" + (this.show_obj ? "\n" + obj : ""));
        }
        for (var i = 0; i < obj['cuerpo'].length; i++) {
            switch (obj['cuerpo'][i]['tipo']) {
                case 'DECLARACION':
                    this.DECLARACION(obj['cuerpo'][i], env);
                    break;
                default:
                    console.log("ERROR 2:\n" + obj);
            }
        }
        /*
        switch () {
        }*/
    };
    XQueryTranslator.prototype.ORDER_BY_CLAUSE = function (obj) {
        if (this.debug) {
            console.log("ORDER_BY_CLAUSE" + (this.show_obj ? "\n" + obj : ""));
        }
    };
    XQueryTranslator.prototype.RETURN_STATEMENT = function (obj) {
        if (this.debug) {
            console.log("RETURN_STATEMENT" + (this.show_obj ? "\n" + obj : ""));
        }
    };
    XQueryTranslator.prototype.DECLARACION = function (obj, env) {
        if (this.debug) {
            console.log('DECLARATION' + (this.show_obj ? "\n" + obj : ""));
        }
        if (obj['variable'] != null) {
            env.addVariable(obj['variable']['variable']);
        }
        else {
            console.log("ERROR 4");
        }
        for (var i = 0; i < obj['iterators'].length; i++) {
            switch (obj['iterators'][i]['tipo']) {
                case 'SELECT_FROM_CURRENT':
                    //console.log('SELECT_FROM_CURRENT');
                    //console.log(obj['iterators'][i]);
                    break;
                case 'SELECT_FROM_ROOT':
                    //console.log('SELECT_FROM_ROOT');
                    //console.log(obj['iterators'][i]);
                    this.EXPRESION(obj['iterators'][i]['expresion'], (i == 0));
                    break;
                case 'EXPRESION':
                    console.log('EXPRESION');
                    this.EXPRESION(obj['iterators'][i], (i == 0));
                    break;
                default:
                    console.log(obj);
                    console.log("ERROR 3\n" + obj['iterators'][i]);
                    break;
            }
        }
    };
    //fromStack if its the first iteration will look on stack
    XQueryTranslator.prototype.EXPRESION = function (obj, fromStack) {
        var predicate = obj['predicate'];
        if (predicate == null) { }
        this.expresion_(obj['expresion'], fromStack, (predicate == null ? null : this.predicate(obj['predicate'])));
    };
    XQueryTranslator.prototype.expresion_ = function (obj, fromRoot, predicate_f) {
        switch (obj['tipo']) {
            case 'NODENAME':
                //console.log(obj);
                //console.log(obj['nodename']);
                if (fromRoot) {
                    this.setSearchMethodFromStack(obj['nodename'], predicate_f);
                }
                /*buscar en el stack todos los que coincidan con nodeName obj['nodename']
                // push obj['nodename'] en un the heap while increasing heap counter
                // push nodename index into stack_params
                // iterate through the stack by increments of 4 send the pointer of each element to the compare funciont
                // if returns true save the element returned on the heap keeping track of the first one
                // to keep it like index*/
                break;
            case 'SELECT_CURRENT':
                console.log(obj);
                console.log(obj['expresion']);
                break;
            default:
                console.log("Error 4");
                break;
        }
    };
    XQueryTranslator.prototype.predicate = function (obj) {
        console.log(obj);
        var function_name = this.getNextFun();
        return function_name;
    };
    XQueryTranslator.prototype.setSearchMethodFromStack = function (node_name, predicate_f) {
        var function_name = this.getNextFun();
        var main_var = this.getNextVar();
        var var1 = this.getNextVar();
        var var2 = this.getNextVar();
        var var3 = this.getNextVar();
        var var4 = this.getNextVar();
        var var5 = this.getNextVar();
        var label1 = this.getNextTag();
        var label2 = this.getNextTag();
        var label3 = this.getNextTag();
        var label4 = this.getNextTag();
        this.header = this.header + (function_name + "();\n");
        this.code = this.code + ("\n        /*This is the code to pull data from the stack, searches for tag " + node_name + "*/\nvoid " + function_name + "(){\n    STACK_FUNC[SF] = HP;\n    SF = SF + 1;\n");
        for (var i = 0; i < node_name.length; i++) {
            this.code = this.code + ("   HEAP[(int)HP] = '" + node_name[i] + "';\n    HP = HP + 1;\n");
        }
        this.code = this.code + ("   HEAP[(int)HP] = '\\0';\n    HP = HP + 1;\n    int " + main_var + " = HP;\n    int " + var1 + " = 1;\n    STACK_FUNC[SF] = STACK[" + var1 + "];\n    SF = SF + 1;\n    compareTwoStrings();\n    int " + var2 + " = (int) STACK_FUNC[SF];\n    if(" + var2 + " != 1){goto " + label1 + ";}\n    int " + var3 + " = STACK[" + var1 + "];\n    HEAP[(int)HP] = " + var3 + ";\n    HP = HP + 1;\n    " + label1 + ":\n    STACK_FUNC[SF] = 0;\n    SF = SF -1;\n    STACK_FUNC[SF] = 0;\n \n    " + var1 + " = 5;\n    " + label2 + ":\n    ;\n    if(STACK[" + var1 + "] == 0){goto " + label3 + ";}\n    STACK_FUNC[SF] = STACK[" + var1 + "];\n    SF = SF + 1;\n    compareTwoStrings();\n    int " + var4 + " = (int) STACK_FUNC[SF];\n    if(" + var4 + " != 1){goto " + label4 + ";}\n    int " + var5 + " = STACK[" + var1 + "];\n    HEAP[(int)HP] = " + var5 + ";\n    HP = HP + 1;\n    " + label4 + ":\n    STACK_FUNC[SF] = 0;\n    SF = SF -1;\n    STACK_FUNC[SF] = 0;\n    " + var1 + " = " + var1 + " + 4;\n    goto " + label2 + ";\n    " + label3 + ":\n    ;\n    HEAP[(int)HP] = 0;\n    HP = HP + 1;    \n");
        this.code = this.code + ("   " + (predicate_f == null ? "" : predicate_f + '();') + "\n}");
    };
    XQueryTranslator.prototype.getNextFun = function () {
        return 'f' + (++this.funNumber);
    };
    XQueryTranslator.prototype.setHelpFunctions = function () {
        var var1 = this.getNextVar();
        var var2 = this.getNextVar();
        var var3 = this.getNextVar();
        var var4 = this.getNextVar();
        var var5 = this.getNextVar();
        var var6 = this.getNextVar();
        var var7 = this.getNextVar();
        var var8 = this.getNextVar();
        var tag1 = this.getNextTag();
        var tag2 = this.getNextTag();
        var tag3 = this.getNextTag();
        var tag4 = this.getNextTag();
        var tag5 = this.getNextTag();
        var tag6 = this.getNextTag();
        this.code = this.code + ("void compareTwoStrings(){\n    int " + var1 + " = SF -1;\n    int " + var2 + " = (int )STACK_FUNC[" + var1 + "];\n    " + var1 + " = SF -2;\n    int " + var3 + " = (int )STACK_FUNC[" + var1 + "];\n    int " + var8 + " = 0;\n\n    " + tag1 + ":\n    if(HEAP[" + var2 + "] == 0){goto " + tag3 + ";}\n    if(HEAP[" + var3 + "] == 0 ){goto " + tag3 + ";}\n    int " + var4 + " = HEAP[" + var2 + "];\n    int " + var5 + " = HEAP[" + var3 + "];\n    if(" + var4 + " == " + var5 + "){goto " + tag2 + ";}\n    goto " + tag4 + ";\n    " + tag2 + ":\n    " + var2 + " = " + var2 + " + 1;\n    " + var3 + " = " + var3 + " + 1;\n    goto " + tag1 + ";\n    " + tag3 + ":\n    int " + var6 + " = HEAP[" + var2 + "];\n    int " + var7 + " = HEAP[" + var3 + "];\n    if(" + var6 + " == " + var7 + "){goto " + tag5 + ";}\n    " + tag4 + ":\n    " + var1 + " = SF;\n    " + var8 + " = 0;\n    STACK_FUNC[" + var1 + "] = " + var8 + ";\n    goto " + tag6 + ";\n\n    " + tag5 + ":\n    " + var1 + " = SF;\n    " + var8 + " = 1;\n    STACK_FUNC[" + var1 + "] = " + var8 + ";\n\n    " + tag6 + ":\n    ;\n}\n");
        this.header = this.header + "void compareTwoStrings();";
    };
    XQueryTranslator.prototype.getCode = function () {
        this.setHelpFunctions();
        return this.header + this.code;
    };
    XQueryTranslator.prototype.getNextVar = function () {
        return 't' + (++this.varNumber);
    };
    XQueryTranslator.prototype.getNextTag = function () {
        return 'label_' + (++this.tagNumber);
    };
    return XQueryTranslator;
}());
exports.XQueryTranslator = XQueryTranslator;
//# sourceMappingURL=xQueryTranslator.js.map