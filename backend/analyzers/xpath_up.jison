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
"<!--"[\s\S\n]*?"-->"	// MultiLineComment
"<?xml"[\s\S\n]*?"?>"	// Declaration XML

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
"*"                     return 'tk_por'
"ancestor-or-self"      return 'tk_ancestor2'
"ancestor"              return 'tk_ancestor'
"attribute"             return 'tk_attribute'
"child"                 return 'tk_child'
"descendant-or-self"    return 'tk_descendant2'
"descendant"            return 'tk_descendant'
"following-sibling"     return 'tk_following2'
"following"             return 'tk_following'
"namespace"             return 'tk_namespace' //no se si namespace se refiere al propio nombre de un nodo o si es una palabra reservada. asi que lo agrego por si acaso
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
"div"                   return 'tk_div'
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
%left 'tk_arroba'
%left 'tk_por'
%left 'tk_or' 'tk_line'
%left 'tk_and'
%left 'tk_equal' 'tk_diferent' 'tk_menor' 'tk_menorigual' 'tk_mayor' 'tk_mayorigual'
%left 'tk_mas' 'tk_menos'
%left 'tk_por' 'tk_div' 'tk_mod'
%left umenos
%left 'tk_ParA'

%start ini

%% // GRAMATICA DE DOCUMENTO XPath ANALISIS ASCENDENTE

ini: XPATH EOF 	{ console.log($1); ast = { ast: $1, errors: errors };
					errors = [];
					return ast;
				}
;

XPATH_U: XPATH_U tk_line XPATH_U { $$=[$1, $3]; }
		| XPATH { $$=$1; }
;

XPATH: XPATH QUERY { $1.push($2); $$=$1; }
	| QUERY { $$=[$1]; }
;

QUERY: tk_2bar QUERY { $$=builder.newDoubleAxis($2, this._$.first_line, this._$.first_column+1); }
	| tk_bar QUERY { $$=builder.newAxis($2, this._$.first_line, this._$.first_column+1); }
	//| tk_2puntos QUERY {  }
	//| tk_punto QUERY { $$=builder.newCurrent($2, this._$.first_line, this._$.first_column+1); }
	//| tk_por QUERY {  }
	//| tk_arroba QUERY {  }
	//| QUERY tk_line QUERY {  }
	//| tk_id tk_4puntos QUERY {  }
	| EXP_PR { $$=$1; }
	| AXIS {  }
;

PREDICATE: tk_corA PREDICATE tk_corC {  }
		| tk_corA EXP tk_corC {  }
		| 
;

EXP: EXP tk_equal EXP {  }
	| EXP tk_diferent EXP {  }
	| EXP tk_menorigual EXP {  }
	| EXP tk_menor EXP {  }
	| EXP tk_mayorigual EXP {  }
	| EXP tk_mayor EXP {  }
	| EXP tk_or EXP {  }
	| EXP tk_and EXP {  }
	| EXP tk_mas EXP {  }
	| EXP tk_menos EXP {  }
	| EXP tk_por EXP {  }
	| EXP tk_div EXP {  }
	| EXP tk_mod EXP {  }
	| tk_ParA EXP tk_ParC {  }
	| EXP_PR { $$=$1; }
;

EXP_PR: FUNCIONES_RESERVADAS {  }
		| PRIMITIVO { $$=$1; }
;

PRIMITIVO: tk_id { $$=builder.newNodename($1, this._$.first_line, this._$.first_column+1); }
		| string_doubleq { $$=builder.newValue($1, Tipos.STRING, this._$.first_line, this._$.first_column+1); }
		| string_singleq { $$=builder.newValue($1, Tipos.STRING, this._$.first_line, this._$.first_column+1); }
		| num { $$=builder.newValue($1, Tipos.NUMBER, this._$.first_line, this._$.first_column+1); }
		| tk_por { $$=builder.newValue($1, Tipos.ASTERISCO, this._$.first_line, this._$.first_column+1); }
		| tk_punto { $$=builder.newCurrent($1, this._$.first_line, this._$.first_column+1); }
		| tk_2puntos { $$=builder.newParent($1, this._$.first_line, this._$.first_column+1); }
		| tk_arroba tk_id { $$=builder.newAttribute($2, this._$.first_line, this._$.first_column+1); }
		| tk_arroba tk_por { $$=builder.newAttribute($2, this._$.first_line, this._$.first_column+1); }
		| tk_node tk_ParA tk_ParC { $$=builder.newValue($1, Tipos.FUNCION_NODE, this._$.first_line, this._$.first_column+1); }
;

FUNCIONES_RESERVADAS: tk_last tk_ParA tk_ParC {  }
					| tk_position tk_ParA tk_ParC {  }
					| tk_text tk_ParA tk_ParC {  }
					//| tk_node tk_ParA tk_ParC {  }
;

AXIS: AXISNAME tk_4puntos PRIMITIVO PREDICATE {  }
;

AXISNAME: tk_ancestor {  }
		| tk_child {  }
;