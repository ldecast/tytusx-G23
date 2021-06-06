/* lexical grammar */
%{
	var attribute = '';
	var errors = [];
%}
%lex

%options case-insensitive
%x string

%%

\s+                   	// Whitespace
"<!--"[\s\S\n]*?"-->"	// MultiLineComment
"<?xml"[\s\S\n]*?"?>"	// Declaration XML

"<"						return 'tk_open'
">"						return 'tk_close'
"/"						return 'tk_bar'
"="						return 'tk_equal'
[\w\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]+ return 'tk_id'

// attr podria ser un objeto que contenga atributos, name, etc
["]						{ attribute = ''; this.begin("string"); }
<string>[^"\\]+			{ attribute += yytext; }
<string>"\\\""			{ attribute += "\""; }
<string>"\\n"			{ attribute += "\n"; }
<string>\s				{ attribute += " ";  }
<string>"\\t"			{ attribute += "\t"; }
<string>"\\\\"			{ attribute += "\\"; }
<string>"\\\'"			{ attribute += "\'"; }
<string>"\\r"			{ attribute += "\r"; }
<string>["]				{ yytext = attribute; this.popState(); return 'attribute'; }

<<EOF>>               	return 'EOF'
[^></]+					return 'anything'
.						return 'INVALID'

/lex
%{
	
%}

/* operator associations and precedence */

%start ini

%% //GRAMATICA DE DOCUMENTO XML ANALISIS DESCENDENTE

ini: ROOT EOF { ast = { parse: $1, errors: errors }; errors = []; return ast; }
;

ROOT: XML ROOTp
;

ROOTp: XML ROOTp
	| 
;

XML: tk_open tk_id ATTR tk_close CHILD tk_open tk_bar tk_id tk_close { console.log($2); $$=$2; }
	| tk_open tk_id ATTR tk_close CONTENT tk_open tk_bar tk_id tk_close { console.log($5); $$=$2; }
	| tk_open tk_id ATTR tk_bar tk_close { console.log($2); $$=$2; }
;

ATTR: ATTR_P { $$=$1; }
	| { $$=null; }
;

ATTR_P: tk_id tk_equal attribute ATTR_Pp { console.log($3); $$=$3; }
;

ATTR_Pp: tk_id tk_equal attribute ATTR_Pp { console.log($3); $$=$3; }
	| 
;

CHILD: XML CHILDp
;

CHILDp: XML CHILDp
	| 
;

CONTENT: PROP CONTENTp
;

CONTENTp: PROP CONTENTp
	| 
;

PROP: tk_id { $$=$1; }
	| anything { $$ = $1; }
;