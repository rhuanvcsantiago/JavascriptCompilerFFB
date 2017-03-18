function Compiler(codeObject){

    this.code = codeObject;
    
    this.symbleTable = [];

    this.analex = function(){
        var classe_previa = false;
	
        for( var i = 1 ; i <= this.code.rowsCount() ; i++ ) {
            var row = this.code.getRow(i);
            classe_previa = this.tokenizer(row.text,row.number,classe_previa);
        }
    }
	
	this.tokenizer = function(codeLine,lineNumber,previous_class) {
        var token = "";
        var classe = "";
		var classe_anterior = "";
        if(previous_class) {
            classe_anterior = previous_class;
        }        
        var posicao = "";
        for (var i = 0; i < codeLine.length; i++) {
            var char = codeLine[i];
			classe = "";
            if(token == ""){
                posicao = i;
            }
            token = token + char;
            if(classe_anterior == "string") {
                if(char=='"') {
                    this.symbleTable.push([token,classe,posicao,lineNumber]);
                    classe = "";
                    token = "";                    
                }
                continue;
            } else if (classe_anterior == "comentario_linha") {
                this.symbleTable.push(["comentario",classe,posicao,lineNumber]);
				classe = "";
                token = "";  
                break;
            } else if (classe_anterior == "comentario_multilinha") {
                if(char=='*/') {                    
                    classe = "";
                    token = "";
                }    
                continue;                            
            }
            
             if(token == '"'){
                 classe = "string";
                 //verificar string
             } else if (token == '//') {                
                 classe = "comentario_linha";                
             } else if (token == '/*') {
                 classe = "comentario_multilinha";
                 this.symbleTable.push(["comentario",classe,posicao,lineNumber]);
             } else if (/boolean\s|char\s|class\s|double\s|new\s|return\s/i.test(token)) {
                 classe = "palavra_reservada_c_espaco";
             } else if (/break;|continue;/i.test(token)) {
                 classe = "palavra_reservada_s_espaco";
             } else if (/else{|if{|while{/i.test(token)) {
                 classe = "palavra_reservada_s_espaco";
             } else if (/\+|-|\*|=/i.test(token)){
				 classe = "operacao";				               
             } else if (/^[a-zA-Z](\d|[a-zA-Z])*$/.test(token)){
                 classe = "identificador";
             } else if (/^\d+(\.\d+)?$/.test(token)) {
				 classe = "numero";
			 } else if (char == " ") {	
				 classe = classe_anterior;			 
				 token = token.substring(0,token.length-1);
             } else if (char == ";"){
				 if(classe_anterior!=""){
					this.symbleTable.push([token.substring(0,token.length-1),classe_anterior,posicao,lineNumber]);
					classe = "";
					token = "";
				 }
			 }

			 if (classe == "palavra_reservada_c_espaco") {
					this.symbleTable.push([token,classe,posicao,lineNumber]);
					classe = "";
					token = "";
					continue;
			}
			if (classe == "palavra_reservada_s_espaco"){
				this.symbleTable.push([token,classe,posicao,lineNumber]);
				classe = "";
				token = "";
				continue;
			}
			 
			if(classe_anterior != "" && classe != classe_anterior) {				
				if (classe_anterior == "identificador"){
					this.symbleTable.push([token.substring(0,token.length-1),classe_anterior,posicao,lineNumber]);					
					token = token[token.length-1];
				}								
			}
			
			if(classe=="operacao"){
				this.symbleTable.push([token,classe,posicao,lineNumber]);
				classe = "";
				token = "";
			}												
			
			classe_anterior = classe;

        }
		
		if(token.length>0) {
			alert("token não identificado " + token);	
		}

        if(classe == "comentario_multilinha") {
            return "comentario_multilinha";
        }
    }      
    //console.log(code.getRow(2));
}


function Code(){

    // a code is a composition of rows
    rows = [];   
    
    // return a row object at a position
    this.getRow = function(rowNumber){
        
        if( rowNumber < 1 || rowNumber > this.rowsCount() )
            cosole.log("getRow: linha solicitada nao existe");
            
        return rows[rowNumber-1];
    }

    //used by the graph interface to push rows inside the code object
    this.pushRow = function(number, text){
        rows.push( new Row(number, text) );
    }
    
    
    /* unnecessary
        // especial characters included
        // return the total of characters of all the code
    this.caractersLength = function(){
        var count = 0;
        for (var i = 0; i < this.rowsCount(); i++) {
            count += rows[i].text.length;      
        }
    }
    */

    // count of the total of rows of the code
    this.rowsCount = function(){

        var rowsCount = rows.length;
       
        if(rowsCount == 0)
            console.log("rowsCount: Não existe nenhuma linha preenchida");

        return rowsCount;
    }

    this.toString = function(){
        var string = "";
        var qtdRows = this.rowsCount();

        for (var i = 0; i < qtdRows; i++) {
            string += rows[i].text; 
            if( i < qtdRows-1 )
                string += "\n";      
        }
        return string;
    }

    this.getCharAt = function(i, j){
        return this.getRow(i).getCol(j);
    }

    this.isEOF = function(i, j){
        var lastRow = code.rowsCount();
        var lastCharOnLastRow = code.getRow(lastRow).lastCharPosition();

        if(i == lastRow && j == lastCharOnLastRow+1){
            return true;
        }
        else    
            return false;
    }

}



// a row
function Row(number, codeText){
    this.number = number;
    this.text = codeText;

    this.length = function length(){
        return this.text.length;
    }

    this.getCol = function(colNumber){
        
        if( colNumber < 1 || colNumber > this.length() )
            cosole.log("getCol: coluna solicitada nao existe");
        
        return this.text[colNumber-1];     

    }

    this.lastCharPosition = function(){
        return this.getCol.length();
    }
}