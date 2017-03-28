function Analex(){

    this.symbolsTable = new SymbolsTable(); //Array Tokens
	this.error = [];
    
    this.tokenizer = function(codeFile){
		this.error = [];
		this.symbolsTable.clean();
        
		var token = "";
        var classe = "";
		var classe_anterior = "";   
        var posicao = new Position(0,0);
		
		for( var i = 1 ; i <= codeFile.rowsCount() ; i++ ) {
			var row = codeFile.row(i); 
			token = "";
			classe_anterior = "";
			for (var j = 1; j <= row.length(); j++) {
				if(j==0) {
					j=1;
				}
				var char = row.col(j);
				classe = "";
				if(token == ""){
					posicao = new Position(i,j);
				}
				token = token + char;				
				
				if(char=='"' || char== "'") {
					classe = "string";
				} else if(/[a-zA-Z]/.test(char)){
					classe = "char";
				} else if(char == '+' || char == '-'){
					classe = "operacao1";
				} else if(char == '/') {
					classe = "operacao2";
				} else if(char == '='){
					classe = "operacao3";				
				} else if(/\d/.test(char)){
					classe = "numero";
				} else if (char == '*') {
					classe = "operacao4";
				} else if (char.charCodeAt(0) == 160 || char.charCodeAt(0) == 32) {
					classe = "espaco";
				} else if (char == ';') {
					classe = "ponto_e_virgula";
				} else if (char == '(' || char == ')' || char == '{' || char == '}' || char == '[' || char == ']' || char == ',') {
					classe = "separador";
				} else if(char == '\n') {
					classe = "nova_linha";
				} else if(char == '.') {
					classe = "ponto";
				} else {
					if(classe_anterior!='string') {
						this.error.push(["Caracter Inválido: "+token ,posicao]);
						classe_anterior = "";
						token = "";
						break;
					}
				}						
																					
				if(classe_anterior=="string"){
					if(classe == "string") {
						this.symbolsTable.push(token,"string",posicao);
						classe_anterior = "";
						token = "";
					} else if (classe=="nova_linha") {						
						this.error.push(["String não fechada",posicao]);
						classe_anterior = "";
						token = "";
						break;
					}
				} else if(classe_anterior=="operacao2") { /* /" /a /1 /  /; /"\n" /* // */
					if(classe == "char" || classe == "numero" || classe == "espaco") {
						this.symbolsTable.push(token.substr(0,token.length-1),"divisao",posicao);
						classe_anterior = "";
						token = "";
						j--;
					} else if (classe == "operacao2") {
						this.symbolsTable.push(token,"comentario",posicao);
						token = "";						
						classe_anterior = "";
						break;
					} else if (classe == "operacao4") {
						classe = "comentario_multilinha";
						if(codeFile.isPositionValid(i,j)) {
							this.error.push(["Comentario não fechado",posicao]);
							token = "";
							classe_anterior = "";							
							break;
						}						
						j++;						
						var mudouLinha = false;												
						while( !codeFile.isPositionValid(i,j) ){
							var char2 = codeFile.row(i).col(j);
							if( j == codeFile.row(i).length()) {
								if(codeFile.isPositionValid(i,j)) {
									break;
								}
								i++;
								j=1; 
								mudouLinha=true;
								continue;
							}
							var char3 = codeFile.row(i).col(j+1);													
							var multinhaInvertido = char2+char3;
							if( multinhaInvertido == "*/" ) {
								this.symbolsTable.push(token,"comentarioML",posicao);
								token = "";								
								classe_anterior = "";
								j++;
								break;
							}							
							j++;
						}	
						if(codeFile.isPositionValid(i,j)) {
							this.error.push(["Comentario não fechado",posicao]);							
						}
						if(mudouLinha) {
							break;
						}
					} else {
						this.error.push(["Lixo sintático: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					}					
				} else if(classe_anterior=="numero") { 
					/* CONDICOES QUEBRA: 1+ 1/ 1* 1= 1- 1 1; 1) 1]*/
					if(classe=="operacao1" || classe == "operacao2" || classe == "operacao3" || classe == "operacao4" || classe == "separador" || classe == "ponto_e_virgula" ||  classe == "espaco")  {
						this.symbolsTable.push(token.substr(0,token.length-1),"numero",posicao);
						classe_anterior = "";
						token = "";
						j--;
					/*NAO PODE: 1a 1'\n' */
					} else if(classe=="char"){
						this.error.push(["Má formação de identificador",posicao]);
						token = "";
						classe_anterior = "";
						break;											
					} else if (classe == "ponto") {
						classe_anterior = "ponto_de_numero";
					} else if(classe != "numero" ) {
						this.error.push(["Lixo sintático: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					}
				} else if(classe_anterior=="ponto_de_numero")  {
					if(classe!="numero") {
						this.error.push(["Número Invalido: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					} else {
						classe_anterior = "numero";
					}
				} else if(classe_anterior=="char") { 
					/* QUEBRAS: a<operador> | a<separador> | a<espaco> | a<ponto_e_virgula>
					   NAO PODE: a<string> | a<ponto> | a<nova_linha>  */
					   if( /boolean\s|char\s|string\s|class\s|double\s|new\s|return\s/i.test(token)) {
							this.symbolsTable.push(token.substr(0,token.length-1),"palavra_reservada_c_espaco",posicao);
							classe_anterior = "";
							token = "";
							j--;
							continue;
					   } else if((classe == 'espaco' || classe == 'ponto_e_virgula') 
					    			&& /(break|continue|true|false)(;|\s)/i.test(token)){
							this.symbolsTable.push(token.substr(0,token.length-1),"palavra_reservada",posicao);
							classe_anterior = "";
							token = "";
							j--;
							continue;
					   } else if((classe == 'espaco' || classe == 'separador') &&
					   				/(else|if|while)(\s|\{|\}|\[|\]|\(|\))/i.test(token) ) {
							this.symbolsTable.push(token.substr(0,token.length-1),"palavra_reservada",posicao);
							classe_anterior = "";
							token = "";
							j--;
							continue;
					   }
					if (classe == "espaco" || classe == "separador" || classe=="operacao1" || classe == "operacao2" || classe == "operacao3" || classe == "operacao4" || classe == "ponto_e_virgula") {
							this.symbolsTable.push(token.substr(0,token.length-1),"identificador",posicao);
							classe_anterior = "";
							token = "";
							j--;
					} else if(classe == "string" || classe == "nova_linha" || classe == "ponto") {
						this.error.push(["Lixo sintático: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					}
				} else if(classe_anterior=="operacao1" || classe_anterior == "operacao4"){ /* +a +1 +  +; +( */
					/* + ou - ou *
					PODE:  +<char> +<numero> +<espaco> +<separador>
					NAO PODE: +<string> +<operacao4> +<ponto_e_virgula> +<nova_linha> +<ponto>
					*/
					if (classe == "char" || classe == "numero" || classe=="espaco" || classe == "separador") {
						this.symbolsTable.push(token.substr(0,token.length-1),classe_anterior,posicao);
						classe_anterior = "";
						token = "";
						j--;
					} else {
						this.error.push(["Lixo sintático: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					}
				} else if(classe_anterior=="operacao3") {/* =a =1 == =( = ERROS: =+ =- =* =/ =; */
					/* =
					Continua: =<operacao3>
					QUEBRA:  =<char> =<numero> =<espaco> =<separador> =<string>
					NAO PODE:  =<operacao1,2,4> =<ponto_e_virgula> =<nova_linha> =<ponto>
					*/
					if (classe == "char" || classe == "numero" || classe=="espaco" || classe == "separador" || classe == "string") {
						this.symbolsTable.push(token.substr(0,token.length-1),classe_anterior,posicao);
						classe_anterior = "";
						token = "";
						j--;
					} else if( classe!="operacao3" ) {
						this.error.push(["Lixo sintático: " +token + " (" + classe_anterior + " com " + classe + ")" ,posicao]);
						token = "";
						classe_anterior = "";
						break;
					}
				} else if(classe_anterior=="separador") {
					this.symbolsTable.push(token.substr(0,token.length-1),"separador",posicao);
					classe_anterior = "";
					token = "";
					j--;
				} else if(classe_anterior=="ponto_e_virgula") {
					this.symbolsTable.push(token.substr(0,token.length-1),"ponto_e_virgula",posicao);
					classe_anterior = "";
					token = "";
					j--;
				} else if(classe_anterior == "espaco") {
					classe_anterior = "";
					token = "";
					j--;
				} else if(classe_anterior == "ponto") {
					this.error.push(["Ponto clandestino: "+token,posicao]);
					token = "";
					classe_anterior = "";
					break;
				} else {
					classe_anterior = classe;
				}
			}
		}    
    }
}

function Token(){
    this.value = "";
    this.class_match = "";
    this.last_class_match = "";
    this.positions = [];

    this.clean = function(){
        this.value = "";
        this.class_match = "";
        this.last_class_match = "";
        this.positions = [];
    }
}

function Position(row, col){
    this.row = row;
    this.col = col;
}

function SymbolsTable(){
	this.array={};

    this.push = function(token,classe,position){
		if (this.array[token] == undefined) 
			this.array[token] = {};

		if( this.array[token]['classe'] == undefined )
			this.array[token]['classe'] = classe;
		
		if( this.array[token]["positions"] == undefined )
			this.array[token]["positions"] = [];

		this.array[token]["positions"].push(position);
	}

	this.clean = function clean(){
		this.array = [];
	}

	this.teste = function teste(){
		
	}
}