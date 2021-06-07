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

["]						{ attribute = ''; this.begin("string"); }
<string>[^"\\]+			{ attribute += yytext; }
<string>"\\\""			{ attribute += "\""; }
<string>"\\n"			{ attribute += "\n"; }
<string>\s				{ attribute += " ";  }
<string>"\\t"			{ attribute += "\t"; }
<string>"\\\\"			{ attribute += "\\"; }
<string>"\\\'"			{ attribute += "\'"; }
<string>"\\r"			{ attribute += "\r"; }
<string>["]				{ yytext = attribute; this.popState(); return 'tk_attribute'; }

<<EOF>>               	return 'EOF'
[^></]+					return 'anything'
.                     	{ errors.push({ tipo: "Léxico", error: yytext, origen: "XML", linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'INVALID'; }

/lex
%{
	const { Atributo } = require('../model/xml/Atributo');
	const { Element } = require('../model/xml/Element');
%}

/* operator associations and precedence */

%start ini

%% // GRAMATICA DE DOCUMENTO XML ANALISIS ASCENDENTE

ini: ROOT EOF {
		ast = { ast: $1, errors: errors };
		errors = [];
		return ast;
	}
	| error EOF { errors.push({ tipo: "Sintáctico", error: "Sintaxis errónea del documento XML.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); $$ = null; }
;

ROOT: ROOT XML { $1.push($2); $$=$1; }
	| XML { $$=[$1]; }
;

XML: tk_open tk_id ATTR tk_close CHILD tk_open tk_bar tk_id tk_close {
			tag = new Element($2, $3, null, $5, this._$.first_line, this._$.first_column+1, $8);
			if (tag.verificateNames()) {
				tag.childs.forEach(child => {
					child.father = $2;
            	});
				$$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: "La etiqueta de apertura no coincide con la de cierre.", origen: "XML", linea: @8.first_line, columna: @8.first_column+1 });
				$$ = null;
			}
		}
	| tk_open tk_id ATTR tk_close CONTENT tk_open tk_bar tk_id tk_close {
			tag = new Element($2, $3, $5, null, this._$.first_line, this._$.first_column+1, $8);
			if (tag.verificateNames()) {
				$$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: "La etiqueta de apertura no coincide con la de cierre.", origen: "XML", linea: @8.first_line, columna: @8.first_column+1 });
				$$ = null;
			}
		}
	| tk_open tk_id ATTR tk_bar tk_close {
			$$ = new Element($2, $3, null, null, this._$.first_line, this._$.first_column+1, null);
		}
	| tk_open tk_id ATTR tk_close tk_open tk_bar tk_id tk_close {
			tag = new Element($2, $3, null, null, this._$.first_line, this._$.first_column+1, $7);
			if (tag.verificateNames()) {
				$$ = tag;
			}
			else {
				errors.push({ tipo: "Semántico", error: "La etiqueta de apertura no coincide con la de cierre.", origen: "XML", linea: @7.first_line, columna: @7.first_column+1 });
				$$ = null;
			}
		}
	| error tk_close { errors.push({ tipo: "Sintáctico", error: "La etiqueta no fue declarada correctamente.", origen: "XML", linea: this._$.first_line, columna: this._$.first_column+1 }); $$ = null; }
;

ATTR: ATTR_P { $$=$1; }
	| { $$=null; }
;

ATTR_P: ATTR_P tk_id tk_equal tk_attribute {
		attr = new Atributo($2, $4, this._$.first_line, this._$.first_column+1);
		$1.push(attr);
		$$=$1;
	}
	| tk_id tk_equal tk_attribute {
		attr = new Atributo($1, $3, this._$.first_line, this._$.first_column+1);
		$$=[attr];
	}
;

CHILD: CHILD XML { $1.push($2); $$=$1; }
	| XML { $$=[$1]; }
;

CONTENT: CONTENT PROP {
		$1+=' '+$2;
		$$=$1;
	}
	| PROP {
		$$=$1;
	}
;

PROP: tk_id { $$=$1; }
	| anything { $$=$1; }
;
