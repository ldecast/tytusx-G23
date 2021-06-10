"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
var Element = /** @class */ (function () {
    function Element(id_open, attributes, value, childs, line, column, id_close) {
        this.id_open = id_open;
        this.attributes = attributes;
        this.value = value;
        this.childs = childs;
        this.line = line;
        this.column = column;
        this.id_close = id_close;
        this.father = null;
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
