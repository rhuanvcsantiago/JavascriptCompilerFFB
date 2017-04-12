function BNF(){

    this.dictionary = {};

    function isWhiteSpace(char){
        return (char.charCodeAt(0) == 160 || char.charCodeAt(0) == 32);
    }

    this.loadBNF = function( codeFile ) {
        this.dictionary = new Dictionary();

        for( var i = 0 ; i < codeFile.rowsCount() ; i++ ) {

            var row = codeFile.rowAt(i);
            var rowSplit = row.text.split(" = ");
            var leftTerm = rowSplit[0];
            var rightTerm = rowSplit[1];

            
            for (var j = 0 ; j < row.length()-1 ; j++ ) {
            
               
                    
                }       
             } // END FOR -> colunas
            this.dictionary.addRule(leftTerm, rightTerms);
        } // END FOR -> linhas
    } // END function loadBNF
    /*
    this.loadBNF = function( codeFile ) {
        this.dictionary = new Dictionary();

        for( var i = 0 ; i < codeFile.rowsCount() ; i++ ) {

            var leftTerm = "";
            var rightTerms = [];
            var row = codeFile.rowAt(i);
            
            for (var j = 0 ; j < row.length()-1 ; j++ ) {
            
                var char = codeFile.rowAt(i).colAt(j);
                var temp_string = "";
                
                // <PROGRAM>       = <INIT_PROGRAM> <MAIN_PROGRAM> 
                // se NAO for espaço em branco ou IGUAL
                if ( !( isWhiteSpace(char) || char=="=" ) ) {
                    
                    if ( char == "<" ){

                        j++;
                        while( char != ">" ){
                            temp_string += codeFile.rowAt(i).colAt(j);
                        }

                        if ( leftTerm == "" ) {
                            leftTerm = temp_string;
                        } else { 
                            rightTerms.push(temp_string);
                        }    
                    } else {

                        while( !isWhiteSpace(char) ){
                            temp_string += codeFile.rowAt(i).colAt(j);
                        }

                        rightTerms.push(temp_string);
                    }
                } // END IF -> se for espaço em branco, pula.       
             } // END FOR -> colunas
            this.dictionary.addRule(leftTerm, rightTerms);
        } // END FOR -> linhas
    } // END function loadBNF
    */
} //END CLASS BNF

function Dictionary(){
    this.terms    = {};
    this.rules    = {};

    this.addRule = function(nonTerminal, termsArray){
       
        if ( !this.rules[nonTerminal] )
            this.rules[nonTerminal] = [];

        this.rules[nonTerminal].push( termsArray );    

    }

    this.getRule = function(ruleName){
        if( this.rules[ruleName] )
            return this.rules[ruleName];
        return false;    
    }    

    /*
    this.getTerm = function(term){
        return terms[term] || false;
    }

    this.addTerm = function(symbol){
         if ( !array[symbol.value] )
            array[symbol.value] = symbol;
    }
        
    this.terminals = function(){
       return isSomething("isTerminal");
    }

    this.nonTerminals = function(){
       return isSomething("isNonTerminal");
    }

    function isSomething(method){
       var symbolsArray = Object.values(array);
       var responseArray = [];

       for(var i = 0; i < symbolsArray.length; i++ ){
           if( symbolsArray[i].type[method]() )
                responseArray.push(symbolsArray[i].value);
       }

       return responseArray;
    }

    this.exists = function(term){
        if (this.get(symbol))
            return true;
        return  false;
    }
    */

}

function Term(){
    this.type   = "";
    this.value  = "";

    var TERMINAL        = "terminal";
    var NON_TERMINAL    = "nonTerminal"; 

    this.isTerminal = function(){
        return is(TERMINAL);
    }

    this.isNonTerminal = function(){
        return is(NON_TERMINAL);
    }

    function is(type){
        if ( this.type == type)
            return true;
        return false;
    }
}




