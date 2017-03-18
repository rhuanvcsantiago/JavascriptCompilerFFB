function Analex(){

    this.symbolTable = []; //Array Tokens
    
    this.tokenizer = function(codeFile){
        var token = "";
        var classe = "";
		var classe_anterior = "";   
        var posicao = { linha:0 , coluna:0 };
		
		for( var i = 1 ; i <= codeFile.rowsCount() ; i++ ) {
			var row = codeFile.getRow(i); 
			for (var j = 1; j <= row.length(); j++) {
				var char = row.getCol(j);
				classe = "";
				if(token == ""){
					posicao.linha = i;
					posicao.coluna = j;
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
				} else if (char == ' ') {
					classe = "espaco";
				} else if (char == ';') {
					classe = "final_de_linha";
				}
																				/* bjkjlokjljlljlj */					
				if(classe_anterior=="string"){
					if(classe == "string") {
						this.symbolsTable.push([token,"string",posicao]);
						classe_anterior = "";
						token = "";
					}
				} else if(classe_anterior=="operacao2") {
					if(classe == "string" || classe == "char" || classe == "numero" || classe == "espaco") {
						this.symbolsTable.push([token.substr(0,token.length-1),"divisao",posicao]);
						classe_anterior = "";
						token = "";
						j--;
					} else if (classe == "operacao2") {
						this.symbolsTable.push([token,"comentario",posicao]);
						token = "";						
						classe_anterior = "";
						break;
					} else if (classe == "operacao4") {
						classe = "comentario_multilinha";
						if(codeFile.isEOF(i,j)) {
							this.error.push(["Comentario não fechado",posicao]);							
							break;
						}						
						j++;						
						var mudouLinha = false;												
						while( !codeFile.isEOF(i,j) ){
							var char2 = codeFile.getCharAt(i,j);
							if( j == codeFile.getRow(i).length()) {
								if(codeFile.isEOF(i,j)) {
									break;
								}
								i++;
								j=1; 
								mudouLinha=true;
								continue;
							}
							var char3 = codeFile.getCharAt(i,j+1);													
							var multinhaInvertido = char2+char3;
							if( multinhaInvertido == "*/" ) {
								this.symbolsTable.push([token,"comentarioML",posicao]);
								token = "";								
								classe_anterior = "";
								break;
							}							
							j++;
						}	
						if(codeFile.isEOF(i,j)) {
							this.error.push(["Comentario não fechado",posicao]);							
						}
						if(mudouLinha) {
							break;
						}
					}					
				} else {
					classe_anterior = classe;
				}
			}
			if(classe_anterior=="string") {
				this.error.push(["String não fechada",posicao]);
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

function Position(){
    this.row;
    this.col;
}