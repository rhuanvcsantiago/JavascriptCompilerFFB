function Anasint() {

    this.BNF = [];

    this.readBNF = function (codeFile) {

        this.BNF = [];

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

    this.calculateFollow = function (element) {
        if (this.BNF[element].follow) {
            return this.BNF[element].follow;
        }

        this.BNF[element].follow = [];

        if (this.BNF[element].startSymbol) {
            this.BNF[element].follow.push('$');
        }

        var rules = this.BNF[element].derivations;
        for (var rule in rules) {

        }

    }

    this.generateFirstAndFollow = function () {

        var leftTerms = Object.keys(this.BNF);

        for (var i = 0; i < leftTerms.length; i++) {
            this.first(leftTerms[i], leftTerms[i]);
        };

        this.calculateFollows();

    }

    this.parse = function (tokenCode, firstRule) {

        var gramatica = function (regrasProducao, stringSimboloInicial) {

            this.regrasProducao = regrasProducao;
            this.simboloInicial = stringSimboloInicial;
            this.flag = false;
        }

        function ehSimboloNaoTerminal(simbolo) {
            if (element[0] == "<") {
                return true;
            }

            return false;
        }


        function aplicarRegra(composicao, regra, i) {
            var primeiraParte = composicao.slice(0, i);
            var segundaParte = composicao.slice(i + 1, composicao.length);
            return primeiraParte + regra + segundaParte;
        }

        function procuraSimboloNaoTerminal(composicao) {
            for (var i = 0; i < composicao.length; i++) {
                var simbolo = composicao[i];
                if ( ehSimboloNaoTerminal(simbolo) ) // TODO-PERFORMANCE da pra siar do loop assim que achar
                    return { caracter: simbolo, posicao: i };
            }
            return false;
        }

        function recursao(composicao, palavra, gram) {

            // [CONDICAO DE PARARA] 
            // tamanho da string formada, maior que a palavra informada
            if (composicao.length > palavra.length) {
                console.log("VALUE: FALSE \tSTATS:MAIOR \tWORD: " + composicao);
                return false;
            }

            // Procura pora simbolos nãoTerminais na string composicao     
            var simboloNaoTerminal = procuraSimboloNaoTerminal(composicao);

            // [CONDICAO DE PARARA] 
            // se não possui nenhum simbolo NãoTerminal na string composicao
            if (!simboloNaoTerminal) {
                // verificar se a string composicao é igual a palavra procurada
                if (composicao == palavra) {
                    console.log("VALUE: TRUE \tSTATS:IGUAL \tWORD: " + composicao);
                    gram.flag = "true";
                    return true;
                }
                console.log("VALUE: FALSE \tSTATS:DIFF  \tWORD: " + composicao);
                return false;
            }

            var regrasProducaoSimbolo = gram.regrasProducao[simboloNaoTerminal.caracter];
            for (var i = 0; i < regrasProducaoSimbolo.length; i++) {
                var novaComposicao = aplicarRegra(composicao, regrasProducaoSimbolo[i], simboloNaoTerminal.posicao);
                if (recursao(novaComposicao, palavra, gram))
                    return true;
            }
            return false;
        }

        var gram = new gramatica(regrasProducao, stringSimboloInicial);

        return recursao(composicao, palavra.slice(), gram);

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
