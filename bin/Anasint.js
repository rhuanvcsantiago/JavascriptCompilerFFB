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
        var derivations = BNF[startElement].derivations;
        var firstFounded = false;

        for(var i = 0; i < derivations.length; i++){
            // se ainda nao achou o primeiro terminal 
            // OU se a derivacao é diferente do elemento analisado -> nao entrar em loop
            if( !firstFounded || (derivations[i] != analysedElement) ){
                
                if( isTerminal( derivations[i] ) ) {
                    this.first( derivations[i], analysedElement );
                } else {
                    this.BNF[analysedElement].first.push( derivations[i] );
                    firstFounded = true;
                }
            }    
        }
    }

    // the first nonTerminal of a brother-terminal derivation
    this.follow = function(startElement){
  
    }

    this.firstAndFollow = function(tokenCode, startElement){
        this.first (startElement);
        this.follow(startElement);
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
