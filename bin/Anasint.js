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
                    this.BNF[leftMember].startSymbol = i==0;
                    this.BNF[leftMember].derivations = [];
                    this.BNF[leftMember].first = [];
                    this.BNF[leftMember].follow = false;
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
    this.calculateFollows = function(){
        var leftTerms = Object.keys(this.BNF);

        for(var i=0; i<leftTerms.length; i++) {
            this.calculateFollow(leftTerms[i]);
        }
    }

    this.calculateFollow = function(element) {
        if(this.BNF[element].follow) {
            return this.BNF[element].follow;
        }

        this.BNF[element].follow = [];

        if(this.BNF[element].startSymbol) {
            this.BNF[element].follow.push('$');
        }

        var rules = this.BNF[element].derivations;
        for(var rule in rules) {

        }

    }

    this.generateFirstAndFollow = function(){
        
        var leftTerms = Object.keys(this.BNF);

        for(var i=0; i< leftTerms.length; i++) {
            this.first( leftTerms[i], leftTerms[i] );            
        };

        this.calculateFollows();
   
    }

    this.parse = function( string ){

    }

    this.recursive = function(){

    }


    this.isTerminal = function(element) {
        if(element[0] == "<"){
            return true;
        }

        return false;
    }

    this.isNonTerminal = function(element) {
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
