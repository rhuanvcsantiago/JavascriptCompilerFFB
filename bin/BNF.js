function BNF(){

    this.dictionary = {};

    this.load = function(){
        this.dictionary = new Dictionary();
    }

    this.rule = function(ruleName){
        return this.dictionary.rule(ruleName);
    }

    this.rules = function(){
        return this.dictionary.rules();
    }

    this.term = function(term){
        return this.dictionary.terms.get(term);
    }

    this.terms = function(){
        return Object.values(this.dictionary.terms.array);
    }

  

}

function Dictionary(){
    this.terms    = new Terms();
    var rules    = {};

    this.add = function(nonTerminal, termsArray){
       
        if ( !this.rules[nonTerminal] )
            this.rules[nonTerminal] = [];

        this.rules[nonTerminal].push( termsArray );    

    }

    this.rule = function(ruleName){
        if( this.rules[ruleName] )
            return this.rules[ruleName];
        return false;    
    }    

}

function Terms(){
    var array = {}; 
   
    this.get = function(symbol){
        return array[symbol] || false;
    }

    this.add = function(symbol){
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
}

function Symbol(){
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




