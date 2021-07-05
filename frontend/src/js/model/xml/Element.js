"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
class Element {
    constructor(id_open, attributes, value, childs, line, column, id_close) {
        this.stack_index_ = 0;
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
    set3DCode(parent) {
        let stack_temp = Element.getNextTemp();
        Element.code_definition = Element.code_definition + `float ${stack_temp} = SP;
        `;
        this.stack_index_ = Element.stack_index;
        Element.stack_index = Element.stack_index + 5;
        Element.code_definition = Element.code_definition + `SP = ${Element.stack_index};
        STACK[(int)${stack_temp}] = (float) ${Element.heap_index};         
        `;
        Element.pushStringToHeap(this.id_open);
        this.setContent(stack_temp);
        this.setAttributes(stack_temp);
        this.setChildren(stack_temp);
        this.setParent(stack_temp, parent);
    }
    /*
     1) tipo
     2) apuntador al valor si es string o valor si es number
    */
    setContent(current_stack_index) {
        let temp_content_index = Element.heap_index;
        let temp = Element.getNextTemp();
        if (this.value == null) {
            Element.code_definition = Element.code_definition + `
            int ${temp} = ${current_stack_index} + 1;
            STACK[(int) ${temp}] = (float) -1;
            `;
            return;
        }
        else {
            Element.code_definition = Element.code_definition + `
            int ${temp} = ${current_stack_index} + 1;
            STACK[(int) ${temp}] = (float) ${Element.heap_index};
            `;
            let str_val = this.value;
            if (isNaN(Number(str_val))) { // Is string
                Element.code_definition = Element.code_definition + `${temp} = ${Element.heap_index};
            HEAP[${temp}] = 2;`;
                Element.heap_index++;
                Element.pushStringToHeap(str_val);
            }
            else { //Is Number
                Element.code_definition = Element.code_definition + `${temp} = ${Element.heap_index};
            HEAP[${temp}] = 1;`;
                Element.heap_index++;
                Element.code_definition = Element.code_definition + `${temp} = ${Element.heap_index};
                HEAP[${temp}] = ${str_val};
                `;
                Element.heap_index++;
            }
        }
    }
    setAttributes(current_heap_index) {
        let temp = Element.getNextTemp();
        if (this.attributes == null) {
            Element.code_definition = Element.code_definition + `
            float ${temp} = ${current_heap_index} + 2;
            STACK[(int) ${temp}] = (float) -1;
            `;
            return;
        }
        else {
            Element.code_definition = Element.code_definition + `/*  ***********Atributos********** */
            float ${temp} = ${current_heap_index} + 2;
            STACK[(int) ${temp}] = (float) ${Element.heap_index};
            `;
            // temp_att_gen_index es el indice para mis atributos y el heap es el indice para los actual key value
            let temp_att_gen_index = Element.heap_index;
            Element.heap_index = Element.heap_index + this.attributes.length + 1;
            for (let i = 0; i < this.attributes.length; i++) {
                let temp1 = Element.getNextTemp();
                let index_attr = Element.setSingleAttribute(this.attributes[i]);
                Element.code_definition = Element.code_definition + `
                float ${temp1} = ${temp_att_gen_index + i};  
                HEAP[(int) ${temp1}] = ${index_attr};
                `;
            }
            let temp2 = Element.getNextTemp();
            Element.code_definition = Element.code_definition + `float ${temp2} = ${temp_att_gen_index + this.attributes.length};
            HEAP[(int)${temp2}] = 0;
            `; //TODO: \\0
        }
    }
    /*
    1) reservar su memoria en heap
    2) devolverme su indice inicial

    Type = 1 number; = 2 String
        */
    static setSingleAttribute(attr) {
        let temp_att_index = Element.heap_index;
        Element.heap_index = Element.heap_index + 4; // 1) key 2) value 3) type 4) NULL
        let temp = Element.getNextTemp();
        let attr_id_index = Element.setAttributeKey(attr.id);
        Element.code_definition = Element.code_definition + `
        /*Start single attribute*/
        int ${temp} = ${temp_att_index};
        HEAP[ ${temp}] = ${attr_id_index};  
                `;
        temp_att_index++;
        let attr_val = attr.value;
        if (isNaN(Number(attr_val))) { // Is string
            Element.code_definition = Element.code_definition + `${temp} = ${temp_att_index};
            HEAP[${temp}] = 2;
            `;
            temp_att_index++;
            //let attr_val_index = Element.setAttributeValue(attr.value.slice(0,-1).substring(1));
            let attr_val_index = Element.setAttributeValue(attr.value);
            Element.code_definition = Element.code_definition + `${temp} = ${temp_att_index};
        HEAP[(int) ${temp}] = ${attr_val_index}; // index_val_attr = ${attr_val}   
                `;
            temp_att_index++;
        }
        else { // Is number
            Element.code_definition = Element.code_definition + `${temp} = ${temp_att_index};
            HEAP[${temp}] = 1;
            `;
            temp_att_index++;
            Element.code_definition = Element.code_definition + `${temp} = ${temp_att_index};
        HEAP[(int) ${temp}] = ${attr_val};// val_attr = ${attr_val}  
                `;
            temp_att_index++;
        }
        Element.code_definition = Element.code_definition + `${temp} = ${temp_att_index};
        HEAP[(int) ${temp}] = 0;
        /*End single attribute*/
                `; //TODO \\0
        return temp_att_index - 3;
    }
    static setAttributeKey(val) {
        let temp = Element.heap_index;
        Element.pushStringToHeap(val);
        return temp;
    }
    static setAttributeValue(val) {
        let temp = Element.heap_index;
        Element.pushStringToHeap(val);
        return temp;
    }
    setChildren(current_stack_index) {
        let temp = Element.getNextTemp();
        if (this.childs == null) { // It doesnt have children;
            Element.code_definition = Element.code_definition + `
            float ${temp} = ${current_stack_index} + 3;
            STACK[(int) ${temp}] = (float) -1;
            `;
            return;
        }
        else {
            let temp_att_index = Element.heap_index;
            Element.heap_index = Element.heap_index + this.childs.length + 1;
            for (let i = 0; i < this.childs.length; i++) {
                this.childs[i].set3DCode(current_stack_index);
            }
            for (let i = 0; i < this.childs.length; i++) {
                let temp1 = Element.getNextTemp();
                Element.code_definition = Element.code_definition + `float ${temp1} = ${temp_att_index + i}; 
                HEAP[(int) ${temp1}] = ${this.childs[i].stack_index_};
                `;
            }
            Element.code_definition = Element.code_definition + `float ${temp} = ${current_stack_index} + 3;
            STACK[(int) ${temp}] = (float) ${temp_att_index};
            `;
        }
    }
    static pushStringToHeap(str_val) {
        for (let i = 0; i < str_val.length; i++) {
            let temp = Element.getNextTemp();
            Element.code_definition = Element.code_definition + `float ${temp} = ${Element.heap_index};
            HEAP[(int)${temp}] = (float) ${str_val[i].charCodeAt(0)}; // PSH = ${str_val[i]} 
            `;
            Element.heap_index++;
            Element.code_definition = Element.code_definition + `HP = ${Element.heap_index};
            `;
        }
        let temp = Element.getNextTemp();
        Element.code_definition = Element.code_definition + `float ${temp} = HP;
            HEAP[(int)${temp}] = (float) 0;
            `;
        Element.heap_index++;
        /*Element.code_definition = Element.code_definition + `HP = ${Element.heap_index};

        Heap pointer value is ${Element.heap_index}
        Stack pointer value is ${Element.stack_index}

            `;*/
    }
    static getNextTemp() {
        Element.temp_counter++;
        let temp = Element.temp_counter;
        return "t" + temp;
    }
    setParent(current_stack_index, parent) {
        let temp = Element.getNextTemp();
        if (parent == null) {
            Element.code_definition = Element.code_definition + `
    float ${temp} = ${current_stack_index} + 4;
    STACK[(int) ${temp}] = (float) -1; // Parent NULL
`;
        }
        else {
            Element.code_definition = Element.code_definition + `
    float ${temp} = ${current_stack_index} + 4;
    STACK[(int) ${temp}] = ${parent}; // Parent
`;
        }
    }
}
exports.Element = Element;
/*********************3D Code*****************************/
Element.temp_counter = -1;
Element.heap_index = 1;
Element.stack_index = 1;
Element.code_definition = "";
