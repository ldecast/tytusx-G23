/* lexical grammar */
%{
	var attribute = '';
	var errors = [];
%}
%lex

%options case-insensitive
%x string_doubleq
%x string_singleq

%%

\s+                   	// Whitespace
"(:"[\s\S\n]*?":)"		// XPATHComment
"<!--"[\s\S\n]*?"-->"	// MultiLineComment
"<?xml"[\s\S\n]*?"?>"	// Declaration XML

"div"                   return 'tk_div'
[0-9]+("."[0-9]+)?\b    return 'num'
"<="					return 'tk_menorigual'
">="					return 'tk_mayorigual'
"<"		        		return 'tk_menor'
">"						return 'tk_mayor'
"//"                    return 'tk_2bar'
"/"						return 'tk_bar'
"="						return 'tk_equal'
".."                    return 'tk_2puntos'
"."                     return 'tk_punto'
"::"                    return 'tk_4puntos'
"@"                     return 'tk_arroba'
"["                     return 'tk_corA'
"]"                     return 'tk_corC'
"("                     return 'tk_ParA'
")"                     return 'tk_ParC'
"*"                     return 'tk_asterisco'
"ancestor-or-self"      return 'tk_ancestor2'
"ancestor"              return 'tk_ancestor'
"attribute"             return 'tk_attribute'
"child"                 return 'tk_child'
"descendant-or-self"    return 'tk_descendant2'
"descendant"            return 'tk_descendant'
"following-sibling"     return 'tk_following2'
"following"             return 'tk_following'
"namespace"             return 'tk_namespace'
"parent"                return 'tk_parent'
"preceding-sibling"     return 'tk_preceding2'
"preceding"             return 'tk_preceding'
"self"                  return 'tk_self'
"node"                  return 'tk_node'
"last"                  return 'tk_last'
"text"                  return 'tk_text'
"position"              return 'tk_position'
"|"                     return 'tk_line'
"+"                     return 'tk_mas'
"-"                     return 'tk_menos'
"!="                    return 'tk_diferent'
"or"					return 'tk_or'
"and"					return 'tk_and'
"mod"					return 'tk_mod'

[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+ return 'tk_id'

["]								{ attribute = ''; this.begin("string_doubleq"); }
<string_doubleq>[^"\\]+			{ attribute += yytext; }
<string_doubleq>"\\\""			{ attribute += "\""; }
<string_doubleq>"\\n"			{ attribute += "\n"; }
<string_doubleq>\s				{ attribute += " ";  }
<string_doubleq>"\\t"			{ attribute += "\t"; }
<string_doubleq>"\\\\"			{ attribute += "\\"; }
<string_doubleq>"\\\'"			{ attribute += "\'"; }
<string_doubleq>"\\r"			{ attribute += "\r"; }
<string_doubleq>["]				{ yytext = attribute; this.popState(); return 'tk_attribute_d'; }

[']								{ attribute = ''; this.begin("string_singleq"); }
<string_singleq>[^'\\]+			{ attribute += yytext; }
<string_singleq>"\\\""			{ attribute += "\""; }
<string_singleq>"\\n"			{ attribute += "\n"; }
<string_singleq>\s				{ attribute += " ";  }
<string_singleq>"\\t"			{ attribute += "\t"; }
<string_singleq>"\\\\"			{ attribute += "\\"; }
<string_singleq>"\\\'"			{ attribute += "\'"; }
<string_singleq>"\\r"			{ attribute += "\r"; }
<string_singleq>[']				{ yytext = attribute; this.popState(); return 'tk_attribute_s'; }


<<EOF>>               	return 'EOF'
[^></]+					return 'anything'
.                     	{ errors.push({ tipo: "Léxico", error: yytext, origen: "XPath", linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'INVALID'; }

/lex

%{
	const { Objeto } = require('../model/xpath/Objeto');
	const { Tipos } = require('../model/xpath/Enum');
	var builder = new Objeto();
%}

/* operator associations and precedence */
%left 'tk_or' 'tk_line'
%left 'tk_and'
%left 'tk_equal' 'tk_diferent' 'tk_menor' 'tk_menorigual' 'tk_mayor' 'tk_mayorigual'
%left 'tk_mas' 'tk_menos'
%left 'tk_div' 'tk_mod' 'tk_asterisco'
%left umenos
%left 'tk_ParA'

%start ini

%% // GRAMATICA DE DOCUMENTO XPath ANALISIS ASCENDENTE

ini: XPATH_U EOF { ast = { ast: $1, errors: errors }; errors = []; return ast; }
;

XPATH_U: XPATH_U tk_line XPATH { $1.push($3); $$=$1; }
		| XPATH { $$=[$1]; }
;

XPATH: XPATH QUERY  { $1.push($2); $$=$1; }
	| QUERY  { $$=[$1]; }
;

QUERY: tk_2bar QUERY { $$=builder.newDoubleAxis($2, this._$.first_line, this._$.first_column+1); }
	| tk_bar QUERY { $$=builder.newAxis($2, this._$.first_line, this._$.first_column+1); }
	| EXP_PR { $$=$1; }
	| AXIS { $$=$1; }
;

CORCHET: CORCHET tk_corA E tk_corC { $1.push(builder.newPredicate($3, this._$.first_line, this._$.first_column+1)); $$=$1; }
	| tk_corA E tk_corC{ $$=[builder.newPredicate($2, this._$.first_line, this._$.first_column+1)]; } // Lista de predicados
;

CORCHETP: CORCHET { $$=$1; }
		| { $$=null; }
;

E:	E tk_menorigual E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_MENORIGUAL, this._$.first_line, this._$.first_column+1); }
	| E tk_menor E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_MENOR, this._$.first_line, this._$.first_column+1); }
	| E tk_mayorigual E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_MAYORIGUAL, this._$.first_line, this._$.first_column+1); }
	| E tk_mayor E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_MAYOR, this._$.first_line, this._$.first_column+1); }
	| E tk_mas E { $$=builder.newOperation($1, $3, Tipos.OPERACION_SUMA, this._$.first_line, this._$.first_column+1); }
	| E tk_menos E { $$=builder.newOperation($1, $3, Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1); }
	| E tk_asterisco E { $$=builder.newOperation($1, $3, Tipos.OPERACION_MULTIPLICACION, this._$.first_line, this._$.first_column+1); }
	| E tk_div E { $$=builder.newOperation($1, $3, Tipos.OPERACION_DIVISION, this._$.first_line, this._$.first_column+1); }
	| E tk_mod E { $$=builder.newOperation($1, $3, Tipos.OPERACION_MODULO, this._$.first_line, this._$.first_column+1); }
	| tk_menos E %prec umenos { $$=builder.newOperation(builder.newValue(0, Tipos.NUMBER, this._$.first_line, this._$.first_column+1), $2, Tipos.OPERACION_RESTA, this._$.first_line, this._$.first_column+1); }
	| tk_ParA E tk_ParC { $$=$2 }
	| E tk_or E { $$=builder.newOperation($1, $3, Tipos.LOGICA_OR, this._$.first_line, this._$.first_column+1); }
	| E tk_and E { $$=builder.newOperation($1, $3, Tipos.LOGICA_AND, this._$.first_line, this._$.first_column+1); }
	| E tk_equal E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_IGUAL, this._$.first_line, this._$.first_column+1); }
	| E tk_diferent E { $$=builder.newOperation($1, $3, Tipos.RELACIONAL_DIFERENTE, this._$.first_line, this._$.first_column+1); }	
	| QUERY { $$=$1; }
