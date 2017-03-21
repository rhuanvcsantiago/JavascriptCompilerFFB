function Compiler(){

    this.codeFile = new CodeFile(); //nova modelagem -> pode ser um array de arquivos -> abre possibilidade
    this.analex   = new Analex();
    this.anasint  = new Anasint();
    
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
                string += "erro: " + element[0]+"\nposition("+element[1].linha+","+element[1].coluna+")\n\n";
            }
            logBonitinho(string, "data");
        }

        console.clear();
        console.log("%c==============================\n===========  DEBUG ===========\n==============================", "background: black; color: white; font-size: 20px; display: block;")
        logBonitinho("Código Lido:", "info");
        logBonitinho( this.codeFile.toString(), "data" );
        logBonitinho("Executando Analex...", "info");
        console.time();

        this.analex.tokenizer(this.codeFile);
        
        console.timeEnd("Tempo de execução:");
        logBonitinho("Tabela de Simbolos:", "info");
        printSymbolsTable(this.analex.symbolsTable);
        logBonitinho("Array de Erros:", "info");
        printError(this.analex.error);



    }
}