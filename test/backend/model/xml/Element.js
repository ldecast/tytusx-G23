"use strict";
// noinspection DuplicatedCode
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
        this.father = null;
    }
    Element.prototype.set3DCode = function () {
        var stack_temp = Element.getNextTemp();
        Element.code_definition = Element.code_definition + ("float " + stack_temp + " = SP;\n        ");
        this.stack_index_ = Element.stack_index;
        Element.stack_index = Element.stack_index + 4;
        Element.code_definition = Element.code_definition + ("SP = " + Element.stack_index + ";\n        STACK[(int)" + stack_temp + "] = (float) " + Element.heap_index + ";         \n        ");
        Element.pushStringToHeap(this.id_open);
        this.setContent(stack_temp);
        this.setAttributes(stack_temp);
        this.setChildren(stack_temp);
    };
    /*
     1) tipo
     2) apuntador al valor si es string o valor si es number
    */
    Element.prototype.setContent = function (current_stack_index) {
        var temp_content_index = Element.heap_index;
        var temp = Element.getNextTemp();
        if (this.value == null) {
            Element.code_definition = Element.code_definition + ("\n            int " + temp + " = " + current_stack_index + " + 1;\n            STACK[(int) " + temp + "] = (float) -1;\n            ");
            return;
        }
        else {
            Element.code_definition = Element.code_definition + ("\n            int " + temp + " = " + current_stack_index + " + 1;\n            STACK[(int) " + temp + "] = (float) " + Element.heap_index + ";\n            ");
            var str_val = this.value;
            if (isNaN(Number(str_val))) { // Is string
                Element.code_definition = Element.code_definition + (temp + " = " + Element.heap_index + ";\n            HEAP[" + temp + "] = 2;");
                Element.heap_index++;
                Element.pushStringToHeap(str_val);
            }
            else { //Is Number
                Element.code_definition = Element.code_definition + (temp + " = " + Element.heap_index + ";\n            HEAP[" + temp + "] = 1;");
                Element.heap_index++;
                Element.code_definition = Element.code_definition + (temp + " = " + Element.heap_index + ";\n                HEAP[" + temp + "] = " + str_val + ";\n                ");
                Element.heap_index++;
            }
        }
    };
    Element.prototype.setAttributes = function (current_heap_index) {
        var temp = Element.getNextTemp();
        if (this.attributes == null) {
            Element.code_definition = Element.code_definition + ("\n            float " + temp + " = " + current_heap_index + " + 2;\n            STACK[(int) " + temp + "] = (float) -1;\n            ");
            return;
        }
        else {
            Element.code_definition = Element.code_definition + ("/*  ***********Atributos********** */\n            float " + temp + " = " + current_heap_index + " + 2;\n            STACK[(int) " + temp + "] = (float) " + Element.heap_index + ";\n            ");
            // temp_att_gen_index es el indice para mis atributos y el heap es el indice para los actual key value
            var temp_att_gen_index = Element.heap_index;
            Element.heap_index = Element.heap_index + this.attributes.length + 1;
            for (var i = 0; i < this.attributes.length; i++) {
                var temp1 = Element.getNextTemp();
                var index_attr = Element.setSingleAttribute(this.attributes[i]);
                Element.code_definition = Element.code_definition + ("\n                float " + temp1 + " = " + (temp_att_gen_index + i) + ";  \n                HEAP[(int) " + temp1 + "] = " + index_attr + ";\n                ");
            }
            var temp2 = Element.getNextTemp();
            Element.code_definition = Element.code_definition + ("float " + temp2 + " = " + (temp_att_gen_index + this.attributes.length) + ";\n            HEAP[(int)" + temp2 + "] = 0;\n            "); //TODO: \\0
        }
    };
    /*
    1) reservar su memoria en heap
    2) devolverme su indice inicial

    Type = 1 number; = 2 String
        */
    Element.setSingleAttribute = function (attr) {
        var temp_att_index = Element.heap_index;
        Element.heap_index = Element.heap_index + 4; // 1) key 2) value 3) type 4) NULL
        var temp = Element.getNextTemp();
        var attr_id_index = Element.setAttributeKey(attr.id.slice(0, -1));
        Element.code_definition = Element.code_definition + ("\n        /*Start single attribute*/\n        int " + temp + " = " + temp_att_index + ";\n        HEAP[ " + temp + "] = " + attr_id_index + ";  \n                ");
        temp_att_index++;
        var attr_val = attr.value.slice(0, -1).substring(1);
        if (isNaN(Number(attr_val))) { // Is string
            Element.code_definition = Element.code_definition + (temp + " = " + temp_att_index + ";\n            HEAP[" + temp + "] = 2;\n            ");
            temp_att_index++;
            var attr_val_index = Element.setAttributeValue(attr.value.slice(0, -1).substring(1));
            Element.code_definition = Element.code_definition + (temp + " = " + temp_att_index + ";\n        HEAP[(int) " + temp + "] = " + attr_val_index + ";  \n                ");
            temp_att_index++;
        }
        else { // Is number
            Element.code_definition = Element.code_definition + (temp + " = " + temp_att_index + ";\n            HEAP[" + temp + "] = 1;\n            ");
            temp_att_index++;
            Element.code_definition = Element.code_definition + (temp + " = " + temp_att_index + ";\n        HEAP[(int) " + temp + "] = " + attr_val + ";  \n                ");
            temp_att_index++;
        }
        Element.code_definition = Element.code_definition + (temp + " = " + temp_att_index + ";\n        HEAP[(int) " + temp + "] = 0;\n        /*End single attribute*/\n                "); //TODO \\0
        return temp_att_index - 3;
    };
    Element.setAttributeKey = function (val) {
        var temp = Element.heap_index;
        Element.pushStringToHeap(val);
        return temp;
    };
    Element.setAttributeValue = function (val) {
        var temp = Element.heap_index;
        Element.pushStringToHeap(val);
        return temp;
    };
    Element.prototype.setChildren = function (current_heap_index) {
        var temp = Element.getNextTemp();
        if (this.childs == null) {
            Element.code_definition = Element.code_definition + ("\n            float " + temp + " = " + current_heap_index + " + 3;\n            STACK[(int) " + temp + "] = (float) -1;\n            ");
            return;
        }
        else {
            var temp_att_index = Element.heap_index;
            Element.heap_index = Element.heap_index + this.childs.length + 1;
            for (var i = 0; i < this.childs.length; i++) {
                this.childs[i].set3DCode();
            }
            for (var i = 0; i < this.childs.length; i++) {
                var temp1 = Element.getNextTemp();
                Element.code_definition = Element.code_definition + ("float " + temp1 + " = " + (temp_att_index + i) + "; \n                HEAP[(int) " + temp1 + "] = " + this.childs[i].stack_index_ + ";\n                ");
            }
            Element.code_definition = Element.code_definition + ("float " + temp + " = " + current_heap_index + " + 3;\n            STACK[(int) " + temp + "] = (float) " + temp_att_index + ";\n            ");
        }
    };
    Element.pushStringToHeap = function (str_val) {
        for (var i = 0; i < str_val.length; i++) {
            var temp_1 = Element.getNextTemp();
            Element.code_definition = Element.code_definition + ("float " + temp_1 + " = " + Element.heap_index + ";\n            HEAP[(int)" + temp_1 + "] = (float) " + str_val[i].charCodeAt(0) + ";\n            ");
            Element.heap_index++;
            Element.code_definition = Element.code_definition + ("HP = " + Element.heap_index + ";\n            ");
        }
        var temp = Element.getNextTemp();
        Element.code_definition = Element.code_definition + ("float " + temp + " = HP;\n            HEAP[(int)" + temp + "] = (float) 0;\n            ");
        Element.heap_index++;
        /*Element.code_definition = Element.code_definition + `HP = ${Element.heap_index};

        Heap pointer value is ${Element.heap_index}
        Stack pointer value is ${Element.stack_index}

            `;*/
    };
    Element.getNextTemp = function () {
        Element.temp_counter++;
        var temp = Element.temp_counter;
        return "t" + temp;
    };
    /*************************************************/
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
    Element.prototype.getASTXMLTree = function () {
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
                str = str + value.getASTXMLTree();
            });
            str = str + "</ul></li>\n";
        }
        str = str + "</ul></li>\n";
        return str;
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
        get: function () {
            return this.childs;
        },
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
    Element.prototype.printChildren = function () {
        var _this = this;
        if (this.childs == null) {
            return;
        }
        this.childs.forEach(function (value) {
            console.log(_this);
            value.printChildren();
        });
    };
    /*********************3D Code*****************************/
    Element.temp_counter = -1;
    Element.heap_index = 1;
    Element.stack_index = 1;
    Element.code_definition = "";
    return Element;
}());
exports.Element = Element;
//# sourceMappingURL=Element.js.map