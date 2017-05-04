function Anasint() {

    this.BNF = [];
    this.firstRuleName = [];

    this.readBNF = function (codeFile) {

        this.BNF = [];
        this.firstRuleName = [];

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

                if( i == 0 )
                    this.firstRuleName.push(leftMember);

                var rightMembersArray = rightMembers.split(" ");
                rightMembersArray.remove("");

                if (this.BNF[leftMember] == undefined) {
                    this.BNF[leftMember] = {};
                    this.BNF[leftMember].startSymbol = i == 0;
                    this.BNF[leftMember].derivations = [];
                    this.BNF[leftMember].first = [];
                    this.BNF[leftMember].follow = false;
                }

                this.BNF[leftMember].derivations.push(rightMembersArray);
            }
        }
    }

    // the first nonTerminal of a terminal derivation
    this.first = function (startElement, analysedElement) {
        var derivations = this.BNF[startElement].derivations;


        for (var j = 0; j < derivations.length; j++) {

            var firstFounded = false;
            var rule = derivations[j];

            for (var i = 0; i < rule.length; i++) {
                // se ainda nao achou o primeiro terminal 
                // OU se a derivacao é diferente do elemento analisado -> nao entrar em loop
                if (!firstFounded && (rule[i] != analysedElement) && (startElement != rule[i])) {

                    if (this.isNonTerminal(rule[i])) {
                        firstFounded = this.first(rule[i], analysedElement);
                    } else {
                        var alreadyInSet = this.BNF[analysedElement].first.indexOf(rule[i]);

                        if (alreadyInSet == -1)
                            this.BNF[analysedElement].first.push(rule[i]);

                        firstFounded = true;
                    }
                }
            }
        }

        return firstFounded;
    }

    // the first nonTerminal of a brother-terminal derivation
    this.calculateFollows = function () {
        var leftTerms = Object.keys(this.BNF);

        for (var i = 0; i < leftTerms.length; i++) {
            this.calculateFollow(leftTerms[i]);
        }
    }

/*
    this.calculateFollow = function (element) {
        if (this.BNF[element].follow) {
            return this.BNF[element].follow;
        }

        this.BNF[element].follow = {};

        if (this.BNF[element].startSymbol) {
            this.BNF[element].follow.push('$');
        }

        var rules = this.BNF[element].derivations;
<<<<<<< Updated upstream
        for (var rule in rules) {
=======
        for(var rule in rules) {
            if(rule == "ε") {
                this.BNF[element].follow["ε"] = true;
                break;
            }

            var firstOfNonTerminal = this.first(rule);
            if (!firstOfNonTerminal[EPSILON]) {
                merge(first, firstOfNonTerminal);
                break;
            }
>>>>>>> Stashed changes

            merge(first, firstOfNonTerminal, [EPSILON]);
        }

    }*/

    this.generateFirstAndFollow = function () {

        var leftTerms = Object.keys(this.BNF);

        for (var i = 0; i < leftTerms.length; i++) {
            this.first(leftTerms[i], leftTerms[i]);
        };

        this.calculateFollows();

    }

    this.parse = function (tokenCodeArray, firstRule, regrasProducaoBNF ) {

        var gram = {
                        regrasProducao: regrasProducaoBNF,
                        simboloInicial: firstRule,
                   };

        
        function ehSimboloNaoTerminal(simbolo, gram) {
            
            // se nao achar regra de producao para determinado nao terminal, 
            // eh porque ele eh uma regra de producao de um terminal e nao consta na BNF por conta de regex
            if(gram.regrasProducao[simbolo] == undefined)
                return false;

            var regraProducao = gram.regrasProducao[simbolo].derivations[0];
            
            // se tem mais de uma regra de producao, nao é NAO terminal.
            if( (regraProducao[0][0] == "<") && ( regraProducao[0].length > 1 ) )
                return true;
               
            return false;
        }

        function aplicarRegra(composicaoArray, regraArray, i) {

            var comp = composicaoArray.slice(0);

            comp.splice( i, 1, regraArray[0] );

            for (var j = 1; j < regraArray.length; j++) {
                
                comp.splice( i+j, 0, regraArray[j] );                
                
            }
            
            return comp;
            
        }

        function procuraSimboloNaoTerminal(composicaoArray, gram) {
            for (var i = 0; i < composicaoArray.length; i++) {
                var simbolo = composicaoArray[i];
                if ( ehSimboloNaoTerminal(simbolo, gram) ) // TODO-PERFORMANCE da pra siar do loop assim que achar
                    return { caracter: simbolo, posicao: i };
            }
            return false;
        }

        //absdbsAAAAA <$bla><PROGRAM><$bla><$bla><EXPRESSION>

        function recursao(composicaoArray, tokenCodeArray, gram) {

            // [CONDICAO DE PARARA] 
            // tamanho da string formada, maior que a palavra informada
            if ( composicaoArray.length > tokenCodeArray.length ) {
                console.log( "VALUE: FALSE \tSTATS:MAIOR \tWORD: " + composicaoArray.join("") );
                return false;
            }

            // Procura pora simbolos nãoTerminais na string composicao     
            var objSimboloNaoTerminal = procuraSimboloNaoTerminal(composicaoArray, gram);

            // [CONDICAO DE PARADA] 
            // se não possui nenhum simbolo NãoTerminal na string composicao
            if (!objSimboloNaoTerminal) {
                // verificar se a string composicao é igual a palavra procurada
                if ( composicaoArray.join("") == tokenCodeArray.join("") ) {
                    console.log( "VALUE: TRUE \tSTATS:IGUAL \tWORD: " + composicaoArray.join("") );
                    return true;
                }
                console.log("VALUE: FALSE \tSTATS:DIFF  \tWORD: " + composicaoArray.join(""));
                return false;
            }

            var regrasProducaoSimbolo = gram.regrasProducao[objSimboloNaoTerminal.caracter].derivations;
            for (var i = 0; i < regrasProducaoSimbolo.length; i++) {
                var novaComposicaoArray = aplicarRegra(composicaoArray, regrasProducaoSimbolo[i], objSimboloNaoTerminal.posicao);
                if (recursao(novaComposicaoArray, tokenCodeArray, gram))
                    return true;
            }
            return false;
        }

        return recursao(firstRule, tokenCodeArray, gram);

    }

    //aaaaaaaa
    // imputString = 
    this.recursive = function (tokenCode, derivatedString, rule) {

        


    }


    this.isNonTerminal = function (element) {
        if (element[0] == "<") {
            return true;
        }

        return false;
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
