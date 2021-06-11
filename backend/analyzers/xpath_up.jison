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
"ancestor"              return 'tk_ancestor'
"ancestor-or-self"      return 'tk_ancestor2'
"attribute"             return 'tk_attribute'
"child"                 return 'tk_child'
"descendant"            return 'tk_descendant'
"descendant-or-self"    return 'tk_descendant2'
"following"             return 'tk_following'
"following-sibling"     return 'tk_following2'
"namespace"             return 'tk_namespace' //no se si namespace se refiere al propio nombre de un nodo o si es una palabra reservada. asi que lo agrego por si acaso
"parent"                return 'tk_parent'
"preceding"             return 'tk_preceding'
"preceding-sibling"     return 'tk_preceding2'
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
"<="					return 'tk_menorigual'
">="					return 'tk_mayorigual'
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
.                     	{ errors.push({ tipo: "Léxico", error: yytext, origen: "XML", linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'INVALID'; }


/* operator associations and precedence */
/lex
%start ini

%% // GRAMATICA DE DOCUMENTO XPath ANALISIS ASCENDENTE

ini: CONTI EOF {console.log("fin del archivo ascendente");}
;

CONTI: CONTI tk_punto AXES
    | CONTI tk_bar AXES
    | CONTI tk_2bar AXES
	| CONTI PAL AXES
	| CONTI tk_4puntos AXES
    | tk_punto AXES
    | tk_bar AXES
    | tk_2bar AXES
	| PAL AXES
	| tk_4puntos AXES
;

AXES: tk_por SUBAX
	| tk_arroba SUBAX
	| tk_line
	| tk_2puntos
	| CORCHET 
	| 
;

SUBAX: tk_por
	| tk_arroba
	| CORCHET
	| 
;

CORCHET: CORCHET tk_corA E tk_corC
	| tk_corA E tk_corC
;

E: E tk_menorigual T
	| E tk_menor T
	| E tk_mayor T
	| E tk_mayorigual T
	| E tk_or T
	| E tk_and T
	| E tk_4puntos T
	| E tk_bar T
	| E tk_2bar T
	| T
;

T:  T tk_mas F
	| T tk_menos F
	| T tk_por F
	| T tk_div F
	| T tk_mod F
	| T tk_diferent F
	| T tk_equal F
	| F
;

F: tk_arroba O
	| num
	| tk_punto
	| PAL Q
	| CORCHET
	|
;

O: tk_id
	| tk_por
;

Q: CORCHET
	|
;

PAL: tk_id
	| tk_ancestor
	| tk_ancestor2
	| tk_attribute_d
	| tk_attribute_s
	| tk_child
	| tk_descendant
	| tk_descendant2
	| tk_following
	| tk_following2
	| tk_namespace
	| tk_parent
	| tk_preceding
	| tk_preceding2
	| tk_self
	| tk_node tk_ParA tk_ParC
	| tk_last tk_ParA tk_ParC
	| tk_text tk_ParA tk_ParC
	| tk_position tk_ParA tk_ParC
;