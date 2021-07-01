import {Environment} from "./Environment";
import {Element} from "../model/xml/Element";

export class XQueryTranslator {
    private str: string = "";
    private debug: boolean = false;
    private show_obj: boolean = false;
    private environment: Environment = new Environment();
    private header: string = "";
    private code:  string = "";
    private tagNumber: number = -1;
    private varNumber: number = -1;
    private funNumber: number = -1;
    public  HP:number;
    public SP:number;
    constructor( public ast:object[], public root: Element) {
        this.HP = Element.heap_index;
        this.SP = Element.stack_index;
        console.log(this.HP)
        console.log(this.SP)
    }

    public translate(){
        for(let i = 0; i < this.ast.length; i++){
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
    }

    private  FOR_LOOP(obj: object, env: Environment): void{
        if(this.debug){console.log("FOR_LOOP" + (this.show_obj? "\n"+obj:""));}

        for (let i:number = 0; i < obj['cuerpo'].length; i++){
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

    }

    private ORDER_BY_CLAUSE(obj: object): void{
        if(this.debug){console.log("ORDER_BY_CLAUSE" + (this.show_obj? "\n"+obj:""));}

    }
    private RETURN_STATEMENT(obj: object): void{
        if(this.debug){console.log("RETURN_STATEMENT" + (this.show_obj? "\n"+obj:""));}

    }

    private DECLARACION(obj, env: Environment){
        if(this.debug){console.log('DECLARATION' + (this.show_obj? "\n"+obj:""));}
        if(obj['variable'] !=null){
            env.addVariable(obj['variable']['variable']);
        }else {
            console.log("ERROR 4");
        }

        for (let i: number = 0; i < obj['iterators'].length; i++){
            switch (obj['iterators'][i]['tipo']){
                case 'SELECT_FROM_CURRENT':
                    //console.log('SELECT_FROM_CURRENT');
                    //console.log(obj['iterators'][i]);
                    break;
                case 'SELECT_FROM_ROOT':
                    //console.log('SELECT_FROM_ROOT');
                    //console.log(obj['iterators'][i]);
                    this.EXPRESION(obj['iterators'][i]['expresion'], (i ==0));
                    break;
                case 'EXPRESION':
                    console.log('EXPRESION');
                    this.EXPRESION(obj['iterators'][i], (i ==0));
                    break;
                default:
                    console.log(obj)
                    console.log("ERROR 3\n" + obj['iterators'][i]);
                    break;
            }
        }
    }
    //fromStack if its the first iteration will look on stack
    private EXPRESION(obj: object, fromStack: boolean){
        let predicate: Object = obj['predicate'];
        if (predicate == null){}

        this.expresion_(obj['expresion'], fromStack, (predicate == null?null: this.predicate(obj['predicate']) ));

    }



    private expresion_(obj: object, fromRoot: boolean, predicate_f?: string){
        switch (obj['tipo']) {
            case 'NODENAME':
                //console.log(obj);
                //console.log(obj['nodename']);
                if (fromRoot){
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

    }


    private predicate(obj: object) : string{
        console.log(obj);

        let function_name: string = this.getNextFun();
        return function_name;
    }

    private setSearchMethodFromStack(node_name: string, predicate_f?: string){
        let function_name: string = this.getNextFun();
        let main_var = this.getNextVar();

        let var1 = this.getNextVar();
        let var2 = this.getNextVar();
        let var3 = this.getNextVar();


        let label1 = this.getNextTag();
        let label2 = this.getNextTag();
        let label3 = this.getNextTag();
        let label4 = this.getNextTag();
        this.header = this.header + `void ${function_name}();
`;
        this.code = this.code + `
        /*This is the code to pull data from the stack, searches for tag ${node_name}*/
void ${function_name}(){
    STACK_FUNC[SF] = HP;
    SF = SF + 1;
`;

        for(let i = 0; i < node_name.length; i++){
            this.code = this.code + `   HEAP[(int)HP] = '${node_name[i]}';
    HP = HP + 1;
`;
        }
        this.code = this.code + `   HEAP[(int)HP] = '\\0';
    HP = HP + 1;
    int ${main_var} = HP;
    int ${var1} = 1;
    STACK_FUNC[SF] = STACK[${var1}];
    SF = SF + 1;
    compareTwoStrings();
    int ${var2} = (int) STACK_FUNC[SF];
    if(${var2} != 1){goto ${label1};}
    HEAP[(int)HP] = ${var1};
    HP = HP + 1;
    ${label1}:
    STACK_FUNC[SF] = 0;
    SF = SF -1;
    STACK_FUNC[SF] = 0;
 
    ${var1} = 5;
    ${label2}:
    ;
    if(STACK[${var1}] == 0){goto ${label3};}
    STACK_FUNC[SF] = STACK[${var1}];
    SF = SF + 1;
    compareTwoStrings();
    int ${var3} = (int) STACK_FUNC[SF];
    if(${var3} != 1){goto ${label4};}
    HEAP[(int)HP] = ${var1};
    HP = HP + 1;
    ${label4}:
    STACK_FUNC[SF] = 0;
    SF = SF -1;
    STACK_FUNC[SF] = 0;
    ${var1} = ${var1} + 4;
    goto ${label2};
    ${label3}:
    SF = SF -1;
    STACK_FUNC[SF] = 0;;
    HEAP[(int)HP] = 0;
    HP = HP + 1;    
`;
        this.code = this.code + `   ${(predicate_f==null?"":predicate_f + '();')}
}
`;

    }

    private setSearchNodeDoubleBar(node_name: string, predicate_f?: string){}

    private setSearchNodeOneBar(node_name: string, predicate_f?: string){}




    private setHelpFunctions(){
        let var1: string = this.getNextVar();
        let var2: string = this.getNextVar();
        let var3: string = this.getNextVar();
        let var4: string = this.getNextVar();
        let var5: string = this.getNextVar();
        let var6: string = this.getNextVar();
        let var7: string = this.getNextVar();
        let var8: string = this.getNextVar();
        let var9: string = this.getNextVar();
        let var10: string = this.getNextVar();
        let var11: string = this.getNextVar();
        let var12: string = this.getNextVar();
        let var13: string = this.getNextVar();
        let var14: string = this.getNextVar();
        let var15: string = this.getNextVar();
        let var16: string = this.getNextVar();
        let var17: string = this.getNextVar();
        let var18: string = this.getNextVar();
        let var19: string = this.getNextVar();
        let var20: string = this.getNextVar();
        let var21: string = this.getNextVar();
        let var22: string = this.getNextVar();
        let var23: string = this.getNextVar();
        let var24: string = this.getNextVar();
        let var25: string = this.getNextVar();
        let var26: string = this.getNextVar();
        let var27: string = this.getNextVar();
        let var28: string = this.getNextVar();
        let var29: string = this.getNextVar();
        let var30: string = this.getNextVar();
        let var31: string = this.getNextVar();
        let var32: string = this.getNextVar();
        let var33: string = this.getNextVar();
        let var34: string = this.getNextVar();
        let var35: string = this.getNextVar();
        let var36: string = this.getNextVar();
        let var37: string = this.getNextVar();
        let var38: string = this.getNextVar();
        let var39: string = this.getNextVar();
        let var40: string = this.getNextVar();
        let var41: string = this.getNextVar();
        let var42: string = this.getNextVar();
        let var43: string = this.getNextVar();
        let var44: string = this.getNextVar();
        let var45: string = this.getNextVar();
        let var46: string = this.getNextVar();
        let var47: string = this.getNextVar();




        let tag1: string = this.getNextTag();
        let tag2: string = this.getNextTag();
        let tag3: string = this.getNextTag();
        let tag4: string = this.getNextTag();
        let tag5: string = this.getNextTag();
        let tag6: string = this.getNextTag();
        let tag7: string = this.getNextTag();
        let tag8: string = this.getNextTag();
        let tag9: string = this.getNextTag();
        let tag10: string = this.getNextTag();
        let tag11: string = this.getNextTag();
        let tag12: string = this.getNextTag();
        let tag13: string = this.getNextTag();
        let tag14: string = this.getNextTag();
        let tag15: string = this.getNextTag();
        let tag16: string = this.getNextTag();
        let tag17: string = this.getNextTag();
        let tag18: string = this.getNextTag();
        let tag19: string = this.getNextTag();
        let tag20: string = this.getNextTag();
        let tag21: string = this.getNextTag();
        let tag22: string = this.getNextTag();
        let tag23: string = this.getNextTag();
        let tag24: string = this.getNextTag();
        let tag25: string = this.getNextTag();


        this.code = this.code + `void compareTwoStrings(){
    int ${var1} = SF -1;
    int ${var2} = (int )STACK_FUNC[${var1}];
    ${var1} = SF -2;
    int ${var3} = (int )STACK_FUNC[${var1}];
    int ${var8} = 0;

    ${tag1}:
    if(HEAP[${var2}] == 0){goto ${tag3};}
    if(HEAP[${var3}] == 0 ){goto ${tag3};}
    int ${var4} = HEAP[${var2}];
    int ${var5} = HEAP[${var3}];
    if(${var4} == ${var5}){goto ${tag2};}
    goto ${tag4};
    ${tag2}:
    ${var2} = ${var2} + 1;
    ${var3} = ${var3} + 1;
    goto ${tag1};
    ${tag3}:
    int ${var6} = HEAP[${var2}];
    int ${var7} = HEAP[${var3}];
    if(${var6} == ${var7}){goto ${tag5};}
    ${tag4}:
    ${var1} = SF;
    ${var8} = 0;
    STACK_FUNC[${var1}] = ${var8};
    goto ${tag6};

    ${tag5}:
    ${var1} = SF;
    ${var8} = 1;
    STACK_FUNC[${var1}] = ${var8};

    ${tag6}:
    ;
}

//Functions to print Tags
// Receives index from heap, print itself and its children
void print_tag(){
    int ${var9} = SF - 1;
    int ${var10} = STACK_FUNC[${var9}];
    int ${var11} = ${var10} + 1;
    int ${var12} = ${var10} + 2;
    int ${var13} = ${var10} + 3;

    int tag_name = STACK[${var10}];
    int tag_val = STACK[${var11}];
    int tag_attr_index = STACK[${var12}];
    int tag_child_index = STACK[${var13}];


    STACK_FUNC[SF] = tag_name;
    SF = SF + 1;
    print_open_tag();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;

    if(tag_attr_index == -1){goto ${tag7};}
    STACK_FUNC[SF] = tag_attr_index;
    SF = SF + 1;
    print_attributes();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;


    ${tag7}:
    int ${var14} = 62; //TODO
    printf("%c", (char) ${var14});
    if(tag_child_index == -1){goto ${tag8};}
    ${var14} = 10; // TODO
    printf("%c", (char) ${var14});
    ${var14} = 13; // TODO
    printf("%c", (char) ${var14});
    STACK_FUNC[SF] = tag_child_index;
    SF = SF + 1;
    print_children();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;


    ${tag8}://CLOSING TAG
    if(tag_val == -1){goto ${tag9};}
    STACK_FUNC[SF] = tag_val;
    SF = SF + 1;
    print_content();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;

    ${tag9}:
    STACK_FUNC[SF] = tag_name;
    SF = SF + 1;
    print_close_tag();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;

}

void print_content(){
    int ${var15} = SF - 1;
    int ${var16} = STACK_FUNC[${var15}];
    int ${var17} = HEAP[${var16}]; // type
    int ${var18} = ${var16} + 1;
    float ${var19} = HEAP[${var18}]; // Pointer to heap

    if(${var17} == 1){goto ${tag10};}
    STACK_FUNC[SF] = ${var18};
    SF = SF + 1;
    print_val();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;
    goto ${tag11};
    ${tag10}:
    STACK_FUNC[SF] = ${var19};
    SF = SF + 1;
    print_number();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;
    ${tag11}:
    ;
}

void print_children(){
    int ${var20} = SF - 1;
    int ${var21} = STACK_FUNC[${var20}];
    int ${var22} = HEAP[${var21}];

    ${tag12}:
    if(${var22}==0){goto ${tag13};}

    STACK_FUNC[SF] = ${var22};
    SF = SF + 1;
    print_tag();
    SF = SF - 1;
    ${var21} = ${var21} + 1;
    ${var22} = HEAP[${var21}];

    goto ${tag12};
    ${tag13}:
    ;
}

//Receives an index for stack;
void print_attributes(){
    int ${var23} = SF - 1;
    int ${var24} = STACK_FUNC[${var23}];
    int ${var25} = HEAP[${var24}];
    ${tag14}:
    if(${var25} == 0){goto ${tag15};}
    STACK_FUNC[SF] = ${var25};
    SF = SF + 1;
    print_single_attribute();
    SF = SF - 1;
    ${var24} = ${var24} + 1;
    ${var25} = HEAP[${var24}];

    goto ${tag14};
    ${tag15}:
    ;
}

void print_single_attribute(){

    int ${var26} = SF - 1;
    int ${var27} = (int)  STACK_FUNC[${var26}];
    int ${var28} = (int) HEAP[${var27}];// Name
    int ${var29} = ${var27} + 1;
    int ${var30} = (int) HEAP[${var29}];//Type
    int ${var31} = ${var27} + 2;
    float ${var32} =  HEAP[${var31}];// Value

    printf(" ");
    STACK_FUNC[SF] = ${var28};
    SF = SF + 1;
    print_val();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;
    printf("=\\"");


    if (${var30} == 2) goto ${tag16};
    STACK_FUNC[SF] = ${var32};
    SF = SF + 1;
    print_number();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;

    goto ${tag17};
    ${tag16}:
    STACK_FUNC[SF] = ${var32};
    SF = SF + 1;
    print_val();
    SF = SF - 1;
    STACK_FUNC[SF] = 0;

    ${tag17}:
    printf("\\"");


}

void print_val(){
    int ${var33} = SF - 1;
    int ${var34} = STACK_FUNC[${var33}];
    int ${var35} = HEAP[${var34}];

    ${tag18}:
    if (${var35} == 0){goto ${tag19};}
    printf("%c", (char) ${var35});
    ${var34} = ${var34} +1;
    ${var35} = HEAP[${var34}];
    goto ${tag18};
    ${tag19}:
    ;
}

void print_number(){
    int ${var36} = SF - 1;
    float ${var37} = STACK_FUNC[${var36}];
    int ${var38} = (int) ${var37};
    float ${var39} = ${var37} - ${var38};
    if(${var39} == 0.0f){goto ${tag20};}
    printf("%0.2f", ${var37});
    goto ${tag21};
    ${tag20}:
    printf("%d", ${var38});
    ${tag21}:
    ;
}

void print_open_tag(){
    int ${var40} = 60;
    printf("%c", (char) ${var40});
    int ${var41} = SF - 1;
    int ${var42} = STACK_FUNC[${var41}];
    ${tag22}:
    int ${var43} = HEAP[${var42}];
    if(${var43} ==0){goto ${tag23};}
    printf("%c", (char) ${var43});
    ${var42} = ${var42} + 1;
    goto ${tag22};

    ${tag23}:
    ;



}

void print_close_tag(){
    int ${var44} = 60;
    printf("%c", (char) ${var44});
    ${var44} = 47;
    printf("%c", (char) ${var44});
    int ${var45} = SF - 1;
    int ${var46} = STACK_FUNC[${var45}];
    ${tag24}:
    int ${var47} = HEAP[${var46}];
    if(${var47} ==0){goto ${tag25};}
    printf("%c", (char) ${var47});
    ${var46} = ${var46} + 1;
    goto ${tag24};
    ${tag25}:
    ${var44} = 62;
    printf("%c", (char) ${var44});
    ${var44} = 10;
    printf("%c", (char) ${var44});
    ${var44} = 13;
    printf("%c", (char) ${var44});
}

 


/*************************TODELETE***************************************/

void print_tags_from_heap(){
    //printf("First: %d\\n", SF);
    //SF = SF - 1;
    int t0 = SF - 1;
    int t1 = STACK_FUNC[t0];
    int t2 = HEAP[t1];
    //printf("%d\\n", t1);

    label_x10:
    if(t2 == 0){goto label_x11;}
    STACK_FUNC[SF] = t2;
    //printf("t3: %d val: %d\\n", t2, (int)STACK_FUNC[SF]);
    SF = SF + 1;
    print_tag();
    SF = SF - 1;

    t1 = t1 + 1;
    t2 = HEAP[t1];
    //printf("%d\\n", (int)SF);
    goto label_x10;
    label_x11:
    int t3 = 0;
    STACK_FUNC[SF] = t3;
    ;
    printf("%d\\n", SF);
}
void print_value_by_index(int index) {
    //int t0 = STACK[index];
    int t0 = index;
    char val = (char) HEAP[t0];
    while (val != '\\0') { printf("%c", val); t0++; val = (char) HEAP[t0];

    }
    printf("");
}
void printHeap(){
    int i = 0;
    for(int i = 1; i <1000; i++ ){
        printf("HEAP[%d] = %f\\n", i, HEAP[i]);
    }

}
`;

        this.header = this.header + `void compareTwoStrings();
void print_tag();
void print_content();        
void print_children();        
void print_attributes();        
void print_single_attribute();
void print_val();
void print_number();
void print_open_tag();
void print_close_tag();





/*************************TODELETE***************************************/
void print_tags_from_heap();
void print_value_by_index(int);      
void printHeap(); 
        `;
    }


    public getCode():string{
        this.root.set3DCode();
        this.code = `float HEAP[100000];
float STACK[10000];
float STACK_FUNC[10000];
float SP = 1;
float HP = 1;
int SF = 0;
        
int main(){
` + Element.code_definition + `
    HP = ${Element.heap_index};
    SP = ${Element.stack_index};
    f0(); //TODELETE
    return 0;
}
 `+ this.code;
        this.setHelpFunctions();
        return "#include <stdio.h>\n" + this.header + this.code;
    }
    private getNextVar():string{
        return 't' + (++this.varNumber);
    }

    private getNextTag():string{
        return 'label_' +(++this.tagNumber);
    }
    private getNextFun():string{
        return 'f' + (++this.funNumber);
    }
}