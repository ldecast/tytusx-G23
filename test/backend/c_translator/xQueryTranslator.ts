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
        let var4 = this.getNextVar();
        let var5 = this.getNextVar();

        let label1 = this.getNextTag();
        let label2 = this.getNextTag();
        let label3 = this.getNextTag();
        let label4 = this.getNextTag();
        this.header = this.header + `${function_name}();
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
    int ${var3} = STACK[${var1}];
    HEAP[(int)HP] = ${var3};
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
    int ${var4} = (int) STACK_FUNC[SF];
    if(${var4} != 1){goto ${label4};}
    int ${var5} = STACK[${var1}];
    HEAP[(int)HP] = ${var5};
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






    private setHelpFunctions(){
        let var1: string = this.getNextVar();
        let var2: string = this.getNextVar();
        let var3: string = this.getNextVar();
        let var4: string = this.getNextVar();
        let var5: string = this.getNextVar();
        let var6: string = this.getNextVar();
        let var7: string = this.getNextVar();
        let var8: string = this.getNextVar();
        let tag1: string = this.getNextTag();
        let tag2: string = this.getNextTag();
        let tag3: string = this.getNextTag();
        let tag4: string = this.getNextTag();
        let tag5: string = this.getNextTag();
        let tag6: string = this.getNextTag();
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
`;

        this.header = this.header + `void compareTwoStrings();`;
    }


    public getCode():string{
        this.setHelpFunctions();
        return this.header + this.code;
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