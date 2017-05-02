function Anasint(){

    this.BNF = [];

    this.readBNF = function(codeFile){
        
        this.BNF = [];

        for( var i = 0; i < codeFile.rowsCount(); i++ ) {
            
            var codeRow = codeFile.rowAt(i);
            codeRow.text = codeRow.text.trim();

            if ( !codeRow.isEmpty() ){
                var rowTextSplit = codeRow.text.split( " = " );

                if( rowTextSplit.length != 2 ){
                    throw new Error("BNF READ: line with wrong sintax. More than one attribution or white space missing.")
                }

                var leftMember   = rowTextSplit[0].trim();
                var rightMembers = rowTextSplit[1].trim();

                var rightMembersArray = rightMembers.split( " " );
                rightMembersArray.remove("");

                if ( this.BNF[leftMember] == undefined ){
                    this.BNF[leftMember] = {};
                    this.BNF[leftMember].derivations = [];
                    this.BNF[leftMember].first = [];
                    this.BNF[leftMember].follow = [];
                }

                this.BNF[leftMember].derivations.push( rightMembersArray );   
            }      
        }
    }

    // the first nonTerminal of a terminal derivation
    this.first = function(startElement, analysedElement) {
        var derivations = this.BNF[startElement].derivations;
       

        for(var j = 0; j< derivations.length ;j++) {
            
            var firstFounded = false;
            var rule = derivations[j];

            for(var i = 0; i < rule.length; i++){
                // se ainda nao achou o primeiro terminal 
                // OU se a derivacao é diferente do elemento analisado -> nao entrar em loop
                if( !firstFounded && (rule[i] != analysedElement) && (startElement != rule[i]) ){
                    
                    if( this.isTerminal( rule[i] ) ) {
                        firstFounded = this.first( rule[i], analysedElement );
                    } else {
                        var alreadyInSet = this.BNF[analysedElement].first.indexOf( rule[i] );
                        
                        if(alreadyInSet == -1)
                            this.BNF[analysedElement].first.push( rule[i] );

                        firstFounded = true;
                    }
                }    
            }
        }

        return firstFounded;
    }

    // the first nonTerminal of a brother-terminal derivation
    this.follow = function(element){
        //pegar o index of de cada regra
        var firstsArray = [];
        
        var leftTerms = Object.keys(this.BNF)
       
        for( var k=0; k< leftTerms.length; k++){

            var leftTermIndex = leftTerms[k];
            var derivations = this.BNF[leftTermIndex].derivations;

            for( var i = 0; i < derivations.length; i++ ){

                var rule = derivations[i];
                var index = rule.indexOf(element);
            
                if( index != -1 ) {
                    var nextElementIndex = index+1;
                    var nextElement = "";
                    
                    if( nextElementIndex >= rule.length )
                        nextElement = "ε";
                    else
                        nextElement = rule[nextElementIndex];

                    if( firstsArray.indexOf( nextElement ) == -1 )
                        firstsArray.push( nextElement );  
                }       
            } 
        }

        for( var i = 0; i<firstsArray.length; i++ ){
            var term = firstsArray[i];

            if( this.isTerminal(term) ) {
                this.BNF[element].follow = this.BNF[element].follow.concat( this.BNF[term].first );               
            } else{
                this.BNF[element].follow =  this.BNF[element].follow.concat( term );  
            }
        }

        //this.BNF[element].follow = firstsArray;    
    }

    this.generateFirstAndFollow = function(){
        
        var leftTerms = Object.keys(this.BNF);

        for(var i=0; i< leftTerms.length; i++) {
            this.first( leftTerms[i], leftTerms[i] );            
        };

        for(var i=0; i< leftTerms.length; i++) {
            this.follow( leftTerms[i] );            
        };
   
    }

    this.isTerminal = function(element) {
        if(element[0] == "<"){
            return true;
        }

        return false;
    }

}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