;

EXP_PR: FUNC CORCHETP { $$=builder.newExpression($1, $2, this._$.first_line, this._$.first_column+1); } // Predicado puede ser nulo
		| PRIMITIVO CORCHETP { $$=builder.newExpression($1, $2, this._$.first_line, this._$.first_column+1); }
;

PRIMITIVO: tk_id { $$=builder.newNodename($1, this._$.first_line, this._$.first_column+1); }
		| tk_attribute_d { $$=builder.newValue($1, Tipos.STRING, this._$.first_line, this._$.first_column+1); }
		| tk_attribute_s { $$=builder.newValue($1, Tipos.STRING, this._$.first_line, this._$.first_column+1); }
		| num { $$=builder.newValue($1, Tipos.NUMBER, this._$.first_line, this._$.first_column+1); }
		| tk_asterisco { $$=builder.newValue($1, Tipos.ASTERISCO, this._$.first_line, this._$.first_column+1); }
		| tk_punto { $$=builder.newCurrent($1, this._$.first_line, this._$.first_column+1); }
		| tk_2puntos { $$=builder.newParent($1, this._$.first_line, this._$.first_column+1); }
		| tk_arroba tk_id { $$=builder.newAttribute($2, this._$.first_line, this._$.first_column+1); }
		| tk_arroba tk_asterisco { $$=builder.newAttribute($2, this._$.first_line, this._$.first_column+1); }
;

FUNC: tk_text tk_ParA tk_ParC { $$=builder.newValue($1, Tipos.FUNCION_TEXT, this._$.first_line, this._$.first_column+1); }
	| tk_last tk_ParA tk_ParC { $$=builder.newValue($1, Tipos.FUNCION_LAST, this._$.first_line, this._$.first_column+1); }
	| tk_position tk_ParA tk_ParC { $$=builder.newValue($1, Tipos.FUNCION_POSITION, this._$.first_line, this._$.first_column+1); }
	| tk_node tk_ParA tk_ParC { $$=builder.newValue($1, Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); }
;

AXIS: AXISNAME tk_4puntos QUERY { $$=builder.newAxisObject($1, $3, this._$.first_line, this._$.first_column+1); }
;

AXISNAME: tk_ancestor { $$ = Tipos.AXIS_ANCESTOR }
		| tk_ancestor2 { $$ = Tipos.AXIS_ANCESTOR_OR_SELF }
		| tk_attribute { $$ = Tipos.AXIS_ATTRIBUTE }
		| tk_child { $$ = Tipos.AXIS_CHILD }
		| tk_descendant { $$ = Tipos.AXIS_DESCENDANT }
		| tk_descendant2 { $$ = Tipos.AXIS_DESCENDANT_OR_SELF }
		| tk_following { $$ = Tipos.AXIS_FOLLOWING }
		| tk_following2 { $$ = Tipos.AXIS_FOLLOWING_SIBLING }
		| tk_namespace { $$ = Tipos.AXIS_NAMESPACE }
		| tk_parent { $$ = Tipos.AXIS_PARENT }
		| tk_preceding { $$ = Tipos.AXIS_PRECEDING }
		| tk_preceding2 { $$ = Tipos.AXIS_PRECEDING_SIBLING }
		| tk_self { $$ = Tipos.AXIS_SELF }
;
