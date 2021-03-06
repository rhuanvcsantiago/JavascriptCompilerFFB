function Compiler(){

    this.codeFile  = new CodeFile(); //nova modelagem -> pode ser um array de arquivos -> abre possibilidade
    this.anaLex    = new Analex();
    this.anaSint   = new FirstFollow();
    this.anaSem    = new Anasem();
    

    // Function witch runs evetime a Key is pressed.
    this.runOnKeyUp = function(){

        function logBonitinho(msgm, type){

            switch (type) {
                case "info":
                    var css = "background: #222; color: #bada55; font-size: 12px; display: block;";
                    break;
                case "data":
                    var css = "background: white;";
                    break;    
                default:
                    var css = ""
                    break;
            }

            console.log("%c"+msgm, css);
        }

       function printSymbolsTable(symbolsTable){
           var string = "";
           var count = 0;
            Object.keys(symbolsTable.array).forEach(function(key){                            
                count++;
                var token  = key;
                var classe = symbolsTable.array[key].classe;
                var positions = symbolsTable.array[key].positions;

                string += "token: " + token + "\nclass: " + classe + "\npositions: ";

                for (var i = 0; i < positions.length; i++) {
                    var pos = positions[i];
                    string += "(" + pos.row + "," + pos.col + ")";
                }

                string += "\n\n";    

                
            })
            string = "tabela simbolos ==== qtd:" + count + " ==== \n\n" + string;
            logBonitinho(string, "data");            
        }

        function printError(error){
            var string = "erros ==== qtd:" + error.length + " ==== \n\n";
            for (var i = 0; i < error.length; i++) {
                var element = error[i];
                string += "erro: " + element[0]+"\nposition("+element[1].row+","+element[1].col+")\n\n";
            }
            logBonitinho(string, "data");
        }

        console.clear();
        console.log("%c=rhuan=============================\n===========  DEBUG ===========\n==============================", "background: black; color: white; font-size: 20px; display: block;")
       
        logBonitinho("Código Lido:", "info");
        logBonitinho( this.codeFile.toString(), "data" );
       
        logBonitinho("Executando anaLex...", "info");
        console.time();
        this.anaLex.tokenCode == "";
        this.anaLex.tokenizer(this.codeFile);
        console.timeEnd("Tempo de execução:");

        logBonitinho("Token Código Interpretado:", "info");
        logBonitinho( this.anaLex.tokenCodeString.join(""), "data" );
        
        logBonitinho("Tabela de Simbolos:", "info");
        printSymbolsTable(this.anaLex.symbolsTable);
        
        logBonitinho("Array de Erros:", "info");
        printError(this.anaLex.error);

        logBonitinho("Analise sintatica:", "info");
        
        if( (this.anaLex.error.length == 0) && (this.anaLex.tokenCodeArray.length > 0) )   {
           
            var analexResult = this.anaSint.parse(this.anaLex.tokenCodeArray);
            //logBonitinho(analexResult, "info");
            this.anaSem.contextAnaliser(this.anaSint.anaSemStack);
            this.anaSem.execute(this.anaSint.anaSemStack);
            
        }         

    }
}