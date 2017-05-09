function FirstFollow() {    
    var EPSILON = "<EPISILON>";
    this.BNF = [];
    this.startSymbol = null;
    this.error = []  
    this.predictSetTable = [];  

    this.readBNF = function (codeFile) {

        this.BNF = [];
        this.startSymbol = null;

        for (var i = 0; i < codeFile.rowsCount(); i++) {

            var codeRow = codeFile.rowAt(i);
            codeRow.text = codeRow.text.trim();

            if (!codeRow.isEmpty()) {
                var rowTextSplit = codeRow.text.split(" = ");

                if (rowTextSplit.length != 2) {
                    throw new Error("BNF READ: line with wrong sintax. More than one attribution or white space missing.")
                }

                var leftMember = rowTextSplit[0].trim();
                var rightMembers = rowTextSplit[1].trim();

                var rightMembersArray = rightMembers.split(" ");
                rightMembersArray.remove("");

                if(i==0) {
                    this.startSymbol = leftMember;
                }

                if (this.BNF[leftMember] == undefined) {
                    this.BNF[leftMember] = {};
                    this.BNF[leftMember].leftMember = leftMember;
                    this.BNF[leftMember].startSymbol = i == 0;
                    this.BNF[leftMember].derivations = [];
                    this.BNF[leftMember].terminal = true;
                    this.BNF[leftMember].first = false;
                    this.BNF[leftMember].follow = false;
                }
                if(/<.*>/.test(rightMembers)) {
                    this.BNF[leftMember].terminal = false;
                }
                this.BNF[leftMember].derivations.push(rightMembersArray);
            }
        }
    }

    this.buildFirstSets = function() {
        var keys = Object.keys(this.BNF);
        for (var k = 0; k < keys.length; k++) {
            this.firstOf(keys[k]);
        }
    }

    this.buildFollowSets = function() {
        var keys = Object.keys(this.BNF);
        for (var k = 0; k < keys.length; k++) {
            this.followOf(keys[k]);
        }
    }

    this.isTerminal = function(symbol) {     
        return this.BNF[symbol].terminal;
    }

    this.followOf = function(symbol) {

        if (this.BNF[symbol].follow) {
            return this.BNF[symbol].follow;
        }

        var follow = this.BNF[symbol].follow = {};

        if (this.BNF[symbol].startSymbol) {
            follow['$'] = true;
        }

        var productionsWithSymbol = this.getProductionsWithSymbol(symbol);
        for (var k = 0; k < productionsWithSymbol.length; k++) {
            var keyDerivated = productionsWithSymbol[k][0]; 
            var derivation = productionsWithSymbol[k][1];
            

            var symbolIndex = derivation.indexOf(symbol);
            var followIndex = symbolIndex + 1;

            while (true) {
                if (followIndex === derivation.length) { // "$"
                    if (keyDerivated !== symbol) { // To avoid cases like: B -> aB
                        this.merge(follow, this.followOf(keyDerivated));
                    }
                    break;
                }

                var followSymbol = derivation[followIndex];

                var firstOfFollow = this.firstOf(followSymbol);

                if (!firstOfFollow[EPSILON]) {
                    this.merge(follow, firstOfFollow);
                    break;
                }

                this.merge(follow, firstOfFollow, [EPSILON]);
                followIndex++;
            }
        }

        return follow;
    }

    this.firstOf = function(symbol) {
        if (this.BNF[symbol].first) {
            return this.BNF[symbol].first;
        }

        var first = this.BNF[symbol].first = {};

        if (this.isTerminal(symbol)) {
            first[symbol] = true;
            return this.BNF[symbol].first;
        }

        var productionsForSymbol = this.BNF[symbol].derivations;
        for (var k = 0; k < productionsForSymbol.length; k++) {
            var derivation = productionsForSymbol[k];
            for (var i = 0 ; i < derivation.length ; i++) {
                var productionSymbol = derivation[i];
                if (productionSymbol === EPSILON) {
                    first[EPSILON] = true;
                    break;
                }

                var firstOfNonTerminal = this.firstOf(productionSymbol);

                if (!firstOfNonTerminal[EPSILON]) {
                    this.merge(first, firstOfNonTerminal);
                    break;
                }

                this.merge(first, firstOfNonTerminal, [EPSILON]);
            }
        }

        return first;
    }

    this.getProductionsWithSymbol = function(symbol) {
        var productionsWithSymbol = [];
        var keys = Object.keys(this.BNF);
        for (var k = 0 ; k < keys.length; k++) {
            var derivations = this.BNF[keys[k]].derivations;
            for(var i = 0 ; i < derivations.length; i++) {
                if(derivations[i].indexOf(symbol)!==-1) {
                    productionsWithSymbol.push([keys[k],derivations[i]]);
                }
            }
        }
        return productionsWithSymbol;
    }

    this.merge = function(to, from, exclude) {
        exclude || (exclude = []);
        for (var k in from) {
            if (exclude.indexOf(k) === -1) {
                to[k] = from[k];
            }
        }
    }

    this.printFirsts = function() {
        var keys = Object.keys(this.BNF);
        for (var k = 0; k < keys.length; k++) {
            var teste = Object.keys(this.BNF[keys[k]].first);            
            console.log("Elemento: " + keys[k] + " Firsts: " + teste);
        }
    }

    this.printFollows = function() {
        var keys = Object.keys(this.BNF);
        for (var k = 0; k < keys.length; k++) {
            var teste = Object.keys(this.BNF[keys[k]].follow);            
            console.log("Elemento: " + keys[k] + " Follows: " + teste);
        }
    }

    this.buildFirstsAndFollows = function() {
        this.buildFirstSets();
        this.buildFollowSets();
    }

    this.calculatePredictSetTable = function() {        
        var keys = Object.keys(this.BNF);
        var terminalSymbols = [];
        var nonTerminalSymbols = [];
        var predictSetTable = this.predictSetTable = [];
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            if(this.BNF[key].terminal) {
                terminalSymbols.push(key);
            } else {
                nonTerminalSymbols.push(key);
                predictSetTable[key] = [];
                var derivations = this.BNF[key].derivations;
                for(var d=0; d<derivations.length; d++) {
                    var derivation = derivations[d];
                    var result = [];
                    if(derivation[0] == EPSILON) {
                        result = this.followOf(key);
                    } else {
                        result = this.firstOf(derivation[0]);
                    }
                    var resultKeys = Object.keys(result);
                    for(var r = 0; r<resultKeys.length; r++) {
                        if(predictSetTable[key][resultKeys[r]] == undefined) {
                            predictSetTable[key][resultKeys[r]] = derivation;
                        } else {
                            throw new Error("Já existe regra para: " + key + " em " + resultKeys[r] + " Tinha antes: " + predictSetTable[key][resultKeys[r]].join(",") );
                        }                        
                    }
                }
            }
        }
        return predictSetTable;
    }

    this.parse = function(codeArray){
        this.buildFirstsAndFollows();
        this.calculatePredictSetTable();
        var stack = [];
        stack.push('$');
        stack.push(this.startSymbol);
        codeArray[codeArray.length] = {classe:'$'};
        for(var c = 0; c < codeArray.length; c++) {
            var token = this.getTokenClass(c,codeArray);
            console.log(token);
            console.log(stack.join(','));
            if(token == stack[stack.length-1]) {
                stack.pop();
            } else {                
                var symbol = stack.pop();
                if( symbol == "$" ) {
                    throw new Error('Erro Sintático - Token não esperado: ' + this.getTokenClass(c,codeArray) 
                                + " Token: [" + this.getTokenName(c,codeArray) 
                                + "] Posição: " + this.getTokenPosition(c,codeArray) );
                }
                if(this.BNF[symbol].terminal) {
                    throw new Error('Erro Sintático - Token Esperado: ' + this.BNF[symbol].derivations.join(" ou ") 
                                + "Token recebido: " + this.getTokenClass(c,codeArray) 
                                + " Token: [" + this.getTokenName(c,codeArray) 
                                + "] Posição: " + this.getTokenPositionExpected(c,codeArray));
                }
                var rules = this.predictSetTable[symbol][token];
                if ( rules == undefined ) {
                   throw new Error('Erro Sintático - Token não esperado: ' + this.getTokenClass(c,codeArray) 
                                + " Token: " + this.getTokenName(c,codeArray) 
                                + " Posição: " + this.getTokenPosition(c,codeArray) );
                } else {
                   for(var i = rules.length-1; i>=0;i-- ) {
                       if(rules[i] != EPSILON) {
                           stack.push(rules[i]);
                       }                       
                   }
                }
                c--;
            }
        }
    }

    this.getTokenClass = function(position,codeArray){
        return codeArray[position].classe;
    }

    this.getTokenPosition = function(position,codeArray){
        return codeArray[position].position.row + "," + codeArray[position].position.col;
    }

    this.getTokenName = function(position,codeArray){
        return codeArray[position].token;
    }

    this.getTokenPositionExpected = function(position,codeArray){
        return codeArray[position].position.row + "," + (codeArray[position].position.col+codeArray[position].token.length-1);
    }

}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};