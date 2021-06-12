
export enum Tipos {
    //Nodename unario
    NODENAME = "NODENAME",
    STRING = "STRING",
    NUMBER = "NUMBER",
    ASTERISCO = "ASTERISCO",
    TEXTOS = "TEXTOS",
    COMBINADO = "COMBINADO",


    // Selección
    SELECT_FROM_ROOT = "SELECT_FROM_ROOT",
    SELECT_FROM_CURRENT = "SELECT_FROM_CURRENT",
    SELECT_CURRENT = "SELECT_CURRENT",
    SELECT_PARENT = "SELECT_PARENT",
    SELECT_ATTRIBUTES = "SELECT_ATTRIBUTES",

    // Aritméticas
    OPERACION_SUMA = "OPERACION_SUMA",
    OPERACION_RESTA = "OPERACION_RESTA",
    OPERACION_MULTIPLICACION = "OPERACION_MULTIPLICACION",
    OPERACION_DIVISION = "OPERACION_DIVISION",
    OPERACION_MODULO = "OPERACION_MODULO",
    OPERACION_NEGACION_UNARIA = "OPERACION_NEGACION_UNARIA",

    // Relacionales
    RELACIONAL_IGUAL = "RELACIONAL_IGUAL",
    RELACIONAL_DIFERENTE = "RELACIONAL_DIFERENTE",
    RELACIONAL_MENOR = "RELACIONAL_MENOR",
    RELACIONAL_MENORIGUAL = "RELACIONAL_MENORIGUAL",
    RELACIONAL_MAYOR = "RELACIONAL_MAYOR",
    RELACIONAL_MAYORIGUAL = "RELACIONAL_MAYORIGUAL",

    // Logicas
    LOGICA_OR = "LOGICA_OR",
    LOGICA_AND = "LOGICA_AND",

    // Funciones reservadas
    FUNCION_LASTE = "FUNCION_LASTE",
    FUNCION_POSITION = "FUNCION_POSITION",
    FUNCION_TEXT = "FUNCION_TEXT",
    FUNCION_NODE = "FUNCION_NODE",

    // Combinacional
    UNION = "UNION",

    // Expresiones
    ELEMENTOS = "ELEMENTOS",
    ATRIBUTOS = "ATRIBUTOS",

    // Default
    NONE = "NONE"
}